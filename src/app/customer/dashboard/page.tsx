"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";

/* ── Static data for demo ── */
const categories = [
    { name: "Grocery",     icon: "grocery",        bg: "bg-orange-50",  border: "border-orange-100",  text: "text-orange-500" },
    { name: "Electronics", icon: "devices",         bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-500" },
    { name: "Medicine",    icon: "medication",      bg: "bg-red-50",     border: "border-red-100",     text: "text-red-500" },
    { name: "Stationery",  icon: "edit_note",       bg: "bg-purple-50",  border: "border-purple-100",  text: "text-purple-500" },
    { name: "Snacks",      icon: "bakery_dining",   bg: "bg-yellow-50",  border: "border-yellow-100",  text: "text-yellow-600" },
    { name: "Fashion",     icon: "checkroom",       bg: "bg-pink-50",    border: "border-pink-100",    text: "text-pink-500" },
    { name: "Home",        icon: "chair",           bg: "bg-teal-50",    border: "border-teal-100",    text: "text-teal-500" },
];

const nearbyShops = [
    { name: "Krishna Supermarket", distance: "0.8 km", time: "15-20 mins", rating: 4.2, reviews: "500+", verified: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFMu7vl9CnuwRjpE3LvE1P7-ZA5JvoEdyS7sjMezpXgWJR-3IVrzOTERpi0uudqkEslpatleU29FLRxrpFonlBT2XREID-QwVvY_0jVrvGvfjFJbJCfmwyIzIBMpRY-Wd3gwHxlno27-kS9y0QEM1PcUmQrOj5-3urLImhdpuqkVFvpv54Fdic5MyrPzcf_y6zvaxF8Gr1Jyr4q5qrC14J7cL4iTHm_M0i_012vROmhaaDaF9pKF9KJaqtSOqDflLdfGUxXcuQeKib" },
    { name: "Fresh Organic Hub",   distance: "1.2 km", time: "25-30 mins", rating: 4.8, reviews: "1k+",  verified: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvts04zORgQUIB0YSMCwiEvec-z2_Yj309_yLN2N9V2yzZWBhRgf05de-2jQDCwCOfAL49W89XuNb1aqS5CdkZ_5s8X-bpVDfv7glnKfhLoQo0Xl08Blg1S3j1N3N15Igo9ifC8gqX9XiQaVqTjoUF2IyX2f2srZNJ25FiUji2r1avMu8v2cbAQhJjRLfFQL7BQ0S0_KZpn3AmZRJVwGOsNaMXkykgaudFPoIhvUqfEJ546GZdQ0VK-kE_H-rqRVQzjIfT-E8DcxcF" },
    { name: "Daily Mart Express",  distance: "2.0 km", time: "30-40 mins", rating: 4.5, reviews: "800+", verified: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFMu7vl9CnuwRjpE3LvE1P7-ZA5JvoEdyS7sjMezpXgWJR-3IVrzOTERpi0uudqkEslpatleU29FLRxrpFonlBT2XREID-QwVvY_0jVrvGvfjFJbJCfmwyIzIBMpRY-Wd3gwHxlno27-kS9y0QEM1PcUmQrOj5-3urLImhdpuqkVFvpv54Fdic5MyrPzcf_y6zvaxF8Gr1Jyr4q5qrC14J7cL4iTHm_M0i_012vROmhaaDaF9pKF9KJaqtSOqDflLdfGUxXcuQeKib" },
];

const products = [
    { name: "Fresh Full Cream Milk 500ml",        category: "Dairy & Eggs",       shop: "Krishna Supermarket", price: 32, originalPrice: 35, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU9ah0czt07YQW_D6WDx3hHHyT8rOWof3IK6yQEUPoNTFW04VQURXt3ODsIl6qaam1kCxgHdiP1QZmZZouWJZbbBrVFOsK6LhbzZRushFzNM9oIPhz7RnQg2fFy7v5KinsAsLDt-OxeAexU6kwHuL8Ukz9oFhZ5OnnW5vUmcupy0VK1I_i_hr31Kg5FjRZrgwyFzGMlVWcxUtZ7-lrcjjyfWeqchZiD41LcM129YAwskgIS8YLg4CfIX12sCtCGd3oh79zs4MCYZbS" },
    { name: "Premium Sliced Sandwich Bread 400g", category: "Bakery",             shop: "Fresh Organic Hub",   price: 45, originalPrice: 50, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG7Qj4LiMdju3e5M5KUvYwxkWjJAPZk-wC8Lx79JiOecd9RV_eb-OFumsYcBmPdyk4phizc5346cKtGn38P17lyFLNgB3vx7nfBmWfIp862JxSn8D_-CkjMWHzz7tsfarProIogelYUz2jn6zl9NaGW_4A8IXUmIfzpsJyMXUQ6DAz885OyGSxMFY4a_4-qG_CaM2yWCEDCw4DoRj_8TLdlHNPmRKhBWA3U9sP060AkaowLlaisALorHHqoXfbdUUgBMgIYEqemRuL" },
    { name: "Banana Robusta - 6 Units",           category: "Fruits & Veggies",   shop: "Fruit Market Pro",    price: 28, originalPrice: 40, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO_jZ8UuAYEwQH7blCyefyoqj8DGmhDiDqMLe1ZvqmUWEUa5H1TOMqmqgv9DjjcS2pBUDC9KCHrY5JaFO7GAFM_M7SawY-p1SgonvP0xAgsIvQLC-Wk4PdeRaEr-nlErLa2o_lnWCq5oNWXmm670NB25HYL7Tu_-4F6ApExz70XXELZ_h3XVLEKbmGSwwE4v71nFFLwJ1FZYvM7h-lP8Kw7VwiAqMaj3d3ZaM6dpCRuQk7G31i4P4Upe2h83r-0ed1FWy8dyZ1Vi28" },
    { name: "Spicy Masala Peanut 150g",           category: "Snacks",             shop: "Snack Corner",        price: 65, originalPrice: 75, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbpLV9hcNIG_E1jYB0bQlJ6ESs4d2807CZ88727tp9DUZJDmTHrQpUCfjadfnpxIRvNS9dH9XSBwvpz7yMZ70VNUz2JvgSMNgA0ijSMyV-EUrBKW9EPX1sjGQxojIXPKWXljlsH4vwXmVN3ht-KATjdK2SFY9S08YekSBt9oJj0NN7dY5q5cHfed9ombdHtoHFU-GxA0HVTZ8PP5pEzHxa_T67kiO39Ek-kRRCYeOGBUtRD_qtU8puteXuQMPxag2AL4lQb8oy7jvm" },
];

export default function CustomerDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [location, setLocation] = useState("Detecting precise location...");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

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

    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Guest";
    const avatarUrl = metadata.avatar_url;
    const initial = fullName.charAt(0).toUpperCase();

    const handleAdd = (index: number) => {
        setAddedItems((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = ROUTES.HOME;
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
                        placeholder="Search for 'Amul Milk', 'Batter', 'Soap'..."
                        type="text"
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

            {/* ─── Categories ─── */}
            <div className="px-4 py-4 overflow-hidden">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                    {categories.map((cat, i) => (
                        <button
                            key={cat.name}
                            className={`flex flex-col items-center gap-2 min-w-[72px] animate-fade-in-up group`}
                            style={{ animationDelay: `${i * 0.07}s` }}
                        >
                            <div className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center border ${cat.border} group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 shadow-sm`}>
                                <span className={`material-symbols-outlined ${cat.text} text-3xl`}>{cat.icon}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600">{cat.name}</span>
                        </button>
                    ))}
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
                    <a className="text-primary text-sm font-semibold hover:underline" href="#">View All</a>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2">
                    {nearbyShops.map((shop, i) => (
                        <div
                            key={shop.name}
                            className="min-w-[240px] bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden animate-slide-in-right hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                            style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                        >
                            <div className="h-24 bg-slate-200 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img alt={shop.name} className="w-full h-full object-cover" src={shop.img} />
                                {shop.verified && (
                                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#13ec5b] text-white text-[10px] font-bold rounded flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] fill-1">verified</span> VERIFIED
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-sm text-slate-800">{shop.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{shop.distance} • {shop.time}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
                                    <span className="text-xs font-bold text-slate-800">{shop.rating}</span>
                                    <span className="text-[10px] text-slate-400">({shop.reviews})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Daily Essentials ─── */}
            <section className="mt-8 px-4">
                <div className="flex justify-between items-center mb-4 animate-fade-in-up delay-400">
                    <h2 className="text-lg font-bold text-slate-900">Daily Essentials</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-slate-100 text-[11px] font-semibold rounded-full border border-slate-200 hover:bg-slate-200 transition-colors">Sort</button>
                        <button className="px-3 py-1 bg-slate-100 text-[11px] font-semibold rounded-full border border-slate-200 hover:bg-slate-200 transition-colors">Filter</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product, i) => (
                        <div
                            key={product.name}
                            className="group bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col animate-fade-in-up hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                        >
                            <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" src={product.img} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{product.category}</p>
                                <h5 className="text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5 leading-snug">{product.name}</h5>
                                <p className="text-[10px] text-primary font-medium mt-1">{product.shop}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">₹{product.price}</span>
                                    <span className="text-[10px] text-slate-400 line-through">₹{product.originalPrice}</span>
                                </div>
                                <button
                                    onClick={() => handleAdd(i)}
                                    className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                                        addedItems.has(i)
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {addedItems.has(i) ? "check" : "add"}
                                    </span>
                                    {addedItems.has(i) ? "ADDED" : "ADD"}
                                </button>
                            </div>
                        </div>
                    ))}
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
