"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { upsertShopkeeperProfile } from "@/lib/services/shopkeeper";
import { ROUTES } from "@/constants/routes";
import Button from "@/components/ui/Button";
import Logo from "@/components/layout/Logo";

export default function ShopkeeperSetupPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSubmitting(true);
        setError("");

        try {
            await upsertShopkeeperProfile({
                user_id: userId,
                ...formData,
            });
            // Redirect to dashboard on success
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
                            Set up your Shop
                        </h1>
                        <p className="text-slate-500">
                            Provide your shop details to get started on Marketnera.
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
                                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/20 outline-none transition-all"
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
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#138808] focus:ring-2 focus:ring-[#138808]/20 outline-none transition-all placeholder-slate-400"
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-bold h-14"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Saving Profile...</span>
                                    </div>
                                ) : (
                                    "Complete Setup"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
