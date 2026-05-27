"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface MapplsLocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelected: (locationDetails: {
        addressLine: string;
        city: string;
        pincode: string;
        lat: number;
        lng: number;
    }) => void;
    title?: string;
}

import { mappls } from "mappls-web-maps";

// Ensure TypeScript knows about the window.mappls object
declare global {
    interface Window {
        mappls: any;
    }
}

export default function MapplsLocationPicker({
    isOpen,
    onClose,
    onLocationSelected,
    title = "Search / Choose Location"
}: MapplsLocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const isMapInitialized = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentLat, setCurrentLat] = useState<number>(28.6139); // Default to New Delhi
    const [currentLng, setCurrentLng] = useState<number>(77.2090);
    const [currentAddress, setCurrentAddress] = useState<string>("Locating...");
    const [city, setCity] = useState<string>("");
    const [pincode, setPincode] = useState<string>("");
    
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);
    
    const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;

    // Load Mappls Script
    useEffect(() => {
        if (!isOpen) return;
        
        let mapInstance: any = null;
        let markerInstance: any = null;
        const mapplsClassObject = new mappls();

        const loadMap = async () => {
            const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
            
            if (!apiKey) {
                toast.error("Mappls API key is missing");
                setIsLoading(false);
                return;
            }

            try {
                // Determine user's location or default to New Delhi
                let lat = currentLat;
                let lng = currentLng;
                
                if (navigator.geolocation) {
                    try {
                        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                        });
                        lat = pos.coords.latitude;
                        lng = pos.coords.longitude;
                        setCurrentLat(lat);
                        setCurrentLng(lng);
                    } catch (e) {
                        console.warn("Geolocation blocked or timeout, using default.");
                    }
                }

                // Initialize mappls SDK via official package
                mapplsClassObject.initialize(apiKey, {
                    map: true,
                    layer: 'vector',
                }, () => {
                    try {
                        mapInstance = mapplsClassObject.Map({
                            id: "mappls-map",
                            properties: {
                                center: [lat, lng],
                                zoom: 15,
                                zoomControl: true,
                                location: true,
                            }
                        });

                        mapInstance.on("load", () => {
                            markerInstance = new window.mappls.Marker({
                                map: mapInstance,
                                position: { lat, lng },
                                fitbounds: false,
                                draggable: true,
                            });
                            
                            setIsLoading(false);
                            fetchAddress(lat, lng);

                            // Update marker and address when map is dragged
                            mapInstance.addListener('dragend', () => {
                                const center = mapInstance.getCenter();
                                markerInstance.setPosition(center);
                                handlePositionChange(center.lat, center.lng);
                            });
                            
                            // Update address when marker is dragged
                            markerInstance.addListener('dragend', () => {
                                const pos = markerInstance.getPosition();
                                mapInstance.setCenter(pos);
                                handlePositionChange(pos.lat, pos.lng);
                            });
                        });
                        
                        // If there is an authentication error during load
                        mapInstance.on("error", (e: any) => {
                            console.error("Map load error:", e);
                            toast.error("Map authentication failed. Please check your API key.");
                            setIsLoading(false);
                        });

                    } catch (err) {
                        console.error("Mappls Map creation error:", err);
                        toast.error("Error setting up map. Invalid API key or script failure.");
                        setIsLoading(false);
                    }
                });
            } catch (err) {
                console.error("Mappls initialization error:", err);
                toast.error("Failed to load map. Check your internet or API Key.");
                setIsLoading(false);
            }
        };

        loadMap();
        
        return () => {
            // Cleanup on unmount or close
            if (mapInstance && typeof mapInstance.remove === 'function') {
                try {
                    mapInstance.remove();
                } catch(e) {}
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handlePositionChange = (lat: number, lng: number) => {
        setCurrentLat(lat);
        setCurrentLng(lng);
        fetchAddress(lat, lng);
    };

    const fetchAddress = async (lat: number, lng: number) => {
        setIsFetchingAddress(true);
        try {
            // Using Mappls Reverse Geocoding API
            // Mappls has multiple endpoints, often `https://apis.mappls.com/advancedmaps/v1/${apiKey}/rev_geocode?lat=${lat}&lng=${lng}`
            // is used for the static key. Let's try that.
            
            const url = `https://apis.mappls.com/advancedmaps/v1/${apiKey}/rev_geocode?lat=${lat}&lng=${lng}`;
            const res = await fetch(url);
            
            if (res.ok) {
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    const result = data.results[0];
                    setCurrentAddress(result.formatted_address || "Address not found");
                    setCity(result.city || result.district || "");
                    setPincode(result.pincode || "");
                }
            } else {
                // Fallback to nominatim if Mappls fails (e.g. if the API key is not enabled for rev_geocode)
                fallbackReverseGeocode(lat, lng);
            }
        } catch (error) {
            console.error("Error fetching address from Mappls, falling back...", error);
            fallbackReverseGeocode(lat, lng);
        } finally {
            setIsFetchingAddress(false);
        }
    };

    const fallbackReverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            if (!res.ok) throw new Error("Failed to reverse-geocode");
            
            const data = await res.json();
            const addr = data.address;

            const houseNo = addr.house_number || "";
            const building = addr.building || addr.house_name || "";
            const road = addr.road || addr.street || "";
            const suburb = addr.suburb || addr.neighbourhood || "";
            
            const houseAndBuilding = [houseNo, building].filter(Boolean).join(", ");
            const addressParts = [houseAndBuilding, road, suburb].filter(Boolean);
            
            const parsedAddressLine = addressParts.length > 0 
                ? addressParts.join(", ") 
                : data.display_name.replace(", India", "").trim();

            setCurrentAddress(parsedAddressLine);
            setCity(addr.city || addr.town || addr.village || addr.county || "");
            setPincode(addr.postcode || "");
        } catch {
            setCurrentAddress("Could not determine address");
            setCity("");
            setPincode("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Map Container */}
                <div className="relative flex-grow bg-slate-100 min-h-[300px] h-[50vh]">
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
                            <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin mb-2">sync</span>
                            <p className="text-sm font-semibold text-slate-600">Loading Map...</p>
                        </div>
                    )}
                    <div ref={mapRef} className="w-full h-full" id="mappls-map" />
                    
                    {/* Fixed Center Marker alternative if draggable marker is hard to use - we are using draggable marker above, but keeping a crosshair can also help */}
                    {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <span className="material-symbols-outlined text-4xl text-red-500 drop-shadow-md">location_on</span>
                    </div> */}
                </div>

                {/* Bottom Details Section */}
                <div className="p-6 bg-white flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                            {isFetchingAddress ? (
                                <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4 mb-1"></div>
                            ) : (
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                    {currentAddress}
                                </p>
                            )}
                        </div>
                        <button 
                            onClick={() => {
                                // In a real app this might open a search autocomplete
                                // For now it acts as a visual prompt
                                toast("Drag the map to change location", { icon: '👆' });
                            }}
                            className="px-4 py-2 text-sm font-bold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
                        >
                            Change
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            onLocationSelected({
                                addressLine: currentAddress,
                                city: city,
                                pincode: pincode,
                                lat: currentLat,
                                lng: currentLng
                            });
                        }}
                        disabled={isFetchingAddress || !currentAddress}
                        className="w-full py-4 mt-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Proceed to add details
                    </button>
                </div>
            </div>
        </div>
    );
}
