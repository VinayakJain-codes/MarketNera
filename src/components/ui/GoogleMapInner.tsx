"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
    Loader2,
    ArrowLeft,
    MapPin,
    Home,
    Briefcase,
    ArrowRight,
    Search,
    X,
    MousePointer,
    Crosshair,
    AlertCircle,
    KeyRound
} from "lucide-react";

export interface LocationDetails {
    addressLine: string;
    houseNo: string;
    building?: string;
    street?: string;
    landmark?: string;
    label?: "Home" | "Work" | "Other";
    city: string;
    pincode: string;
    lat: number;
    lng: number;
}

export interface GoogleMapInnerProps {
    onLocationSelected: (locationDetails: LocationDetails) => void;
}

declare global {
    interface Window {
        google?: any;
        gm_authFailure?: () => void;
    }
}

// Script loader singleton
function loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") return;
        if (window.google?.maps) {
            resolve();
            return;
        }

        const existingScript = document.getElementById("google-maps-script") as HTMLScriptElement | null;
        if (existingScript) {
            if (window.google?.maps) {
                resolve();
            } else {
                existingScript.addEventListener("load", () => resolve());
                existingScript.addEventListener("error", (e) => reject(e));
            }
            return;
        }

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
}

export default function GoogleMapInner({ onLocationSelected }: GoogleMapInnerProps) {
    const [step, setStep] = useState<"map" | "details">("map");

    // Default Meerut coordinates
    const [lat, setLat] = useState<number>(28.9845);
    const [lng, setLng] = useState<number>(77.7064);

    const [isMapReady, setIsMapReady] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [authFailed, setAuthFailed] = useState<boolean>(false);

    // Detected location state
    const [detectedArea, setDetectedArea] = useState<string>("Locating...");
    const [city, setCity] = useState<string>("Meerut");
    const [pincode, setPincode] = useState<string>("250001");
    const [isFetching, setIsFetching] = useState<boolean>(true);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResultsDropdown, setShowResultsDropdown] = useState(false);
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Address details form fields
    const [houseNo, setHouseNo] = useState("");
    const [building, setBuilding] = useState("");
    const [street, setStreet] = useState("");
    const [landmark, setLandmark] = useState("");
    const [label, setLabel] = useState<"Home" | "Work" | "Other">("Home");

    // Map DOM and Instance refs
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerInstanceRef = useRef<any>(null);
    const lastReverseCoordsRef = useRef<{ lat: number; lng: number }>({ lat: 28.9845, lng: 77.7064 });
    const reverseDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    // Reverse geocode: Client-Side Google Geocoder with fallback to Server Route
    const reverseGeocode = useCallback(async (latToFetch: number, lngToFetch: number) => {
        setIsFetching(true);

        // 1. First attempt Client-Side Google Geocoder if Google Maps SDK is loaded in window
        if (window.google?.maps?.Geocoder) {
            try {
                const geocoder = new window.google.maps.Geocoder();
                const response = await geocoder.geocode({ location: { lat: latToFetch, lng: lngToFetch } });
                const results = response.results;

                if (results && results.length > 0) {
                    const getComp = (type: string, short = false) => {
                        for (const r of results) {
                            const found = (r.address_components || []).find((c: any) => c.types.includes(type));
                            if (found) return short ? found.short_name : found.long_name;
                        }
                        return "";
                    };

                    const streetNum = getComp("street_number");
                    const subprem = getComp("subpremise");
                    const prem = getComp("premise");
                    const rt = getComp("route");
                    const lmk = getComp("point_of_interest") || getComp("establishment") || getComp("landmark");
                    const subloc3 = getComp("sublocality_level_3");
                    const subloc2 = getComp("sublocality_level_2");
                    const subloc1 = getComp("sublocality_level_1");
                    const subloc = getComp("sublocality");
                    const neigh = getComp("neighborhood");
                    const ct = getComp("locality") || getComp("administrative_area_level_2") || "Meerut";
                    const pin = getComp("postal_code") || "250001";

                    const resolvedHouse = [subprem, streetNum].filter(Boolean).join(", ");
                    if (resolvedHouse) setHouseNo(resolvedHouse);
                    if (prem) setBuilding(prem);
                    if (rt) setStreet(rt);
                    if (lmk) setLandmark(lmk);
                    if (ct) setCity(ct);
                    if (pin) setPincode(pin);

                    const areaParts = [rt, subloc3, subloc2 || subloc1 || subloc || neigh].filter(Boolean);
                    const cleanArea = [...new Set(areaParts)].join(", ") || results[0].formatted_address.split(",").slice(0, 2).join(",");
                    setDetectedArea(cleanArea || "Selected Location");
                    setIsFetching(false);
                    return;
                }
            } catch (clientErr) {
                // Client-side geocoding failed or blocked; fall through to server route
                console.warn("Client geocoder fallback to server:", clientErr);
            }
        }

        // 2. Server-side route (Rate limited + Cache + OSM fallback)
        try {
            const res = await fetch(`/api/geocode/reverse?lat=${latToFetch}&lng=${lngToFetch}`);
            const data = await res.json();

            if (res.ok && data.success) {
                if (data.houseNo) setHouseNo(data.houseNo);
                if (data.building) setBuilding(data.building);
                if (data.street) setStreet(data.street);
                if (data.landmark) setLandmark(data.landmark);
                if (data.city) setCity(data.city);
                if (data.pincode) setPincode(data.pincode);
                setDetectedArea(data.area || data.displayName || "Selected Location");
            } else if (res.status === 429) {
                toast.error("Rate limit reached. Please pause a moment before dragging again.");
            } else {
                setDetectedArea("Selected Map Location");
            }
        } catch (error) {
            console.error("Reverse geocode error:", error);
            setDetectedArea("Selected Map Location");
        } finally {
            setIsFetching(false);
        }
    }, []);

    // Debounced reverse geocoding to prevent rapid API calls while user moves the pin
    const triggerDebouncedReverseGeocode = useCallback((newLat: number, newLng: number) => {
        // Distance check: ignore movements under ~10 meters (approx 0.0001 deg)
        const dLat = Math.abs(newLat - lastReverseCoordsRef.current.lat);
        const dLng = Math.abs(newLng - lastReverseCoordsRef.current.lng);
        if (dLat < 0.0001 && dLng < 0.0001) {
            return;
        }

        lastReverseCoordsRef.current = { lat: newLat, lng: newLng };

        if (reverseDebounceTimerRef.current) {
            clearTimeout(reverseDebounceTimerRef.current);
        }

        reverseDebounceTimerRef.current = setTimeout(() => {
            reverseGeocode(newLat, newLng);
        }, 400);
    }, [reverseGeocode]);

    // Initialize Google Maps instance
    const initializeGoogleMap = useCallback((initLat: number, initLng: number) => {
        if (!mapContainerRef.current || !window.google?.maps) return;

        const centerLatLng = { lat: initLat, lng: initLng };

        // Create Map
        const map = new window.google.maps.Map(mapContainerRef.current, {
            center: centerLatLng,
            zoom: 16,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            gestureHandling: "greedy",
        });

        // Create Custom Marker (Emerald theme)
        const marker = new window.google.maps.Marker({
            position: centerLatLng,
            map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
            title: "Drag to set delivery location",
        });

        // On Marker Drag
        marker.addListener("dragend", () => {
            const pos = marker.getPosition();
            if (pos) {
                const newLat = pos.lat();
                const newLng = pos.lng();
                setLat(newLat);
                setLng(newLng);
                map.panTo(pos);
                triggerDebouncedReverseGeocode(newLat, newLng);
            }
        });

        // On Map Click (move marker to clicked spot)
        map.addListener("click", (e: any) => {
            if (e.latLng) {
                marker.setPosition(e.latLng);
                const newLat = e.latLng.lat();
                const newLng = e.latLng.lng();
                setLat(newLat);
                setLng(newLng);
                map.panTo(e.latLng);
                triggerDebouncedReverseGeocode(newLat, newLng);
            }
        });

        mapInstanceRef.current = map;
        markerInstanceRef.current = marker;
        setIsMapReady(true);
    }, [triggerDebouncedReverseGeocode]);

    // Load Google Maps script and locate user
    useEffect(() => {
        let isMounted = true;

        if (typeof window !== "undefined") {
            window.gm_authFailure = () => {
                if (isMounted) {
                    console.error("Google Maps authentication failure detected.");
                    setAuthFailed(true);
                }
            };
        }

        if (!apiKey) {
            setLoadError("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured in .env.local");
            setIsFetching(false);
            return;
        }

        loadGoogleMapsScript(apiKey)
            .then(() => {
                if (!isMounted) return;

                // Attempt GPS location
                if (typeof navigator !== "undefined" && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            if (!isMounted) return;
                            const uLat = pos.coords.latitude;
                            const uLng = pos.coords.longitude;
                            setLat(uLat);
                            setLng(uLng);
                            lastReverseCoordsRef.current = { lat: uLat, lng: uLng };
                            initializeGoogleMap(uLat, uLng);
                            reverseGeocode(uLat, uLng);
                        },
                        (err) => {
                            console.warn("Geolocation skipped/blocked:", err.message);
                            if (!isMounted) return;
                            initializeGoogleMap(28.9845, 77.7064);
                            reverseGeocode(28.9845, 77.7064);
                        },
                        { timeout: 7000 }
                    );
                } else {
                    initializeGoogleMap(28.9845, 77.7064);
                    reverseGeocode(28.9845, 77.7064);
                }
            })
            .catch((err) => {
                console.error("Failed to load Google Maps script:", err);
                if (isMounted) {
                    setLoadError("Failed to connect to Google Maps. Please verify your API Key and network connection.");
                    setIsFetching(false);
                }
            });

        return () => {
            isMounted = false;
            if (reverseDebounceTimerRef.current) clearTimeout(reverseDebounceTimerRef.current);
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, [apiKey, initializeGoogleMap, reverseGeocode]);

    // Debounced Search Handler
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        if (query.trim().length < 2) {
            setSearchResults([]);
            setShowResultsDropdown(false);
            return;
        }

        searchDebounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (res.ok && data.results) {
                    setSearchResults(data.results);
                    setShowResultsDropdown(data.results.length > 0);
                }
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 350);
    };

    // Selecting a search result
    const handleSelectSearchResult = (result: any) => {
        setLat(result.lat);
        setLng(result.lng);
        setSearchQuery("");
        setShowResultsDropdown(false);

        if (mapInstanceRef.current && markerInstanceRef.current && window.google?.maps) {
            const newPos = new window.google.maps.LatLng(result.lat, result.lng);
            mapInstanceRef.current.panTo(newPos);
            mapInstanceRef.current.setZoom(16);
            markerInstanceRef.current.setPosition(newPos);
        }

        reverseGeocode(result.lat, result.lng);
    };

    // Recenter GPS Button
    const handleRecenterGPS = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsFetching(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const uLat = pos.coords.latitude;
                const uLng = pos.coords.longitude;
                setLat(uLat);
                setLng(uLng);

                if (mapInstanceRef.current && markerInstanceRef.current && window.google?.maps) {
                    const newPos = new window.google.maps.LatLng(uLat, uLng);
                    mapInstanceRef.current.panTo(newPos);
                    mapInstanceRef.current.setZoom(16);
                    markerInstanceRef.current.setPosition(newPos);
                }

                reverseGeocode(uLat, uLng);
                toast.success("GPS Location updated");
            },
            (err) => {
                toast.error("Could not obtain GPS coordinates: " + err.message);
                setIsFetching(false);
            },
            { timeout: 8000 }
        );
    };

    // Step 2: Form to fill House No, Building, Landmark, Save As
    if (step === "details") {
        return (
            <div className="p-6 bg-white flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <button
                        onClick={() => setStep("map")}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                        aria-label="Back to map"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h4 className="text-base font-bold text-slate-900">Complete Address Details</h4>
                        <p className="text-xs text-slate-500">Provide flat / house number for accurate doorstep delivery</p>
                    </div>
                </div>

                {/* Selected Location Pill */}
                <div className="flex items-start gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-emerald-950 uppercase tracking-wide">Selected Location</p>
                        <p className="text-xs text-emerald-800 leading-relaxed font-medium mt-0.5">{detectedArea}</p>
                    </div>
                    <button
                        onClick={() => setStep("map")}
                        className="text-xs font-bold text-emerald-700 hover:underline shrink-0 cursor-pointer"
                    >
                        Change
                    </button>
                </div>

                <div className="space-y-3 mt-1">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>House / Flat / Block No. <span className="text-red-500">*</span></span>
                            {houseNo && <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Pinpoint Matched</span>}
                        </label>
                        <input
                            type="text"
                            value={houseNo}
                            onChange={(e) => setHouseNo(e.target.value)}
                            placeholder="e.g. Flat 302, House No. 14-B, Plot 5"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Building / Apartment / Society Name <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            placeholder="e.g. Surya Enclave, Galaxy Heights"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Street / Road / Lane <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="e.g. Baghpat Road, Lane 4, Main Market Street"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nearby Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="e.g. Near Shiv Mandir, Behind Metro Hospital"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 outline-none"
                        />
                    </div>

                    {/* City & Pincode */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="6-digit pincode"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 outline-none"
                            />
                        </div>
                    </div>

                    {/* Save as Label */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Save As</label>
                        <div className="flex gap-2">
                            {(["Home", "Work", "Other"] as const).map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLabel(l)}
                                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        label === l
                                            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {l === "Home" && <Home className="w-4 h-4" />}
                                    {l === "Work" && <Briefcase className="w-4 h-4" />}
                                    {l === "Other" && <MapPin className="w-4 h-4" />}
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (!houseNo.trim()) {
                            toast.error("Please enter house/flat number for accurate delivery");
                            return;
                        }
                        if (!city.trim()) {
                            toast.error("Please enter a city name");
                            return;
                        }

                        // Assemble precise pinpoint delivery address
                        const addressParts = [
                            houseNo.trim(),
                            building.trim(),
                            street.trim(),
                            landmark.trim() ? `Near ${landmark.trim()}` : "",
                            detectedArea.trim(),
                            `${city.trim()} - ${pincode.trim()}`,
                        ].filter(Boolean);

                        const composedAddress = [...new Set(addressParts)].join(", ");

                        onLocationSelected({
                            addressLine: composedAddress,
                            houseNo: houseNo.trim(),
                            building: building.trim(),
                            street: street.trim(),
                            landmark: landmark.trim(),
                            label,
                            city: city.trim(),
                            pincode: pincode.trim(),
                            lat,
                            lng,
                        });
                    }}
                    className="w-full py-3.5 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                    <span>Save &amp; Confirm Location</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    // Missing API Key Notification Screen
    if (loadError) {
        return (
            <div className="p-6 bg-slate-50 flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shadow-xs">
                    <KeyRound className="w-6 h-6" />
                </div>
                <div className="max-w-md space-y-2">
                    <h4 className="text-base font-black text-slate-900">Google Maps Key Required</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        To display interactive Google Maps, please add your Google Maps API key to your <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">.env.local</code> file:
                    </p>
                    <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-2.5 rounded-xl text-left select-all overflow-x-auto">
                        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your_key_here
                    </div>
                </div>
                <button
                    onClick={() => setStep("details")}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                    Enter Address Manually
                </button>
            </div>
        );
    }

    // Step 1: Interactive Map Screen
    return (
        <div className="flex flex-col">
            {/* Top Search Bar */}
            <div className="p-3 bg-white border-b border-slate-100 relative z-20">
                <div className="relative">
                    <div className="flex items-center px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search area, landmark, or street in Google Maps..."
                            className="bg-transparent border-none outline-none text-xs w-full font-medium placeholder:text-slate-400"
                        />
                        {isSearching && (
                            <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />
                        )}
                        {searchQuery && !isSearching && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSearchResults([]);
                                    setShowResultsDropdown(false);
                                }}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showResultsDropdown && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-52 overflow-y-auto divide-y divide-slate-100">
                            {searchResults.map((res, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSelectSearchResult(res)}
                                    className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer"
                                >
                                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                    <span className="text-xs font-semibold text-slate-800 line-clamp-2">
                                        {res.displayName}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Google Map Container */}
            <div className="relative bg-slate-100" style={{ height: "380px" }}>
                <div
                    ref={mapContainerRef}
                    className="w-full h-full"
                    style={{ width: "100%", height: "100%" }}
                />

                {!isMapReady && (
                    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                        <div>
                            <p className="text-sm font-bold text-slate-800">Loading Google Maps...</p>
                            <p className="text-xs text-slate-400 mt-0.5">Fetching neighborhood map and positioning pin</p>
                        </div>
                    </div>
                )}

                {authFailed && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs text-white flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="max-w-md space-y-1.5">
                            <p className="text-sm font-bold text-white">Google Cloud Configuration Needed</p>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Google rejected the map request. In your Google Cloud Console:
                            </p>
                            <ul className="text-[11px] text-slate-300 text-left list-disc pl-5 space-y-1 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                                <li>Enable <strong>Maps JavaScript API</strong></li>
                                <li>In Key Restrictions, add <code className="text-emerald-400">http://localhost:*</code> to Website Restrictions (or set to None)</li>
                                <li>Verify a <strong>Billing Account</strong> is linked to the project</li>
                            </ul>
                        </div>
                        <button
                            type="button"
                            onClick={() => setStep("details")}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                        >
                            Confirm &amp; Complete Address Manually →
                        </button>
                    </div>
                )}

                {/* Floating Map Hint */}
                {isMapReady && !authFailed && (
                    <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 pointer-events-none">
                        <MousePointer className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-600">Drag pin or click map to reposition</span>
                    </div>
                )}
            </div>

            {/* Bottom Confirmation Strip */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pinpoint Location</p>
                                {houseNo && (
                                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                                        House/Street Detected
                                    </span>
                                )}
                            </div>
                            {isFetching ? (
                                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mt-1" />
                            ) : (
                                <div>
                                    <p className="text-xs font-black text-slate-900 leading-snug line-clamp-1 mt-0.5">
                                        {[houseNo, building, street].filter(Boolean).join(", ") || detectedArea}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                                        {[detectedArea !== street ? detectedArea : "", city, pincode].filter(Boolean).join(" · ")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRecenterGPS}
                        className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Recenter GPS</span>
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setStep("details")}
                    disabled={isFetching}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                    <span>Confirm this location →</span>
                </button>
            </div>
        </div>
    );
}
