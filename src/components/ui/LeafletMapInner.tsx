"use client";

import { defaultLeafletIcon } from "@/lib/leaflet-icon-fix";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface LocationDetails {
    addressLine: string;
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

    return position ? <Marker position={position} draggable icon={defaultLeafletIcon} /> : null;
}

export default function LeafletMapInner({ onLocationSelected }: LeafletMapInnerProps) {
    const [lat, setLat] = useState<number>(28.6139); // Default: New Delhi
    const [lng, setLng] = useState<number>(77.2090);
    const [address, setAddress] = useState<string>("Locating...");
    const [city, setCity] = useState<string>("");
    const [pincode, setPincode] = useState<string>("");
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);
    const [locationAcquired, setLocationAcquired] = useState(false);

    const reverseGeocode = useCallback(async (latToFetch: number, lngToFetch: number) => {
        setIsFetching(true);
        try {
            const key = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
            if (!key) throw new Error("API key not found");

            const res = await fetch(
                `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${latToFetch}&lon=${lngToFetch}&format=json`
            );
            if (!res.ok) throw new Error("Geocoding failed");
            
            const data = await res.json();
            const addr = data.address || {};
            
            const road = addr.road || addr.street || "";
            const suburb = addr.suburb || addr.neighbourhood || "";
            const house = addr.house_number || addr.building || "";
            
            const line = [house, road, suburb].filter(Boolean).join(", ");
            setAddress(line || data.display_name || "Unknown Location");
            setCity(addr.city || addr.town || addr.village || addr.county || "");
            setPincode(addr.postcode || "");
        } catch (error) {
            console.error("Reverse geocode error:", error);
            setAddress("Could not determine address");
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
                                {address}
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
                    onClick={() => onLocationSelected({ addressLine: address, city, pincode, lat, lng })}
                    disabled={isFetching || address === "Could not determine address"}
                    className="w-full py-4 mt-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    Proceed to add details
                </button>
            </div>
        </>
    );
}
