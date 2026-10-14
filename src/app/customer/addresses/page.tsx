"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { getAddresses, addAddress, deleteAddress, setDefaultAddress, CustomerAddress } from "@/lib/services/addresses";
import toast from "react-hot-toast";
import Link from "next/link";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import GoogleLocationPicker from "@/components/ui/GoogleLocationPicker";
import {
    MapPin,
    Home,
    Briefcase,
    Plus,
    Trash2,
    CheckCircle2,
    ArrowLeft,
    X,
    LocateFixed,
    Navigation,
    Compass,
    Check,
} from "lucide-react";

export default function AddressesPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [label, setLabel] = useState("Home");
    const [addressLine, setAddressLine] = useState("");
    const [city, setCity] = useState("Meerut");
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

    // Map Picker state
    const [showMapPicker, setShowMapPicker] = useState(false);

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
            toast.error("Please enter your address line");
            return;
        }

        setSubmitting(true);
        const res = await addAddress(user.id, {
            label,
            address_line: addressLine.trim(),
            city: city.trim(),
            pincode: pincode.trim(),
            is_default: isDefault || addresses.length === 0,
        });

        if (res.success) {
            toast.success("Delivery address saved successfully!");
            setShowAddForm(false);
            setAddressLine("");
            setPincode("");
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to save address");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        const res = await deleteAddress(id, user.id);
        if (res.success) {
            toast.success("Address removed");
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to delete address");
            fetchAddresses(user.id);
        }
    };

    const handleSetDefault = async (id: string) => {
        if (!user) return;
        setAddresses((prev) =>
            prev.map((a) => ({ ...a, is_default: a.id === id }))
        );
        const res = await setDefaultAddress(id, user.id);
        if (res.success) {
            toast.success("Default delivery address updated");
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to update default address");
            fetchAddresses(user.id);
        }
    };

    const handleDetectCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    if (data.success && data.address) {
                        setDetectedAddr({
                            addressLine: data.address.addressLine,
                            city: data.address.city || "Meerut",
                            pincode: data.address.pincode || "",
                        });
                        setShowConfirmModal(true);
                    } else {
                        toast.error("Could not determine precise address");
                    }
                } catch {
                    toast.error("Location lookup service error");
                } finally {
                    setDetecting(false);
                }
            },
            () => {
                setDetecting(false);
                toast.error("Please enable location permissions");
            },
            { enableHighAccuracy: true, timeout: 10000 }
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
            toast.success("GPS address saved!");
            setShowConfirmModal(false);
            setDetectedAddr(null);
            fetchAddresses(user.id);
        } else {
            toast.error(res.error || "Failed to save address");
        }
        setSavingDetected(false);
    };

    return (
        <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between font-sans text-slate-900">
            {/* Top Navigation */}
            <CustomerNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6 flex-1">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    <div className="flex items-center gap-3">
                        <Link
                            href={ROUTES.CUSTOMER_DASHBOARD}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-xs"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span>Saved Delivery Addresses</span>
                                {!loading && addresses.length > 0 && (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        {addresses.length}
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Deliveries reach your doorstep in 15–30 minutes
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="order-1 sm:order-3 w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New Address</span>
                        </button>

                        <div className="order-2 grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
                            <button
                                type="button"
                                onClick={() => setShowMapPicker(true)}
                                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                            >
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <span>Pick on Map</span>
                            </button>

                            <button
                                onClick={handleDetectCurrentLocation}
                                disabled={detecting}
                                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                            >
                                <LocateFixed className={`w-4 h-4 text-emerald-600 ${detecting ? "animate-spin" : ""}`} />
                                <span>{detecting ? "Locating..." : "Use GPS"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Address Form Modal/Inline */}
                {showAddForm && (
                    <form
                        onSubmit={handleAdd}
                        className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-fade-in"
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-black text-slate-900 text-base">Add Delivery Address</h3>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Address Type
                            </label>
                            <div className="flex gap-2">
                                {["Home", "Work", "Other"].map((lbl) => (
                                    <button
                                        key={lbl}
                                        type="button"
                                        onClick={() => setLabel(lbl)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                            label === lbl
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                        }`}
                                    >
                                        {lbl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700">
                                House / Flat / Street Address *
                            </label>
                            <textarea
                                required
                                value={addressLine}
                                onChange={(e) => setAddressLine(e.target.value)}
                                placeholder="House / Flat No., Apartment / Building Name, Street"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">Pincode *</label>
                                <input
                                    type="text"
                                    required
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    placeholder="e.g. 250001"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-600 bg-white"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                            <input
                                type="checkbox"
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="rounded text-emerald-600 border-slate-300 focus:ring-emerald-600 h-4 w-4"
                            />
                            <span>Make this my default delivery address</span>
                        </label>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : "Save Delivery Address"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Addresses List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-28 rounded-2xl bg-white border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-4 shadow-xs">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">No saved addresses yet</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Save your home, work, or apartment address to unlock 1-click checkout and instant 15–30 min delivery.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Your Address</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                                    addr.is_default
                                        ? "border-emerald-500 ring-1 ring-emerald-500/20"
                                        : "border-slate-200/80 hover:border-slate-300"
                                }`}
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                                            {addr.label === "Work" ? (
                                                <Briefcase className="w-4 h-4" />
                                            ) : (
                                                <Home className="w-4 h-4" />
                                            )}
                                        </div>
                                        <span className="font-black text-sm text-slate-900">{addr.label}</span>
                                        {addr.is_default && (
                                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium text-slate-700 leading-relaxed max-w-xl">
                                        {addr.address_line}
                                    </p>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        {[addr.city, addr.pincode].filter(Boolean).join(" · ")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* GPS Confirm Modal (Bottom sheet on phone, centered on desktop) */}
            {showConfirmModal && detectedAddr && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl animate-scale-in pb-8 sm:pb-6">
                        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <LocateFixed className="w-4 h-4" />
                                </div>
                                <h3 className="font-black text-slate-900 text-base">Confirm GPS Address</h3>
                            </div>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Address Line
                            </span>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{detectedAddr.addressLine}</p>
                            <p className="text-slate-500 font-medium text-xs">
                                {detectedAddr.city} - {detectedAddr.pincode}
                            </p>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                Save Label
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                                {["Home", "Work", "GPS Pin"].map((lbl) => (
                                    <button
                                        key={lbl}
                                        type="button"
                                        onClick={() => setConfirmLabel(lbl)}
                                        className={`h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                                            confirmLabel === lbl
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs"
                                                : "bg-white border-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {lbl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={confirmIsDefault}
                                onChange={(e) => setConfirmIsDefault(e.target.checked)}
                                className="rounded-md text-emerald-600 border-slate-300 focus:ring-emerald-600 h-4 w-4"
                            />
                            <span>Set as default address</span>
                        </label>

                        <div className="flex items-center gap-2.5 pt-2">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 h-12 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDetected}
                                disabled={savingDetected}
                                className="flex-2 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
                            >
                                {savingDetected ? "Saving..." : "Save Address"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Google Maps Location Picker Modal */}
            <GoogleLocationPicker
                isOpen={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onLocationSelected={(loc) => {
                    setShowMapPicker(false);
                    setAddressLine(loc.addressLine);
                    setCity(loc.city);
                    setPincode(loc.pincode);
                    if (loc.label) setLabel(loc.label);
                    setShowAddForm(true);
                }}
            />

            {/* Bottom Nav & Modern Footer */}
            <Footer />
            <CustomerBottomNav />
        </div>
    );
}
