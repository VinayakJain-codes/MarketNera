"use client";

import { getLeafletIcon } from "@/lib/leaflet-icon-fix";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
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
    Crosshair 
} from "lucide-react";

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

// Controller component to manage map lifecycle, invalidate size in modals, and center view
function MapLifecycleController({
    center,
    onMove,
}: {
    center: [number, number];
    onMove: (lat: number, lng: number) => void;
}) {
    const map = useMap();
    const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>({
        lat: center[0],
        lng: center[1],
    });

    // Invalidate size once modal finishes opening to eliminate grey tiles
    useEffect(() => {
        const timer1 = setTimeout(() => {
            map.invalidateSize();
        }, 150);
        const timer2 = setTimeout(() => {
            map.invalidateSize();
        }, 500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [map]);

    // Pan to center if coordinates change externally (e.g. from search or geolocation)
    useEffect(() => {
        map.setView(center, map.getZoom(), { animate: true });
        setMarkerPos({ lat: center[0], lng: center[1] });
    }, [center, map]);

    useMapEvents({
        click(e) {
            setMarkerPos(e.latlng);
            onMove(e.latlng.lat, e.latlng.lng);
        },
        dragend() {
            const currentCenter = map.getCenter();
            setMarkerPos(currentCenter);
            onMove(currentCenter.lat, currentCenter.lng);
        },
    });

    return (
        <Marker
            position={markerPos}
            draggable
            icon={getLeafletIcon()}
            eventHandlers={{
                dragend: (e) => {
                    const target = e.target;
                    const latlng = target.getLatLng();
                    setMarkerPos(latlng);
                    onMove(latlng.lat, latlng.lng);
                },
            }}
        />
    );
}

export default function LeafletMapInner({ onLocationSelected }: LeafletMapInnerProps) {
    const [step, setStep] = useState<"map" | "details">("map");

    // Coordinates (default Meerut: 28.9845, 77.7064)
    const [lat, setLat] = useState<number>(28.9845);
    const [lng, setLng] = useState<number>(77.7064);
    const [mapCenter, setMapCenter] = useState<[number, number]>([28.9845, 77.7064]);
    const [locationAcquired, setLocationAcquired] = useState(false);

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

    // Address detail fields
    const [houseNo, setHouseNo] = useState("");
    const [building, setBuilding] = useState("");
    const [landmark, setLandmark] = useState("");
    const [label, setLabel] = useState<"Home" | "Work" | "Other">("Home");

    // Reverse geocode using server API route
    const reverseGeocode = useCallback(async (latToFetch: number, lngToFetch: number) => {
        setIsFetching(true);
        try {
            const res = await fetch(`/api/geocode/reverse?lat=${latToFetch}&lng=${lngToFetch}`);
            const data = await res.json();

            if (res.ok && data.success) {
                setDetectedArea(data.area || data.displayName || "Selected Location");
                setCity(data.city || "Meerut");
                setPincode(data.pincode || "250001");
            } else {
                setDetectedArea("Selected Map Location");
                setCity("Meerut");
                setPincode("250001");
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            setDetectedArea("Selected Map Location");
            setCity("Meerut");
            setPincode("250001");
        } finally {
            setIsFetching(false);
        }
    }, []);

    // Initial Geolocation acquisition
    useEffect(() => {
        let isMounted = true;

        if (typeof navigator !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    if (!isMounted) return;
                    const uLat = pos.coords.latitude;
                    const uLng = pos.coords.longitude;
                    setLat(uLat);
                    setLng(uLng);
                    setMapCenter([uLat, uLng]);
                    reverseGeocode(uLat, uLng);
                    setLocationAcquired(true);
                },
                (err) => {
                    console.warn("Geolocation permission skipped or blocked:", err?.message);
                    if (!isMounted) return;
                    // Fall back to default Meerut / NCR
                    reverseGeocode(28.9845, 77.7064);
                    setLocationAcquired(true);
                },
                { timeout: 6000 }
            );
        } else {
            reverseGeocode(28.9845, 77.7064);
            setLocationAcquired(true);
        }

        return () => {
            isMounted = false;
        };
    }, [reverseGeocode]);

    const handleMove = useCallback(
        (newLat: number, newLng: number) => {
            setLat(newLat);
            setLng(newLng);
            reverseGeocode(newLat, newLng);
        },
        [reverseGeocode]
    );

    // Handle search query changes
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
                console.error("Location search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    // Selecting a search result
    const handleSelectSearchResult = (result: any) => {
        setLat(result.lat);
        setLng(result.lng);
        setMapCenter([result.lat, result.lng]);
        setSearchQuery("");
        setShowResultsDropdown(false);
        reverseGeocode(result.lat, result.lng);
    };

    if (!locationAcquired) {
        return (
            <div className="w-full h-[420px] bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                <div>
                    <p className="text-sm font-bold text-slate-800">Initializing Map...</p>
                    <p className="text-xs text-slate-400 mt-0.5">Fetching your neighborhood location</p>
                </div>
            </div>
        );
    }

    if (step === "details") {
        return (
            <div className="p-6 bg-white flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <button
                        onClick={() => setStep("map")}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
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
                        className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
                    >
                        Change
                    </button>
                </div>

                <div className="space-y-3 mt-1">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            House / Flat / Block No. <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={houseNo}
                            onChange={(e) => setHouseNo(e.target.value)}
                            placeholder="e.g. Flat 302, House No. 14-B"
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
                            Nearby Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="e.g. Behind Metro Hospital, Near Shiv Mandir"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 outline-none"
                        />
                    </div>

                    {/* City & Pincode (Editable & Resilient) */}
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
                                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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

                        const composedAddress = `${houseNo.trim()}${building.trim() ? `, ${building.trim()}` : ""}, ${detectedArea}, ${city.trim()} - ${pincode.trim()}`;

                        onLocationSelected({
                            addressLine: composedAddress,
                            houseNo: houseNo.trim(),
                            building: building.trim(),
                            landmark: landmark.trim(),
                            label,
                            city: city.trim(),
                            pincode: pincode.trim(),
                            lat,
                            lng,
                        });
                    }}
                    className="w-full py-3.5 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                    <span>Save &amp; Confirm Location</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Top Search & Filter Bar */}
            <div className="p-3 bg-white border-b border-slate-100 relative z-20">
                <div className="relative">
                    <div className="flex items-center px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search area, landmark, or street (e.g. Civil Lines, Meerut)..."
                            className="bg-transparent border-none outline-none text-xs w-full font-medium placeholder:text-slate-400"
                        />
                        {isSearching && (
                            <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                        )}
                        {searchQuery && !isSearching && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSearchResults([]);
                                    setShowResultsDropdown(false);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Search Suggestions Dropdown */}
                    {showResultsDropdown && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-52 overflow-y-auto divide-y divide-slate-100">
                            {searchResults.map((res, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSelectSearchResult(res)}
                                    className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5"
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

            {/* Map Canvas */}
            <div className="relative bg-slate-100" style={{ height: "380px" }}>
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
                    <MapLifecycleController center={mapCenter} onMove={handleMove} />
                </MapContainer>

                {/* Floating Map Hint */}
                <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 pointer-events-none">
                    <MousePointer className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-600">Click or drag pin</span>
                </div>
            </div>

            {/* Bottom Details Confirmation Strip */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pin Location</p>
                            {isFetching ? (
                                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mt-1" />
                            ) : (
                                <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 mt-0.5">
                                    {detectedArea}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((pos) => {
                                    const uLat = pos.coords.latitude;
                                    const uLng = pos.coords.longitude;
                                    setLat(uLat);
                                    setLng(uLng);
                                    setMapCenter([uLat, uLng]);
                                    reverseGeocode(uLat, uLng);
                                });
                            }
                        }}
                        className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors shrink-0 flex items-center gap-1"
                    >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Recenter GPS</span>
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setStep("details")}
                    disabled={isFetching}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                    <span>Confirm this location →</span>
                </button>
            </div>
        </div>
    );
}
