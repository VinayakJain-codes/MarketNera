"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { getAllShopkeepers, ShopkeeperProfile } from "@/lib/services/shopkeeper";
import { getGlobalProducts, Product } from "@/lib/api/products";

/* ── Category config (UI metadata only, not dummy data) ── */
const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; border: string; text: string }> = {
    Grocery:     { icon: "grocery",      bg: "bg-orange-50",  border: "border-orange-100",  text: "text-orange-500" },
    Electronics: { icon: "devices",      bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-500" },
    Medicine:    { icon: "medication",   bg: "bg-red-50",     border: "border-red-100",     text: "text-red-500" },
    Stationery:  { icon: "edit_note",    bg: "bg-purple-50",  border: "border-purple-100",  text: "text-purple-500" },
    Snacks:      { icon: "bakery_dining",bg: "bg-yellow-50",  border: "border-yellow-100",  text: "text-yellow-600" },
    Fashion:     { icon: "checkroom",    bg: "bg-pink-50",    border: "border-pink-100",    text: "text-pink-500" },
    Home:        { icon: "chair",        bg: "bg-teal-50",    border: "border-teal-100",    text: "text-teal-500" },
    Other:       { icon: "category",     bg: "bg-slate-50",   border: "border-slate-100",   text: "text-slate-500" },
};

/* ── Skeleton loaders ── */
const ShopSkeleton = () => (
    <div className="min-w-[240px] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
        <div className="h-24 bg-slate-200" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
    </div>
);

const ProductSkeleton = () => (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col animate-pulse">
        <div className="aspect-square bg-slate-200 rounded-lg mb-3" />
        <div className="space-y-2 flex-grow">
            <div className="h-2 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded" />
            <div className="h-2 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="mt-3 flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-8 bg-slate-200 rounded w-1/4" />
        </div>
    </div>
);

export default function CustomerDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [location, setLocation] = useState("Detecting precise location...");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Real data state
    const [shops, setShops] = useState<ShopkeeperProfile[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingShops, setLoadingShops] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Auth
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Auto-detect location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                        );
                        const data = await res.json();
                        const addr = data.address;
                        const preciseParts = [
                            addr.house_number,
                            addr.road || addr.street || addr.pedestrian,
                            addr.suburb || addr.neighbourhood || addr.residential,
                            addr.city || addr.town || addr.village,
                            addr.postcode
                        ].filter(Boolean);

                        setLocation(
                            preciseParts.length > 0
                                ? preciseParts.join(", ")
                                : data.display_name.split(",").slice(0, 3).join(", ")
                        );
                    } catch {
                        setLocation("Location unavailable");
                    }
                },
                () => setLocation("Enable location access"),
            );
        }
    }, []);

    // Fetch shops
    useEffect(() => {
        getAllShopkeepers().then((data) => {
            setShops(data);
            setLoadingShops(false);
        });
    }, []);

    // Fetch products (with filters)
    const fetchProducts = useCallback(() => {
        setLoadingProducts(true);
        getGlobalProducts({
            search: searchQuery || undefined,
            category: selectedCategory === "All" ? undefined : selectedCategory,
            limit: 20,
        }).then((data) => {
            setProducts(data);
            setLoadingProducts(false);
        });
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Guest";
    const avatarUrl = metadata.avatar_url;
    const initial = fullName.charAt(0).toUpperCase();

    const handleAdd = (productId: string) => {
        setAddedItems((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = ROUTES.HOME;
    };
    void handleLogout; // suppress lint warning — exposed via UI if needed

    // Unique categories from real products
    const dynamicCategories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    // Get product primary image
    const getProductImage = (product: Product & { product_media?: { media_url: string; is_primary: boolean; sort_order: number }[] }): string => {
        const media = product.product_media;
        if (!media || media.length === 0) return "";
        const primary = media.find(m => m.is_primary) || media.sort((a, b) => a.sort_order - b.sort_order)[0];
        return primary?.media_url ?? "";
    };

    return (
        <div className="max-w-[480px] mx-auto bg-white min-h-screen shadow-xl relative pb-24">
            {/* ─── Header ─── */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 pt-4 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4 animate-fade-in-up">
                    {/* Location */}
                    <button
                        onClick={() => setShowLocationModal(!showLocationModal)}
                        className="flex items-center gap-2 group"
                    >
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-3xl">location_on</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Delivering to
                                </span>
                                <span className="material-symbols-outlined text-xs text-slate-400 group-hover:rotate-180 transition-transform">
                                    expand_more
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                                {location}
                            </p>
                        </div>
                    </button>

                    {/* Right side — Notification + Avatar */}
                    <div className="flex gap-3 items-center">
                        <button className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                        <a
                            href={ROUTES.CUSTOMER_PROFILE}
                            title="My Profile"
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary hover:scale-110 transition-all duration-300 shadow-sm"
                        >
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                    {initial}
                                </div>
                            )}
                        </a>
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative group animate-fade-in-up delay-100">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:bg-white focus:shadow-lg placeholder-slate-400 outline-none transition-all duration-300"
                        placeholder="Search products, shops..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-xl">mic</span>
                    </div>
                </div>
            </header>

            {/* ─── Location Modal ─── */}
            {showLocationModal && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6 pb-10 shadow-2xl animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Choose your location</h3>
                            <button onClick={() => setShowLocationModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                navigator.geolocation?.getCurrentPosition(async (pos) => {
                                    try {
                                        const res = await fetch(
                                            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
                                        );
                                        const data = await res.json();
                                        const addr = data.address;
                                        const parts = [
                                            addr.house_number,
                                            addr.road || addr.street,
                                            addr.suburb || addr.neighbourhood,
                                            addr.city || addr.town || addr.village,
                                            addr.postcode
                                        ].filter(Boolean);
                                        setLocation(parts.length > 0 ? parts.join(", ") : data.display_name.split(",").slice(0, 3).join(", "));
                                    } catch {
                                        setLocation("Location unavailable");
                                    }
                                });
                                setShowLocationModal(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
                        >
                            <span className="material-symbols-outlined">my_location</span>
                            Use my current location
                        </button>
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Search for area, street name..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary placeholder-slate-400"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setLocation((e.target as HTMLInputElement).value);
                                        setShowLocationModal(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Categories (from real product data) ─── */}
            <div className="px-4 py-4 overflow-hidden">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                    {dynamicCategories.map((catName, i) => {
                        const cfg = CATEGORY_CONFIG[catName] ?? CATEGORY_CONFIG.Other;
                        const isActive = selectedCategory === catName;
                        return (
                            <button
                                key={catName}
                                onClick={() => setSelectedCategory(catName)}
                                className={`flex flex-col items-center gap-2 min-w-[72px] animate-fade-in-up group`}
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-sm group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-lg
                                    ${isActive ? `${cfg.text} bg-white border-current shadow-md scale-105` : `${cfg.bg} ${cfg.border}`}`}>
                                    <span className={`material-symbols-outlined ${isActive ? cfg.text : cfg.text} text-3xl`}>{catName === "All" ? "grid_view" : cfg.icon}</span>
                                </div>
                                <span className={`text-[11px] font-semibold ${isActive ? "text-slate-900" : "text-slate-600"}`}>{catName}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── Promo Banner ─── */}
            <div className="px-4 py-2 animate-fade-in-up delay-200">
                <div className="w-full h-36 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 p-6 flex justify-between items-center relative overflow-hidden shadow-lg shadow-orange-500/20">
                    <div className="z-10">
                        <h3 className="text-white text-xl font-bold leading-tight">
                            Fresh Grocery<br />at Your Doorstep
                        </h3>
                        <p className="text-white/80 text-xs mt-1">Get 20% off on your first order</p>
                        <button className="mt-3 px-5 py-2 bg-white text-orange-600 rounded-lg text-xs font-bold shadow-lg hover:scale-105 transition-transform">
                            ORDER NOW
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 animate-float">
                        <span className="material-symbols-outlined text-[120px] text-white">shopping_basket</span>
                    </div>
                </div>
            </div>

            {/* ─── Nearby Shops ─── */}
            <section className="mt-6">
                <div className="flex justify-between items-center px-4 mb-4 animate-fade-in-up delay-300">
                    <h2 className="text-lg font-bold text-slate-900">Nearby Shops</h2>
                    <span className="text-primary text-sm font-semibold">{shops.length} shops</span>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2">
                    {loadingShops ? (
                        [1, 2, 3].map(i => <ShopSkeleton key={i} />)
                    ) : shops.length === 0 ? (
                        <div className="w-full text-center py-8 text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">storefront</span>
                            No shops registered yet
                        </div>
                    ) : (
                        shops.map((shop, i) => {
                            const cfg = CATEGORY_CONFIG[shop.category] ?? CATEGORY_CONFIG.Other;
                            return (
                                <div
                                    key={shop.user_id}
                                    className="min-w-[240px] bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden animate-slide-in-right hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                                    style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                                >
                                    {/* Shop banner using category color */}
                                    <div className={`h-24 ${cfg.bg} flex items-center justify-center relative`}>
                                        <span className={`material-symbols-outlined text-[56px] ${cfg.text} opacity-40`}>{cfg.icon}</span>
                                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#2D9E4B] text-white text-[10px] font-bold rounded flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] fill-1">verified</span> VERIFIED
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-sm text-slate-800">{shop.shop_name}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{shop.category}</p>
                                        <p className="text-xs text-slate-400 mt-1 truncate">{shop.address}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* ─── Products ─── */}
            <section className="mt-8 px-4">
                <div className="flex justify-between items-center mb-4 animate-fade-in-up delay-400">
                    <h2 className="text-lg font-bold text-slate-900">
                        {selectedCategory === "All" ? "All Products" : selectedCategory}
                    </h2>
                    <span className="text-slate-400 text-xs">
                        {loadingProducts ? "Loading..." : `${products.length} items`}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {loadingProducts ? (
                        [1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)
                    ) : products.length === 0 ? (
                        <div className="col-span-2 text-center py-16 text-slate-400">
                            <span className="material-symbols-outlined text-5xl block mb-2 text-slate-300">inventory_2</span>
                            <p className="text-sm font-semibold">No products found</p>
                            <p className="text-xs mt-1">
                                {searchQuery ? `No results for "${searchQuery}"` : "No published products yet"}
                            </p>
                        </div>
                    ) : (
                        products.map((product, i) => {
                            const imgUrl = getProductImage(product as any);
                            const cfg = CATEGORY_CONFIG[product.category] ?? CATEGORY_CONFIG.Other;
                            const isAdded = addedItems.has(product.id);
                            const discountPct = product.sale_price && product.sale_price < product.price
                                ? Math.round((1 - product.sale_price / product.price) * 100)
                                : null;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col animate-fade-in-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                                >
                                    <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3 relative">
                                        {imgUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                alt={product.name}
                                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                                src={imgUrl}
                                            />
                                        ) : (
                                            <div className={`w-full h-full ${cfg.bg} flex items-center justify-center`}>
                                                <span className={`material-symbols-outlined text-[48px] ${cfg.text} opacity-40`}>{cfg.icon}</span>
                                            </div>
                                        )}
                                        {discountPct && (
                                            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                -{discountPct}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{product.category}</p>
                                        <h5 className="text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5 leading-snug">{product.name}</h5>
                                        {product.unit_type && (
                                            <p className="text-[10px] text-primary font-medium mt-1">per {product.unit_type}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">
                                                ₹{product.sale_price ?? product.price}
                                            </span>
                                            {product.sale_price && product.sale_price < product.price && (
                                                <span className="text-[10px] text-slate-400 line-through">₹{product.price}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAdd(product.id)}
                                            className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                                                isAdded
                                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                                    : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                {isAdded ? "check" : "add"}
                                            </span>
                                            {isAdded ? "ADDED" : "ADD"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* ─── Bottom Navigation ─── */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass-nav border-t border-slate-100 flex items-center justify-around py-3 z-50">
                <a className="flex flex-col items-center gap-1 text-primary" href="#">
                    <span className="material-symbols-outlined fill-1">home</span>
                    <span className="text-[10px] font-bold">Home</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#">
                    <span className="material-symbols-outlined">storefront</span>
                    <span className="text-[10px] font-medium">Shops</span>
                </a>
                <div className="relative -mt-8">
                    <button className="w-14 h-14 bg-[#13ec5b] text-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-[#13ec5b]/30 border-4 border-white hover:scale-110 transition-transform active:scale-95">
                        <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse-badge">
                            {addedItems.size}
                        </div>
                    </button>
                </div>
                <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#">
                    <span className="material-symbols-outlined">receipt_long</span>
                    <span className="text-[10px] font-medium">Orders</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href={ROUTES.CUSTOMER_PROFILE}>
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-medium">Profile</span>
                </a>
            </nav>
        </div>
    );
}
