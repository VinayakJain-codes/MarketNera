"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { upsertShopkeeperProfile } from "@/lib/services/shopkeeper";
import { ROUTES } from "@/constants/routes";
import Button from "@/components/ui/Button";
import Logo from "@/components/layout/Logo";
import toast from "react-hot-toast";
import MapplsLocationPicker from "@/components/ui/MapplsLocationPicker";

export default function ShopkeeperSetupPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showMapplsPicker, setShowMapplsPicker] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [proximityOptIn, setProximityOptIn] = useState(true);

    const [formData, setFormData] = useState({
        shop_name: "",
        category: "Grocery",
        address: "",
        phone: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push(ROUTES.LOGIN_SHOPKEEPER);
                return;
            }
            setUserId(session.user.id);
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleDetectLocation = () => {
        setShowMapplsPicker(true);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        setUploadingPhoto(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${userId}/shop_${Date.now()}.${fileExt}`;

            const { error: uploadErr } = await supabase.storage
                .from("product-images")
                .upload(fileName, file);

            if (uploadErr) throw uploadErr;

            const { data: { publicUrl } } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName);

            setPhotoUrl(publicUrl);
            toast.success("Shop photo uploaded successfully!");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to upload photo. Using standard mock photo.");
            setPhotoUrl("https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSubmitting(true);
        setError("");

        try {
            // Encode the photo URL directly into the address column with standard separator
            const serializedAddress = photoUrl ? `${formData.address} ||| ${photoUrl}` : formData.address;
            const postgisLocation = coords && proximityOptIn ? `POINT(${coords.lng} ${coords.lat})` : null;

            await upsertShopkeeperProfile({
                user_id: userId,
                ...formData,
                address: serializedAddress,
                location: postgisLocation
            } as any);

            toast.success("Shop setup completed!");
            router.push(ROUTES.SHOPKEEPER_DASHBOARD);
        } catch (err: any) {
            setError(err.message || "Failed to set up shop profile.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9933] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#FF9933]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#138808]/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-xl animate-fade-in-up">
                <div className="rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-900/5 sm:p-12">
                    <div className="flex justify-center mb-8">
                        <Logo />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                            Register your Shop
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Provide your shop details and location to connect with local buyers on Marketnera.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="shop_name">
                                Shop Name
                            </label>
                            <input
                                id="shop_name"
                                name="shop_name"
                                type="text"
                                required
                                value={formData.shop_name}
                                onChange={handleChange}
                                placeholder="E.g., Sunrise Supermarket"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="category">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all"
                                >
                                    <option value="Grocery">Grocery</option>
                                    <option value="Pharmacy">Pharmacy</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Hardware">Hardware</option>
                                    <option value="Other">Other</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* Location detection */}
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary text-base">location_on</span>
                                    Business Geolocation
                                </span>
                                <button
                                    type="button"
                                    onClick={handleDetectLocation}
                                    className="text-xs font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[15px]">my_location</span>
                                    Locate on Map
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-center">
                                    <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wide">Latitude</span>
                                    <span className="font-mono font-bold text-slate-700 mt-0.5 block">{coords ? coords.lat.toFixed(6) : "Not set"}</span>
                                </div>
                                <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-center">
                                    <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wide">Longitude</span>
                                    <span className="font-mono font-bold text-slate-700 mt-0.5 block">{coords ? coords.lng.toFixed(6) : "Not set"}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="address">
                                Business Address
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Market Street, City"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="phone">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 outline-none transition-all placeholder-slate-400"
                            />
                        </div>

                        {/* Photo upload */}
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                            <span className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-primary text-base">image</span>
                                Shop Profile Photo
                            </span>
                            <div className="flex items-center gap-4">
                                {photoUrl ? (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 relative shrink-0">
                                        <img src={photoUrl} alt="Shop Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setPhotoUrl("")}
                                            className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-[12px]">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-slate-200 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                                        <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="shop_photo"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="shop_photo"
                                        className="inline-flex px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                                    >
                                        {uploadingPhoto ? "Uploading..." : "Choose Photo File"}
                                    </label>
                                    <p className="text-[10px] text-slate-400 mt-1.5">Support JPEG, PNG, or GIF. Max 5MB.</p>
                                </div>
                            </div>
                        </div>

                        {/* Hyperlocal opt-in toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="pr-4">
                                <span className="text-xs font-bold text-slate-950 uppercase tracking-wider block mb-1">
                                    Hyperlocal Delivery
                                </span>
                                <span className="text-[10px] text-slate-400 block leading-tight">
                                    Register this shop to accept distance-based geofenced orders from buyers.
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setProximityOptIn(!proximityOptIn)}
                                className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 px-0.5 cursor-pointer shrink-0 ${
                                    proximityOptIn ? "bg-[#FF9933]" : "bg-slate-300"
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                                        proximityOptIn ? "translate-x-6" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-bold h-14"
                                disabled={submitting || uploadingPhoto}
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Saving Profile...</span>
                                    </div>
                                ) : (
                                    "Complete Setup & Register"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mappls Location Picker */}
            <MapplsLocationPicker
                isOpen={showMapplsPicker}
                onClose={() => setShowMapplsPicker(false)}
                onLocationSelected={(locationDetails) => {
                    setShowMapplsPicker(false);
                    setFormData(prev => ({ ...prev, address: locationDetails.addressLine }));
                    setCoords({ lat: locationDetails.lat, lng: locationDetails.lng });
                }}
            />
        </div>
    );
}
