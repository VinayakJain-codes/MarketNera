"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

// Load the Mappls SDK script once globally
function loadMapplsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Already loaded
        if ((window as any).mappls) {
            resolve();
            return;
        }

        // Already loading (script tag exists but not yet ready)
        const existing = document.getElementById("mappls-sdk-script");
        if (existing) {
            const check = setInterval(() => {
                if ((window as any).mappls) {
                    clearInterval(check);
                    resolve();
                }
            }, 200);
            // Timeout after 15s
            setTimeout(() => {
                clearInterval(check);
                reject(new Error("Mappls SDK load timed out"));
            }, 15000);
            return;
        }

        // Inject the script
        const script = document.createElement("script");
        script.id = "mappls-sdk-script";
        script.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0`;
        script.async = true;
        script.onload = () => {
            // The script sets window.mappls — wait for it
            const check = setInterval(() => {
                if ((window as any).mappls) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
            setTimeout(() => {
                clearInterval(check);
                if ((window as any).mappls) resolve();
                else reject(new Error("Mappls SDK did not initialize after script load"));
            }, 10000);
        };
        script.onerror = () => reject(new Error("Failed to load Mappls SDK script"));
        document.head.appendChild(script);
    });
}

export default function MapplsLocationPicker({
    isOpen,
    onClose,
    onLocationSelected,
    title = "Search / Choose Location"
}: MapplsLocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerInstanceRef = useRef<any>(null);
    const isLoadingRef = useRef(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    
    const [currentLat, setCurrentLat] = useState<number>(28.6139);
    const [currentLng, setCurrentLng] = useState<number>(77.2090);
    const [currentAddress, setCurrentAddress] = useState<string>("Locating...");
    const [city, setCity] = useState<string>("");
    const [pincode, setPincode] = useState<string>("");
    
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);
    
    const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fallbackReverseGeocode = useCallback(async (lat: number, lng: number) => {
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
    }, []);

    const fetchAddress = useCallback(async (lat: number, lng: number) => {
        setIsFetchingAddress(true);
        try {
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
                fallbackReverseGeocode(lat, lng);
            }
        } catch (error) {
            console.error("Error fetching address from Mappls, falling back...", error);
            fallbackReverseGeocode(lat, lng);
        } finally {
            setIsFetchingAddress(false);
        }
    }, [apiKey, fallbackReverseGeocode]);

    const handlePositionChange = useCallback((lat: number, lng: number) => {
        setCurrentLat(lat);
        setCurrentLng(lng);
        fetchAddress(lat, lng);
    }, [fetchAddress]);



    // Main map initialization effect
    useEffect(() => {
        if (!isMounted || !isOpen || !apiKey) return;
        
        let cancelled = false;

        const initMap = async () => {
            isLoadingRef.current = true;
            setIsLoading(true);
            setLoadError(null);

            try {
                // 1. Get user location
                let lat = currentLat;
                let lng = currentLng;
                
                if (navigator.geolocation) {
                    try {
                        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                        });
                        lat = pos.coords.latitude;
                        lng = pos.coords.longitude;
                        if (!cancelled) {
                            setCurrentLat(lat);
                            setCurrentLng(lng);
                        }
                    } catch (e) {
                        console.warn("Geolocation blocked or timeout, using default.");
                    }
                }

                if (cancelled) return;

                // 2. Load the Mappls SDK via script tag
                await loadMapplsScript(apiKey);

                if (cancelled) return;

                // 3. Wait for DOM element to be ready
                await new Promise(resolve => setTimeout(resolve, 200));

                if (cancelled || !mapRef.current) return;

                // 4. Create the map
                const mapplsObj = (window as any).mappls;
                const mapInstance = new mapplsObj.Map("mappls-map", {
                    center: [lat, lng],
                    zoom: 15,
                    zoomControl: true,
                    location: true,
                });
                
                mapInstanceRef.current = mapInstance;

                mapInstance.on("load", () => {
                    if (cancelled) return;

                    const marker = new mapplsObj.Marker({
                        map: mapInstance,
                        position: { lat, lng },
                        fitbounds: false,
                        draggable: true,
                    });
                    
                    markerInstanceRef.current = marker;
                    isLoadingRef.current = false;
                    setIsLoading(false);
                    fetchAddress(lat, lng);

                    // Update marker when map is dragged
                    mapInstance.addListener("dragend", () => {
                        const center = mapInstance.getCenter();
                        marker.setPosition(center);
                        handlePositionChange(center.lat, center.lng);
                    });
                    
                    // Update map center when marker is dragged
                    marker.addListener("dragend", () => {
                        const pos = marker.getPosition();
                        mapInstance.setCenter(pos);
                        handlePositionChange(pos.lat, pos.lng);
                    });
                });
                
                mapInstance.on("error", (e: any) => {
                    console.error("Map load error:", e);
                    if (!cancelled) {
                        setLoadError("Map authentication failed. Check your API key.");
                        isLoadingRef.current = false;
                        setIsLoading(false);
                    }
                });

                // Timeout fallback — if map doesn't load in 15s, show error
                setTimeout(() => {
                    if (!cancelled && isLoadingRef.current) {
                        setLoadError("Map took too long to load. Please try again.");
                        isLoadingRef.current = false;
                        setIsLoading(false);
                    }
                }, 15000);

            } catch (err: any) {
                console.error("Mappls initialization error:", err);
                if (!cancelled) {
                    setLoadError(err.message || "Failed to load map.");
                    setIsLoading(false);
                }
            }
        };

        initMap();
        
        return () => {
            cancelled = true;
            if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === "function") {
                try {
                    mapInstanceRef.current.remove();
                } catch(e) {}
            }
            mapInstanceRef.current = null;
            markerInstanceRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, isOpen, apiKey, retryCount]);

    if (!isMounted || !isOpen) return null;

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
                <div className="relative bg-slate-100" style={{ height: "400px" }}>
                    {isLoading && !loadError && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
                            <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin mb-2">sync</span>
                            <p className="text-sm font-semibold text-slate-600">Loading Map...</p>
                        </div>
                    )}
                    {loadError && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm gap-3">
                            <span className="material-symbols-outlined text-4xl text-red-400">error</span>
                            <p className="text-sm font-semibold text-slate-600 text-center px-4">{loadError}</p>
                            <button
                                onClick={() => {
                                    setLoadError(null);
                                    setIsLoading(true);
                                    mapInstanceRef.current = null;
                                    setRetryCount(c => c + 1);
                                }}
                                className="px-4 py-2 text-sm font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    <div ref={mapRef} className="w-full" style={{ height: "400px" }} id="mappls-map" />
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


