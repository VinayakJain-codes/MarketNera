"use client";

import { getLeafletIcon } from "@/lib/leaflet-icon-fix";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface LocationDetails {
    addressLine: string;
    houseNo: string;
    building?: string;
    landmark?: string;
    label?: "Home" | "Work" | "Other";
    city: string;
    pincode: string;
    lat: number;
    lng: number;
}

interface LeafletMapInnerProps {
    onLocationSelected: (locationDetails: LocationDetails) => void;
}

// Draggable marker that follows map center
function LocationMarker({ onMove }: { onMove: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onMove(e.latlng.lat, e.latlng.lng);
        },
        dragend() {
            const center = map.getCenter();
            setPosition(center);
            onMove(center.lat, center.lng);
        },
    });

    useEffect(() => {
        // Initialize position on mount
        const center = map.getCenter();
        setPosition(center);
    }, [map]);

    return position ? <Marker position={position} draggable icon={getLeafletIcon()} /> : null;
}

export default function LeafletMapInner({ onLocationSelected }: LeafletMapInnerProps) {
    const [step, setStep] = useState<"map" | "details">("map");

    const [lat, setLat] = useState<number>(28.6139); // Default: New Delhi
    const [lng, setLng] = useState<number>(77.2090);
    const [detectedArea, setDetectedArea] = useState<string>("Locating...");
    const [city, setCity] = useState<string>("");
    const [pincode, setPincode] = useState<string>("");
    
    // Address detail fields
    const [houseNo, setHouseNo] = useState("");
    const [building, setBuilding] = useState("");
    const [landmark, setLandmark] = useState("");
    const [label, setLabel] = useState<"Home" | "Work" | "Other" | undefined>(undefined);
    
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);
    const [locationAcquired, setLocationAcquired] = useState(false);

    const parseAddressData = (addr: Record<string, string>, displayName: string) => {
        // Build detected area starting from road level, skipping amenities
        const parts = [addr.road, addr.neighbourhood, addr.suburb, addr.city_district].filter(Boolean);
        let area = parts.join(", ");
        
        if (!area) {
            // Fallback to display name if we don't have good structured parts
            area = displayName.split(",").slice(0, 2).join(",") || "Unknown Area";
        }
        
        setDetectedArea(area);
        setCity(addr.city || addr.town || addr.village || addr.county || "");
        setPincode(addr.postcode || "");
    };

    const reverseGeocode = useCallback(async (latToFetch: number, lngToFetch: number) => {
        setIsFetching(true);
        try {
            const key = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;

            // Try LocationIQ first if key exists
            if (key && !key.includes("xxxxxxxxxx")) {
                const res = await fetch(
                    `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${latToFetch}&lon=${lngToFetch}&format=json`
                );
                if (res.ok) {
                    const data = await res.json();
                    parseAddressData(data.address || {}, data.display_name);
                    return;
                }
                console.warn("LocationIQ failed, falling back to Nominatim");
            }

            // Fallback: Nominatim (no API key needed, always works)
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latToFetch}&lon=${lngToFetch}&format=json`,
                { headers: { "Accept-Language": "en", "User-Agent": "Marketnera/1.0" } }
            );
            if (!res.ok) throw new Error("Nominatim failed");
            const data = await res.json();
            parseAddressData(data.address || {}, data.display_name);

        } catch (error) {
            console.error("Reverse geocode error:", error);
            setDetectedArea("Could not determine area");
            setCity("");
            setPincode("");
        } finally {
            setIsFetching(false);
        }
    }, []);

    // Get user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLat(pos.coords.latitude);
                    setLng(pos.coords.longitude);
                    setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                    reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                    setLocationAcquired(true);
                },
                (err) => {
                    console.warn("Geolocation blocked or failed", err);
                    reverseGeocode(lat, lng); // fallback to default
                    setLocationAcquired(true);
                },
                { timeout: 5000 }
            );
        } else {
            reverseGeocode(lat, lng);
            setLocationAcquired(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMove = useCallback((newLat: number, newLng: number) => {
        setLat(newLat);
        setLng(newLng);
        reverseGeocode(newLat, newLng);
    }, [reverseGeocode]);

    if (!locationAcquired) {
        return (
            <div className="w-full h-[400px] bg-slate-100 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin mb-2">sync</span>
                <p className="text-sm font-semibold text-slate-600">Acquiring Location...</p>
            </div>
        );
    }

    if (step === "details") {
        return (
            <div className="p-6 bg-white flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <button 
                        onClick={() => setStep("map")}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <h4 className="text-lg font-bold text-slate-800">Complete your address</h4>
                </div>

                <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="material-symbols-outlined text-indigo-500 shrink-0">location_on</span>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {detectedArea}
                    </p>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">
                            House / Flat No. <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={houseNo}
                            onChange={(e) => setHouseNo(e.target.value)}
                            placeholder="e.g. B-204"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Building / Society</label>
                        <input 
                            type="text" 
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            placeholder="e.g. Sunrise Apartments"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700">Nearby Landmark (optional)</label>
                        <input 
                            type="text" 
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="e.g. Near City Mall"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        <label className="text-sm font-bold text-slate-700">Save as</label>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setLabel("Home")}
                                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${label === "Home" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                                <span className="material-symbols-outlined text-lg">home</span> Home
                            </button>
                            <button 
                                onClick={() => setLabel("Work")}
                                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${label === "Work" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                                <span className="material-symbols-outlined text-lg">work</span> Work
                            </button>
                            <button 
                                onClick={() => setLabel("Other")}
                                className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${label === "Other" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                                <span className="material-symbols-outlined text-lg">location_on</span> Other
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (!houseNo.trim()) {
                            toast.error("Please enter your house/flat number for accurate delivery");
                            return;
                        }
                        if (!city.trim()) {
                            toast.error("City could not be determined. Please adjust the pin on the map.");
                            return;
                        }
                        
                        const composedAddress = `${houseNo}${building ? ", " + building : ""}, ${detectedArea}`;
                        
                        onLocationSelected({ 
                            addressLine: composedAddress, 
                            houseNo,
                            building,
                            landmark,
                            label,
                            city, 
                            pincode, 
                            lat, 
                            lng 
                        });
                    }}
                    className="w-full py-4 mt-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md flex items-center justify-center"
                >
                    Save & Proceed
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="relative bg-slate-100" style={{ height: "400px" }}>
                <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                    className="z-0"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker onMove={handleMove} />
                </MapContainer>
            </div>

            {/* Bottom Details Section */}
            <div className="p-6 bg-white flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                        {isFetching ? (
                            <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4 mb-1"></div>
                        ) : (
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                {detectedArea}
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={() => {
                            toast("Drag the map to change location", { icon: '👆' });
                        }}
                        className="px-4 py-2 text-sm font-bold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
                    >
                        Change
                    </button>
                </div>

                <button
                    onClick={() => setStep("details")}
                    disabled={isFetching}
                    className="w-full py-4 mt-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    Confirm this area →
                </button>
            </div>
        </>
    );
}
