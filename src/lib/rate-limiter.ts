/**
 * Rate Limiter and In-Memory Cache for Google Maps and Geocoding APIs.
 * Protects against excessive API usage, cost overruns, and scraping.
 */

// Simple In-Memory LRU Cache with TTL
interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

class MemoryCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private readonly maxSize: number;
    private readonly defaultTtlMs: number;

    constructor(maxSize = 1000, defaultTtlMs = 1000 * 60 * 60 * 24) { // 24 hours default
        this.maxSize = maxSize;
        this.defaultTtlMs = defaultTtlMs;
    }

    get(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        // Refresh LRU order: delete and re-insert
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.value;
    }

    set(key: string, value: T, ttlMs?: number): void {
        if (this.cache.size >= this.maxSize) {
            // Evict oldest entry (first item in Map iterator)
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) this.cache.delete(oldestKey);
        }

        const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
        this.cache.set(key, { value, expiresAt });
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

// Global caches for Geocoding and Place searches
export const reverseGeocodeCache = new MemoryCache<{
    area: string;
    displayName: string;
    city: string;
    pincode: string;
    state: string;
    lat: number;
    lng: number;
}>(1000, 1000 * 60 * 60 * 24); // 24h cache

export const searchGeocodeCache = new MemoryCache<any[]>(500, 1000 * 60 * 60 * 6); // 6h cache

/**
 * Generate a cache key for lat/lng by rounding to ~11 meters precision (4 decimal places).
 * This prevents repetitive queries when a user micro-adjusts the map marker.
 */
export function getCoordCacheKey(lat: number, lng: number): string {
    return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

// Token Bucket / Sliding Window Rate Limiter
interface RateLimitTracker {
    timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitTracker>();

// Periodic garbage collection for rateLimitStore (clean every 5 mins)
let lastCleanup = Date.now();
function cleanupRateLimitStore(windowMs: number) {
    const now = Date.now();
    if (now - lastCleanup < 5 * 60 * 1000) return;
    lastCleanup = now;

    const threshold = now - windowMs;
    for (const [key, tracker] of rateLimitStore.entries()) {
        tracker.timestamps = tracker.timestamps.filter(ts => ts > threshold);
        if (tracker.timestamps.length === 0) {
            rateLimitStore.delete(key);
        }
    }
}

export interface RateLimitOptions {
    limit: number;       // Max allowed requests in the time window
    windowMs: number;    // Time window in milliseconds (e.g. 60000 = 1 minute)
    keyPrefix?: string;  // Prefix for key to isolate endpoints
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetInSeconds: number;
}

/**
 * Check if a client has exceeded their rate limit.
 */
export function checkRateLimit(
    identifier: string,
    options: RateLimitOptions
): RateLimitResult {
    const { limit, windowMs, keyPrefix = "rl" } = options;
    const now = Date.now();
    const key = `${keyPrefix}:${identifier}`;

    cleanupRateLimitStore(windowMs);

    let tracker = rateLimitStore.get(key);
    if (!tracker) {
        tracker = { timestamps: [] };
        rateLimitStore.set(key, tracker);
    }

    // Filter out timestamps outside the sliding window
    const windowStart = now - windowMs;
    tracker.timestamps = tracker.timestamps.filter(ts => ts > windowStart);

    const resetInSeconds = tracker.timestamps.length > 0
        ? Math.ceil((tracker.timestamps[0] + windowMs - now) / 1000)
        : Math.ceil(windowMs / 1000);

    if (tracker.timestamps.length >= limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            resetInSeconds: Math.max(1, resetInSeconds),
        };
    }

    tracker.timestamps.push(now);

    return {
        success: true,
        limit,
        remaining: Math.max(0, limit - tracker.timestamps.length),
        resetInSeconds: Math.max(1, resetInSeconds),
    };
}

/**
 * Extract client IP safely from request headers.
 */
export function getClientIp(request: Request): string {
    const headers = request.headers;
    const xForwardedFor = headers.get("x-forwarded-for");
    if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim();
    }
    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }
    const cfConnectingIp = headers.get("cf-connecting-ip");
    if (cfConnectingIp) {
        return cfConnectingIp.trim();
    }
    return "127.0.0.1";
}
