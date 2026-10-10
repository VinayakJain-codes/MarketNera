import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng") || searchParams.get("lon");

        if (!lat || !lng) {
            return NextResponse.json(
                { success: false, error: "Latitude and longitude are required." },
                { status: 400 }
            );
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            return NextResponse.json(
                { success: false, error: "Invalid coordinate values." },
                { status: 400 }
            );
        }

        // Server-side fetch to Nominatim with proper User-Agent
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latNum}&lon=${lngNum}&format=json&addressdetails=1`;
        const res = await fetch(nominatimUrl, {
            headers: {
                "User-Agent": "MarketNera-Ecommerce/1.0 (contact@marketnera.com)",
                "Accept-Language": "en",
            },
            next: { revalidate: 1800 },
        });

        if (!res.ok) {
            throw new Error(`Reverse geocode failed with HTTP ${res.status}`);
        }

        const data = await res.json();
        const addr = data.address || {};

        // Build clean area string
        const parts = [
            addr.road,
            addr.neighbourhood,
            addr.suburb,
            addr.city_district,
            addr.residential,
        ].filter(Boolean);

        let area = parts.join(", ");
        if (!area) {
            area = (data.display_name || "").split(",").slice(0, 3).join(",") || "Selected Location";
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

        return NextResponse.json({
            success: true,
            area,
            displayName: data.display_name || area,
            city,
            pincode,
            state,
            lat: latNum,
            lng: lngNum,
        });
    } catch (error: any) {
        console.error("Reverse geocoding error:", error);
        // Resilient fallback so the UI never crashes or blocks the user
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get("lat") || "28.9845");
        const lng = parseFloat(searchParams.get("lng") || "77.7064");

        return NextResponse.json({
            success: true,
            area: "Selected Pin Location",
            displayName: "Selected Pin Location, Meerut",
            city: "Meerut",
            pincode: "250001",
            state: "Uttar Pradesh",
            lat,
            lng,
            isFallback: true,
        });
    }
}
