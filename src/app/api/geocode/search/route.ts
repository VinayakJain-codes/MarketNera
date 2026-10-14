import { NextResponse } from "next/server";
import {
    checkRateLimit,
    getClientIp,
    searchGeocodeCache,
} from "@/lib/rate-limiter";

export async function GET(request: Request) {
    const ip = getClientIp(request);

    // 1. Rate Limiting Protection (25 requests/minute per IP, 200 global/min)
    const ipLimit = checkRateLimit(ip, {
        limit: 25,
        windowMs: 60 * 1000,
        keyPrefix: "search_geo_ip",
    });

    const globalLimit = checkRateLimit("global", {
        limit: 200,
        windowMs: 60 * 1000,
        keyPrefix: "search_geo_global",
    });

    const rateLimitHeaders = {
        "X-RateLimit-Limit": String(ipLimit.limit),
        "X-RateLimit-Remaining": String(ipLimit.remaining),
        "X-RateLimit-Reset": String(ipLimit.resetInSeconds),
    };

    if (!ipLimit.success || !globalLimit.success) {
        return NextResponse.json(
            {
                success: false,
                error: "Too many search queries. Please wait a moment.",
                isRateLimited: true,
                results: [],
            },
            {
                status: 429,
                headers: {
                    ...rateLimitHeaders,
                    "Retry-After": String(ipLimit.resetInSeconds),
                },
            }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.trim().length < 2) {
            return NextResponse.json(
                { success: true, results: [] },
                { headers: rateLimitHeaders }
            );
        }

        const cleanQuery = query.trim().toLowerCase();

        // 2. In-Memory Cache Lookup
        const cached = searchGeocodeCache.get(cleanQuery);
        if (cached) {
            return NextResponse.json(
                { success: true, results: cached, isCached: true },
                { headers: rateLimitHeaders }
            );
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        // 3. Google Maps Geocoding Search (1 round-trip: returns coords + address)
        if (apiKey) {
            try {
                // Bias search to India & NCR/Meerut region
                const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    query.trim()
                )}&components=country:in&key=${apiKey}`;

                const res = await fetch(googleUrl, {
                    next: { revalidate: 3600 },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "OK" && data.results && data.results.length > 0) {
                        const results = data.results.slice(0, 5).map((item: any) => {
                            const components = item.address_components || [];
                            const getComp = (type: string) => {
                                const found = components.find((c: any) => c.types.includes(type));
                                return found ? found.long_name : "";
                            };

                            const city =
                                getComp("locality") ||
                                getComp("administrative_area_level_2") ||
                                getComp("administrative_area_level_3") ||
                                "Meerut";

                            const pincode = getComp("postal_code") || "";

                            return {
                                displayName: item.formatted_address,
                                lat: item.geometry.location.lat,
                                lng: item.geometry.location.lng,
                                city,
                                pincode,
                            };
                        });

                        searchGeocodeCache.set(cleanQuery, results);

                        return NextResponse.json(
                            { success: true, results, source: "google" },
                            { headers: rateLimitHeaders }
                        );
                    } else if (data.status === "OVER_QUERY_LIMIT") {
                        console.warn("Google Search OVER_QUERY_LIMIT. Falling back to OSM.");
                    }
                }
            } catch (googleErr) {
                console.error("Google search error:", googleErr);
            }
        }

        // 4. Fallback: OpenStreetMap Nominatim
        const encodedQuery = encodeURIComponent(query.trim());
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&addressdetails=1&limit=5`;

        const res = await fetch(nominatimUrl, {
            headers: {
                "User-Agent": "MarketNera-Ecommerce/1.0 (contact@marketnera.com)",
                "Accept-Language": "en",
            },
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: true, results: [] },
                { headers: rateLimitHeaders }
            );
        }

        const data = await res.json();
        const results = (data || []).map((item: any) => {
            const addr = item.address || {};
            const city =
                addr.city ||
                addr.town ||
                addr.village ||
                addr.county ||
                addr.state_district ||
                "";
            const pincode = addr.postcode || "";

            return {
                displayName: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                city,
                pincode,
            };
        });

        searchGeocodeCache.set(cleanQuery, results);

        return NextResponse.json(
            { success: true, results, source: "osm_fallback" },
            { headers: rateLimitHeaders }
        );
    } catch (err: any) {
        console.error("Geocoding search error:", err);
        return NextResponse.json(
            { success: true, results: [] },
            { headers: rateLimitHeaders }
        );
    }
}
