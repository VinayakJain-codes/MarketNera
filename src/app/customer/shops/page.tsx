"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { getAllShopkeepers, ShopkeeperProfile, getNearbyShops } from "@/lib/services/shopkeeper";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

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

const ShopSkeleton = () => (
    <div className="min-w-0 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
        <div className="h-28 bg-slate-200" />
        <div className="p-4 space-y-2">
            <div className="h-3.5 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
    </div>
);

export default function CustomerShopsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [location, setLocation] = useState("Detecting precise location...");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const router = useRouter();

    const [shops, setShops] = useState<ShopkeeperProfile[]>([]);
    const [loadingShops, setLoadingShops] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Auto-detect location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                        );
                        const data = await res.json();
                        const fullAddress = data.display_name ? data.display_name.replace(", India", "").trim() : "Location detected";
                        setLocation(fullAddress);
                    } catch {
                        setLocation("Location unavailable");
                    }
                },
                () => setLocation("Enable location access"),
            );
        }

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        setLoadingShops(true);
        if (coords) {
            getNearbyShops(coords.lat, coords.lng).then((data) => {
                setShops(data);
                setLoadingShops(false);
            });
        } else {
            getAllShopkeepers().then((data) => {
                setShops(data);
                setLoadingShops(false);
            });
        }
    }, [coords]);

    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Guest";
    const avatarUrl = metadata.avatar_url;
    const initial = fullName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = ROUTES.HOME;
    };

    // Filter shops based on search query and category
    const filteredShops = shops.filter((shop) => {
        const matchesCategory = selectedCategory === "All" || shop.category === selectedCategory;
        const matchesSearch = shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              shop.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const uniqueCategories = ["All", ...Array.from(new Set(shops.map(s => s.category)))];

    return (
        <div className="w-full bg-slate-50/40 min-h-screen">
            <div className="w-full max-w-[480px] md:max-w-none mx-auto bg-white min-h-screen md:shadow-none shadow-xl relative">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 md:py-0 border-b border-slate-100/80">
                    <div className="max-w-7xl mx-auto md:px-6 flex items-center justify-between h-auto md:h-16 gap-4">
                        <div className="hidden md:flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => router.push(ROUTES.CUSTOMER_DASHBOARD)}>
                            <span className="material-symbols-outlined text-primary text-3xl font-black">shopping_basket</span>
                            <span className="font-extrabold text-slate-800 text-lg tracking-tight">Marketnera</span>
                        </div>

                        <button
                            onClick={() => setShowLocationModal(!showLocationModal)}
                            className="flex items-center gap-2 group bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors premium-hover shrink-0"
                        >
                            <div className="text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">location_on</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="text-[11px] font-bold text-slate-800 truncate max-w-[100px] sm:max-w-[140px] md:max-w-[200px] leading-tight">
                                    {location}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:rotate-180 transition-transform">
                                expand_more
                            </span>
                        </button>

                        {/* Search on Desktop */}
                        <div className="hidden md:block flex-1 max-w-xl mx-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                className="block w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200/85 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white placeholder-slate-400 outline-none transition-all"
                                placeholder="Search shops by name or type..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                            <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow premium-hover">
                                <span className="material-symbols-outlined text-slate-600">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                            </button>

                            <button onClick={handleLogout} title="Log Out" className="relative w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow premium-hover text-slate-600 hover:text-red-500">
                                <span className="material-symbols-outlined transition-colors">logout</span>
                            </button>

                            <a
                                href={ROUTES.CUSTOMER_PROFILE}
                                className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/50 hover:scale-110 shadow-sm transition-all duration-300"
                            >
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt={fullName} width={40} height={40} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {initial}
                                    </div>
                                )}
                            </a>
                        </div>
                    </div>

                    <div className="relative mt-2 md:hidden">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </div>
                        <input
                            className="block w-full pl-11 pr-12 py-3 bg-white border border-slate-200 shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:shadow-md placeholder-slate-400 outline-none transition-all premium-hover"
                            placeholder="Search shops..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {/* Location Modal */}
                {showLocationModal && (
                    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6 pb-10 shadow-2xl">
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
                                            const fullAddress = data.display_name ? data.display_name.replace(", India", "").trim() : "Location detected";
                                            setLocation(fullAddress);
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
                        </div>
                    </div>
                )}

                <div className="flex max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)]">
                    {/* Left Sidebar */}
                    <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 px-4 py-6 sticky top-16 h-[calc(100vh-4rem)] bg-white shrink-0">
                        <nav className="space-y-1.5 flex-1">
                            <a
                                href={ROUTES.CUSTOMER_DASHBOARD}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">home</span>
                                Home
                            </a>
                            <a
                                href="/customer/shops"
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-primary/10 text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined fill-1">storefront</span>
                                Shops
                            </a>
                            <a
                                href={ROUTES.CUSTOMER_CART}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">shopping_bag</span>
                                My Cart
                            </a>
                            <a
                                href={ROUTES.CUSTOMER_ORDERS}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">receipt_long</span>
                                Orders
                            </a>
                            <a
                                href={ROUTES.CUSTOMER_PROFILE}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">person</span>
                                Profile
                            </a>
                        </nav>
                    </aside>

                    {/* Main Shops Grid */}
                    <main className="flex-1 min-w-0 pb-24 md:pb-8 md:px-6 py-4">
                        <div className="px-4 md:px-0 py-2 mb-4">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Registered Shops</h1>
                            <p className="text-slate-500 text-sm">Discover amazing local shops offering quick delivery to your doorstep.</p>
                        </div>

                        {/* Category Filter */}
                        <div className="px-4 md:px-0 py-2 overflow-hidden mb-6">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap md:justify-start">
                                {uniqueCategories.map((catName) => {
                                    const cfg = CATEGORY_CONFIG[catName] ?? CATEGORY_CONFIG.Other;
                                    const isActive = selectedCategory === catName;
                                    return (
                                        <button
                                            key={catName}
                                            onClick={() => setSelectedCategory(catName)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all premium-hover
                                                ${isActive 
                                                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                                                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:text-primary"}`}
                                        >
                                            <span className={`material-symbols-outlined text-[16px] ${isActive ? "text-white" : cfg.text}`}>
                                                {catName === "All" ? "grid_view" : cfg.icon}
                                            </span>
                                            {catName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {loadingShops ? (
                                [1, 2, 3, 4].map(i => <ShopSkeleton key={i} />)
                            ) : filteredShops.length === 0 ? (
                                <div className="col-span-full text-center py-16 text-slate-400 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                    <span className="material-symbols-outlined text-5xl block mb-2 text-slate-300">store_off</span>
                                    <p className="text-sm font-semibold">No matching shops found</p>
                                </div>
                            ) : (
                                filteredShops.map((shop) => {
                                    const cfg = CATEGORY_CONFIG[shop.category] ?? CATEGORY_CONFIG.Other;
                                    const [cleanAddress, shopPhoto] = (shop.address || "").split(" ||| ");
                                    return (
                                        <div
                                            key={shop.user_id}
                                            onClick={() => router.push(`/shop/${shop.user_id}`)}
                                            className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden premium-hover cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div className="h-28 bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden flex items-center justify-center">
                                                {shopPhoto ? (
                                                    <Image src={shopPhoto} alt={shop.shop_name} width={280} height={112} className="w-full h-full object-cover" unoptimized />
                                                ) : (
                                                    <span className="material-symbols-outlined text-[56px] text-orange-200/80">{cfg.icon}</span>
                                                )}
                                                <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-[#22c55e] text-white rounded-full shadow-sm z-10">
                                                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                                </div>
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 mb-1">{shop.shop_name}</h4>
                                                <p className="text-xs text-slate-400 font-medium line-clamp-1 mb-3 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[13px]">location_on</span> {cleanAddress}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        {shop.category}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                                                        <span className="material-symbols-outlined text-[12px]">schedule</span> 15 min
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </main>
                </div>

                {/* Mobile Nav */}
                <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] md:hidden bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around pb-4 pt-3 z-50">
                    <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href={ROUTES.CUSTOMER_DASHBOARD}>
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-[10px] font-bold">Home</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-primary relative" href="/customer/shops">
                        <div className="absolute -top-3 w-8 h-0.5 bg-primary rounded-b-full"></div>
                        <span className="material-symbols-outlined fill-1">storefront</span>
                        <span className="text-[10px] font-bold">Shops</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href={ROUTES.CUSTOMER_CART}>
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span className="text-[10px] font-bold">Cart</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href={ROUTES.CUSTOMER_ORDERS}>
                        <span className="material-symbols-outlined">receipt_long</span>
                        <span className="text-[10px] font-bold">Orders</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href={ROUTES.CUSTOMER_PROFILE}>
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-bold">Profile</span>
                    </a>
                </nav>
            </div>
        </div>
    );
}
