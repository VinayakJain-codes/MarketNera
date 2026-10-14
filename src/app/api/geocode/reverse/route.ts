import { NextResponse } from "next/server";
import {
    checkRateLimit,
    getClientIp,
    reverseGeocodeCache,
    getCoordCacheKey,
} from "@/lib/rate-limiter";

export async function GET(request: Request) {
    const ip = getClientIp(request);

    // 1. Rate Limiting Protection (30 requests/minute per IP, 250 global/min)
    const ipLimit = checkRateLimit(ip, {
        limit: 30,
        windowMs: 60 * 1000,
        keyPrefix: "rev_geo_ip",
    });

    const globalLimit = checkRateLimit("global", {
        limit: 250,
        windowMs: 60 * 1000,
        keyPrefix: "rev_geo_global",
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
                error: "Too many location requests. Please wait a few seconds before trying again.",
                isRateLimited: true,
                retryAfter: ipLimit.resetInSeconds,
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
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng") || searchParams.get("lon");

        if (!lat || !lng) {
            return NextResponse.json(
                { success: false, error: "Latitude and longitude are required." },
                { status: 400, headers: rateLimitHeaders }
            );
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            return NextResponse.json(
                { success: false, error: "Invalid coordinate values." },
                { status: 400, headers: rateLimitHeaders }
            );
        }

        // 2. In-Memory Cache Lookup (snapped to ~11m to save Google API costs)
        const cacheKey = getCoordCacheKey(latNum, lngNum);
        const cached = reverseGeocodeCache.get(cacheKey);
        if (cached) {
            return NextResponse.json(
                {
                    success: true,
                    ...cached,
                    isCached: true,
                },
                { headers: rateLimitHeaders }
            );
        }

        // 3. Check for Google Maps API Key
        const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (apiKey) {
            const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latNum},${lngNum}&key=${apiKey}`;
            const res = await fetch(googleUrl, {
                next: { revalidate: 3600 },
            });

            if (res.ok) {
                const data = await res.json();

                if (data.status === "OK" && data.results && data.results.length > 0) {
                    const topResult = data.results[0];
                    const components = topResult.address_components || [];

                    const getComp = (type: string, useShort = false) => {
                        const item = components.find((c: any) => c.types.includes(type));
                        return item ? (useShort ? item.short_name : item.long_name) : "";
                    };

                    const route = getComp("route");
                    const sublocality2 = getComp("sublocality_level_2");
                    const sublocality1 = getComp("sublocality_level_1");
                    const sublocality = getComp("sublocality");
                    const neighborhood = getComp("neighborhood");

                    const areaParts = [route, sublocality2 || sublocality1 || sublocality || neighborhood].filter(Boolean);
                    let area = areaParts.join(", ");
                    if (!area) {
                        area = topResult.formatted_address.split(",").slice(0, 2).join(",") || "Selected Location";
                    }

                    const city =
                        getComp("locality") ||
                        getComp("administrative_area_level_2") ||
                        getComp("administrative_area_level_3") ||
                        "Meerut";

                    const state = getComp("administrative_area_level_1") || "Uttar Pradesh";
                    const pincode = getComp("postal_code") || "250001";
                    const displayName = topResult.formatted_address || area;

                    const payload = {
                        area,
                        displayName,
                        city,
                        pincode,
                        state,
                        lat: latNum,
                        lng: lngNum,
                        address: {
                            addressLine: displayName || area,
                            city,
                            pincode,
                            state,
                        },
                    };

                    // Save in cache (24 hours)
                    reverseGeocodeCache.set(cacheKey, payload);

                    return NextResponse.json(
                        {
                            success: true,
                            ...payload,
                            source: "google",
                        },
                        { headers: rateLimitHeaders }
                    );
                } else if (data.status === "OVER_QUERY_LIMIT") {
                    console.warn("Google Geocoding OVER_QUERY_LIMIT encountered. Falling back gracefully.");
                } else {
                    console.warn(`Google Geocoding returned status: ${data.status}`);
                }
            }
        }

        // 4. Fallback: OpenStreetMap Nominatim if Google Maps Key is absent or quota exceeded
        try {
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latNum}&lon=${lngNum}&format=json&addressdetails=1`;
            const osmRes = await fetch(nominatimUrl, {
                headers: {
                    "User-Agent": "MarketNera-Ecommerce/1.0 (contact@marketnera.com)",
                    "Accept-Language": "en",
                },
                next: { revalidate: 1800 },
            });

            if (osmRes.ok) {
                const osmData = await osmRes.json();
                const addr = osmData.address || {};

                const parts = [
                    addr.road,
                    addr.neighbourhood,
                    addr.suburb,
                    addr.city_district,
                    addr.residential,
                ].filter(Boolean);

                let area = parts.join(", ");
                if (!area) {
                    area = (osmData.display_name || "").split(",").slice(0, 3).join(",") || "Selected Location";
                }

                const city =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    addr.county ||
                    addr.state_district ||
                    "Meerut";

                const pincode = addr.postcode || "250001";
                const state = addr.state || "Uttar Pradesh";

                const payload = {
                    area,
                    displayName: osmData.display_name || area,
                    city,
                    pincode,
                    state,
                    lat: latNum,
                    lng: lngNum,
                    address: {
                        addressLine: osmData.display_name || area,
                        city,
                        pincode,
                        state,
                    },
                };

                reverseGeocodeCache.set(cacheKey, payload);

                return NextResponse.json(
                    {
                        success: true,
                        ...payload,
                        source: "osm_fallback",
                    },
                    { headers: rateLimitHeaders }
                );
            }
        } catch (osmErr) {
            console.error("OSM fallback error:", osmErr);
        }

        // 5. Ultimate Fallback (Coordinates default so user can proceed without failing)
        const fallbackDisplayName = `Pin at ${latNum.toFixed(4)}, ${lngNum.toFixed(4)}`;
        return NextResponse.json(
            {
                success: true,
                area: "Selected Pin Location",
                displayName: fallbackDisplayName,
                city: "Meerut",
                pincode: "250001",
                state: "Uttar Pradesh",
                lat: latNum,
                lng: lngNum,
                address: {
                    addressLine: fallbackDisplayName,
                    city: "Meerut",
                    pincode: "250001",
                    state: "Uttar Pradesh",
                },
                isFallback: true,
            },
            { headers: rateLimitHeaders }
        );
    } catch (error: any) {
        console.error("Reverse geocoding unhandled error:", error);
        return NextResponse.json(
            {
                success: true,
                area: "Selected Pin Location",
                displayName: "Selected Pin Location",
                city: "Meerut",
                pincode: "250001",
                state: "Uttar Pradesh",
                lat: 28.9845,
                lng: 77.7064,
                address: {
                    addressLine: "Selected Pin Location, Meerut",
                    city: "Meerut",
                    pincode: "250001",
                    state: "Uttar Pradesh",
                },
                isFallback: true,
            },
            { headers: rateLimitHeaders }
        );
    }
}
