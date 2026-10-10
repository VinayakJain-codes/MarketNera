import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ success: true, results: [] });
        }

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
            return NextResponse.json({ success: true, results: [] });
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

        return NextResponse.json({ success: true, results });
    } catch (err: any) {
        console.error("Geocoding search error:", err);
        return NextResponse.json({ success: true, results: [] });
    }
}
