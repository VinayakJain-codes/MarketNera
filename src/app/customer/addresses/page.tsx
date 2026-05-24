"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { getAddresses, addAddress, deleteAddress, setDefaultAddress, CustomerAddress } from "@/lib/services/addresses";
import toast from "react-hot-toast";

export default function AddressesPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    
    // Form state
    const [label, setLabel] = useState("Home");
    const [addressLine, setAddressLine] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Auto-detection state
    const [detecting, setDetecting] = useState(false);
    const [detectedAddr, setDetectedAddr] = useState<{ addressLine: string; city: string; pincode: string } | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmLabel, setConfirmLabel] = useState("Home");
    const [confirmIsDefault, setConfirmIsDefault] = useState(false);
    const [savingDetected, setSavingDetected] = useState(false);

    // Fetch addresses
    const fetchAddresses = async (userId: string) => {
        setLoading(true);
        const list = await getAddresses(userId);
        setAddresses(list);
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) {
                router.push(ROUTES.LOGIN_CUSTOMER);
                return;
            }
            setUser(session.user);
            fetchAddresses(session.user.id);
        });
    }, [router]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!addressLine.trim()) {
            toast.error("Please enter address details");
            return;
        }

        setSubmitting(true);
        const res = await addAddress(user.id, {
            label,
            address_line: addressLine,
            city,
            pincode,
            is_default: isDefault,
        });

        if (res.success) {
            toast.success("Address added successfully!");
            // Reset form
            setLabel("Home");
            setAddressLine("");
            setCity("");
            setPincode("");
            setIsDefault(false);
            setShowAddForm(false);
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to add address");
        }
        setSubmitting(false);
    };

    const handleDelete = async (addressId: string) => {
        if (!user) return;
        
        // Optimistic update
        setAddresses(prev => prev.filter(a => a.id !== addressId));

        const res = await deleteAddress(user.id, addressId);
        if (res.success) {
            toast.success("Address deleted");
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to delete address");
            fetchAddresses(user.id);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        if (!user) return;

        const res = await setDefaultAddress(user.id, addressId);
        if (res.success) {
            toast.success("Default address updated");
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to update default address");
        }
    };

    const handleAutoDetect = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    if (!res.ok) throw new Error("Failed to reverse-geocode");
                    
                    const data = await res.json();
                    const addr = data.address;

                    // Formulate highly precise point address details with building, road, nearby amenities/landmarks, suburb, and city districts
                    const houseNo = addr.house_number || "";
                    const building = addr.building || addr.house_name || addr.office || addr.hotel || addr.shop || addr.retail || "";
                    const road = addr.road || addr.street || addr.pedestrian || addr.footway || "";
                    
                    // Identify landmark features if available
                    const amenity = addr.amenity || addr.historic || addr.tourism || addr.leisure || "";
                    const commercial = addr.commercial || addr.industrial || "";
                    const landmark = amenity || commercial || "";
                    
                    const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || "";
                    const cityDistrict = addr.city_district || addr.quarter || "";
                    const cityVal = addr.city || addr.town || addr.village || addr.county || "";
                    const pincodeVal = addr.postcode || "";

                    // Combine house number and building/office name
                    let houseAndBuilding = [houseNo, building].filter(Boolean).join(", ");
                    
                    // Prepend "Near [landmark]" if any major landmark is returned
                    const landmarkSuffix = landmark ? `(Near ${landmark})` : "";
                    
                    const addressParts = [houseAndBuilding, road, landmarkSuffix, suburb, cityDistrict].filter(Boolean);
                    
                    // Fallback to display name if we couldn't resolve specific parts
                    const parsedAddressLine = addressParts.length > 0 
                        ? addressParts.join(", ") 
                        : data.display_name.split(",").slice(0, 4).join(", ");

                    setDetectedAddr({
                        addressLine: parsedAddressLine,
                        city: cityVal,
                        pincode: pincodeVal
                    });
                    
                    setShowConfirmModal(true);
                } catch (error) {
                    console.error("Error geocoding:", error);
                    toast.error("Could not determine precise address details");
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                let message = "Unable to retrieve location";
                if (error.code === error.PERMISSION_DENIED) {
                    message = "Location permission denied. Please allow location access in your browser.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    message = "Location position unavailable.";
                } else if (error.code === error.TIMEOUT) {
                    message = "Location request timed out.";
                }
                toast.error(message);
                setDetecting(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0
            }
        );
    };

    const handleSaveDetected = async () => {
        if (!user || !detectedAddr) return;
        setSavingDetected(true);
        const res = await addAddress(user.id, {
            label: confirmLabel,
            address_line: detectedAddr.addressLine,
            city: detectedAddr.city,
            pincode: detectedAddr.pincode,
            is_default: confirmIsDefault,
        });

        if (res.success) {
            toast.success("Current location saved successfully!");
            setShowConfirmModal(false);
            setDetectedAddr(null);
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to save address");
        }
        setSavingDetected(false);
    };

    return (
        <div className="w-full max-w-[480px] md:max-w-3xl mx-auto bg-slate-50 min-h-screen shadow-xl relative pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        aria-label="Go back"
                    >
                        <span className="material-symbols-outlined text-slate-600 text-xl">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            Saved Addresses
                            {!loading && addresses.length > 0 && (
                                <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {addresses.length}
                                </span>
                            )}
                        </h1>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add New
                </button>
            </header>

            <div className="p-4">
                {/* Add Address Form */}
                {showAddForm && (
                    <form onSubmit={handleAdd} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 space-y-4 animate-fade-in-up">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">New Delivery Address</h3>
                            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Label</label>
                            <div className="flex gap-2">
                                {["Home", "Work", "Other"].map((lbl) => (
                                    <button
                                        key={lbl}
                                        type="button"
                                        onClick={() => setLabel(lbl)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                                            label === lbl
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                        }`}
                                    >
                                        {lbl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Address Line</label>
                            <textarea
                                required
                                value={addressLine}
                                onChange={(e) => setAddressLine(e.target.value)}
                                placeholder="House / Flat No., Building Name, Street Address"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g. Mumbai"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pincode</label>
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    placeholder="6-digit pincode"
                                    maxLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-2 py-1 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-semibold text-slate-600">Set as default delivery address</span>
                        </label>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-1.5"
                        >
                            {submitting ? (
                                <>
                                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                    Saving Address...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Save Address
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Geolocation Auto-Detect & Save Card */}
                <div className="mb-6 relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-[1.5px] rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.99] transition-all duration-300">
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-600 relative">
                                <span className={`material-symbols-outlined text-2xl ${detecting ? 'animate-spin' : 'animate-pulse'}`}>
                                    {detecting ? 'sync' : 'my_location'}
                                </span>
                                {detecting && (
                                    <span className="absolute inset-0 rounded-xl border-2 border-emerald-500/35 border-t-transparent animate-spin" />
                                )}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-sm font-black text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
                                    Precise Auto-Detect
                                    <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                        Accurate to 20m
                                    </span>
                                </h3>
                                <p className="text-[11px] font-medium text-slate-400 mt-0.5 leading-relaxed">
                                    {detecting ? 'Finding exact GPS point...' : 'Save your exact current address automatically using your GPS.'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAutoDetect}
                            disabled={detecting}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                                detecting
                                    ? 'bg-slate-300 shadow-none cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-95 shadow-emerald-500/20'
                            }`}
                        >
                            {detecting ? (
                                <>
                                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                    Locating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">gps_fixed</span>
                                    Detect
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Addresses List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3 animate-pulse">
                                <div className="h-4 bg-slate-200 rounded w-1/4" />
                                <div className="h-3 bg-slate-200 rounded w-3/4" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in-up">
                        <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-6xl text-emerald-300">location_on</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No saved addresses</h2>
                        <p className="text-sm font-medium text-slate-500 mb-8">
                            Add a delivery address to checkout faster next time!
                        </p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-8 py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                        >
                            Add Your First Address
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all relative ${
                                    addr.is_default ? "border-emerald-500 bg-emerald-50/10" : "border-slate-100"
                                }`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-lg">
                                                {addr.label === "Home" ? "home" : addr.label === "Work" ? "work" : "location_on"}
                                            </span>
                                            <span className="font-black text-sm text-slate-800 uppercase tracking-wider">{addr.label}</span>
                                            {addr.is_default && (
                                                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-600 mt-3 leading-relaxed">
                                            {addr.address_line}
                                        </p>
                                        {(addr.city || addr.pincode) && (
                                            <p className="text-xs font-semibold text-slate-400 mt-1">
                                                {[addr.city, addr.pincode].filter(Boolean).join(" - ")}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                        title="Delete address"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>

                                {!addr.is_default && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Set as Default
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Confirmation Modal */}
            {showConfirmModal && detectedAddr && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6 pb-10 shadow-2xl animate-fade-in-up border-t border-slate-100">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 font-bold text-xl animate-bounce">location_on</span>
                                <h3 className="text-base font-black text-slate-900 tracking-tight">Confirm Detected Address</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setDetectedAddr(null);
                                }}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        {/* Address Details Card */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5 space-y-3">
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Detected Address Line</span>
                                <p className="text-xs font-bold text-slate-800 leading-relaxed">{detectedAddr.addressLine}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                                <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">City</span>
                                    <p className="text-xs font-bold text-slate-800">{detectedAddr.city || "Not detected"}</p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Pincode</span>
                                    <p className="text-xs font-bold text-slate-800">{detectedAddr.pincode || "Not detected"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Label selection */}
                        <div className="mb-5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Save Address As</label>
                            <div className="flex gap-2">
                                {[
                                    { id: "Home", icon: "home" },
                                    { id: "Work", icon: "work" },
                                    { id: "Current GPS", icon: "my_location" }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setConfirmLabel(item.id)}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                                            confirmLabel === item.id
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm font-extrabold"
                                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                        {item.id === "Current GPS" ? "GPS Location" : item.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Default toggle */}
                        <label className="flex items-center gap-2.5 py-1 mb-6 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={confirmIsDefault}
                                onChange={(e) => setConfirmIsDefault(e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-semibold text-slate-700">Set as default delivery address</span>
                        </label>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setDetectedAddr(null);
                                }}
                                className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all flex justify-center items-center"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveDetected}
                                disabled={savingDetected}
                                className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-95 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 flex justify-center items-center gap-1.5"
                            >
                                {savingDetected ? (
                                    <>
                                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Save Address
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
