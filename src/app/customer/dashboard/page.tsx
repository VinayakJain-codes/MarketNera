"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { getAllShopkeepers, ShopkeeperProfile, getNearbyShops } from "@/lib/services/shopkeeper";
import { getGlobalProducts, Product } from "@/lib/api/products";
import { addToCart, getCartCount } from "@/lib/services/cart";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getWishlist, toggleWishlist } from "@/lib/services/wishlist";
import toast from "react-hot-toast";

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
    const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set());
    const [wishlistedProductIds, setWishlistedProductIds] = useState<Set<string>>(new Set());
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const router = useRouter();

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

        return () => subscription.unsubscribe();
    }, []);

    // Fetch shops (hyperlocal PostGIS query if coords available)
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

    // Fetch products (with filters)
    const fetchProducts = useCallback(() => {
        setLoadingProducts(true);
        getGlobalProducts({
            search: debouncedSearchQuery || undefined,
            category: selectedCategory === "All" ? undefined : selectedCategory,
            limit: 20,
        }).then((data) => {
            setProducts(data);
            setLoadingProducts(false);
        });
    }, [debouncedSearchQuery, selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Guest";
    const avatarUrl = metadata.avatar_url;
    const initial = fullName.charAt(0).toUpperCase();

    // Fetch cart count from Supabase when user is known
    useEffect(() => {
        if (!user) return;
        getCartCount(user.id).then(setCartCount);
    }, [user]);

    // Fetch wishlist items from Supabase when user is known
    useEffect(() => {
        if (!user) return;
        getWishlist(user.id).then((items) => {
            setWishlistedProductIds(new Set(items.map((i) => i.product_id)));
        });
    }, [user]);

    const handleToggleWishlist = async (productId: string) => {
        if (!user) {
            router.push(ROUTES.LOGIN_CUSTOMER);
            return;
        }

        const isCurrentlyWishlisted = wishlistedProductIds.has(productId);

        // Toggle visual state optimistically
        setWishlistedProductIds((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });

        const { added, error } = await toggleWishlist(user.id, productId);
        if (error) {
            // Revert optimistic state on error
            setWishlistedProductIds((prev) => {
                const next = new Set(prev);
                if (isCurrentlyWishlisted) {
                    next.add(productId);
                } else {
                    next.delete(productId);
                }
                return next;
            });
            toast.error(error);
        }
    };

    const handleAdd = async (product: Product & { shop_id: string }) => {
        if (!user) return;
        const alreadyAdded = addedProductIds.has(product.id);
        // Toggle visual state optimistically
        setAddedProductIds((prev) => {
            const next = new Set(prev);
            if (next.has(product.id)) next.delete(product.id);
            else next.add(product.id);
            return next;
        });
        if (!alreadyAdded) {
            const result = await addToCart(user.id, product.id, product.shop_id);
            if (result.success) {
                setCartCount((c) => c + 1);
            } else {
                // Revert on failure
                setAddedProductIds((prev) => { const next = new Set(prev); next.delete(product.id); return next; });
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = ROUTES.HOME;
    };

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
        <div className="w-full max-w-[480px] md:max-w-5xl lg:max-w-7xl mx-auto bg-white min-h-screen shadow-xl relative pb-24">
            {/* ─── Header ─── */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 pt-4 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4 animate-fade-in-up">
                    {/* Location */}
                    <button
                        onClick={() => setShowLocationModal(!showLocationModal)}
                        className="flex items-center gap-2 group bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 premium-hover"
                    >
                        <div className="text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">location_on</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[140px] md:max-w-[200px] leading-tight">
                                {location}
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:rotate-180 transition-transform">
                            expand_more
                        </span>
                    </button>

                    {/* Right side — Notification + Avatar */}
                    <div className="flex gap-3 items-center">
                        <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow premium-hover">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                        </button>
                        <button onClick={handleLogout} title="Log Out" className="relative w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow premium-hover text-slate-600 hover:text-red-500">
                            <span className="material-symbols-outlined transition-colors">logout</span>
                        </button>
                        <a
                            href={ROUTES.CUSTOMER_PROFILE}
                            title="My Profile"
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

                {/* Search bar */}
                <div className="relative mt-2 animate-fade-in-up delay-100">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-xl">search</span>
                    </div>
                    <input
                        className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:shadow-md placeholder-slate-400 outline-none transition-all premium-hover"
                        placeholder="Search products, shops..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
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
                <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap md:justify-center">
                    {dynamicCategories.map((catName, i) => {
                        const cfg = CATEGORY_CONFIG[catName] ?? CATEGORY_CONFIG.Other;
                        const isActive = selectedCategory === catName;
                        return (
                            <button
                                key={catName}
                                onClick={() => setSelectedCategory(catName)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap animate-fade-in-up transition-all premium-hover
                                    ${isActive 
                                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]" 
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-primary/50 hover:text-primary"}`}
                                style={{ animationDelay: `${i * 0.05}s` }}
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

            {/* ─── Promo Banner ─── */}
            <div className="px-4 py-2 animate-fade-in-up delay-200">
                <div className="w-full h-36 md:h-40 rounded-3xl bg-gradient-to-r from-[#FF6B35] via-[#F97316] to-[#FBBF24] p-6 flex justify-between items-center relative overflow-hidden shadow-xl shadow-primary/25 premium-hover"
                     style={{ backgroundImage: `radial-gradient(circle at 10px 10px, rgba(255,255,255,0.15) 2px, transparent 0)`, backgroundSize: '24px 24px', backgroundColor: '#F97316' }}>
                    <div className="z-10 flex flex-col items-start">
                        <h3 className="text-white text-xl md:text-2xl font-black leading-tight tracking-tight drop-shadow-sm">
                            Fresh Grocery<br />at Your Doorstep
                        </h3>
                        <p className="text-white/90 text-xs font-medium mt-1">Get 20% off on your first order</p>
                        <button 
                            onClick={() => {
                                setSelectedCategory("Grocery");
                                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="mt-4 px-6 py-2 bg-white text-primary rounded-xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            ORDER NOW
                        </button>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 opacity-90 animate-float drop-shadow-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-[80px] text-white/40">shopping_basket</span>
                    </div>
                </div>
            </div>

            {/* ─── Nearby Shops ─── */}
            <section className="mt-8" id="shops">
                <div className="flex flex-col px-4 mb-4 animate-fade-in-up delay-300">
                    <span className="uppercase tracking-widest text-[10px] font-bold text-slate-400 mb-1">Explore</span>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Nearby Shops</h2>
                        <span className="text-primary text-sm font-semibold">{shops.length} shops</span>
                    </div>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 pt-1 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible">
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
                                    onClick={() => router.push(`/shop/${shop.user_id}`)}
                                    className="min-w-[200px] md:min-w-0 bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden animate-slide-in-right premium-hover cursor-pointer flex flex-col"
                                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                                >
                                    {/* Shop banner using category gradient */}
                                    <div className={`h-20 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center relative`}>
                                        <span className={`material-symbols-outlined text-[48px] text-orange-200`}>{cfg.icon}</span>
                                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-[#22c55e] text-white rounded-full shadow-sm">
                                            <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                        </div>
                                    </div>
                                    <div className="p-3.5 flex flex-col flex-grow">
                                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{shop.shop_name}</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                                                {shop.category}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[12px]">schedule</span> 15 min
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* ─── Products ─── */}
            <section className="mt-8 px-4" id="products">
                <div className="flex justify-between items-center mb-4 animate-fade-in-up delay-400">
                    <h2 className="text-lg font-bold text-slate-900">
                        {selectedCategory === "All" ? "All Products" : selectedCategory}
                    </h2>
                    <span className="text-slate-400 text-xs">
                        {loadingProducts ? "Loading..." : `${products.length} items`}
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                            const isAdded = addedProductIds.has(product.id);
                            const discountPct = product.sale_price && product.sale_price < product.price
                                ? Math.round((1 - product.sale_price / product.price) * 100)
                                : null;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl p-3 shadow-sm border border-slate-100/80 flex flex-col animate-fade-in-up premium-hover"
                                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                                >
                                    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3 relative">
                                        <button
                                            onClick={() => handleToggleWishlist(product.id)}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all duration-300 z-10"
                                            aria-label="Add to wishlist"
                                        >
                                            <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
                                                wishlistedProductIds.has(product.id) ? "fill-1 text-red-500 scale-110" : "hover:scale-110"
                                            }`}>
                                                favorite
                                            </span>
                                        </button>
                                        {imgUrl ? (
                                            <Image
                                                alt={product.name}
                                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                                src={imgUrl}
                                                width={200}
                                                height={200}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className={`w-full h-full ${cfg.bg} flex items-center justify-center`}>
                                                <span className={`material-symbols-outlined text-[48px] ${cfg.text} opacity-40`}>{cfg.icon}</span>
                                            </div>
                                        )}
                                        {discountPct && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                                                -{discountPct}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow flex flex-col justify-start">
                                        <h5 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">{product.name}</h5>
                                        {product.unit_type && (
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">{product.unit_type}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-base font-black text-slate-900 tracking-tight">
                                                ₹{product.sale_price ?? product.price}
                                            </span>
                                            {product.sale_price && product.sale_price < product.price && (
                                                <span className="text-xs text-slate-400 line-through font-medium">₹{product.price}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAdd(product as any)}
                                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all premium-active ${
                                                isAdded
                                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                                    : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[18px] font-bold">
                                                {isAdded ? "check" : "add"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* ─── Bottom Navigation ─── */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] md:max-w-5xl lg:max-w-7xl bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around pb-4 pt-3 z-50">
                <a className="flex flex-col items-center gap-1 text-primary relative" href={ROUTES.CUSTOMER_DASHBOARD}>
                    <div className="absolute -top-3 w-8 h-0.5 bg-primary rounded-b-full"></div>
                    <span className="material-symbols-outlined fill-1">home</span>
                    <span className="text-[10px] font-bold">Home</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#shops">
                    <span className="material-symbols-outlined">storefront</span>
                    <span className="text-[10px] font-bold">Shops</span>
                </a>
                <div className="relative -mt-10">
                    <a
                        href={ROUTES.CUSTOMER_CART}
                        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/40 border-4 border-white premium-hover premium-active"
                        aria-label="View cart"
                    >
                        <span className="material-symbols-outlined text-[28px] fill-1 text-white">shopping_bag</span>
                        {cartCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white animate-bounce-badge">
                                {cartCount > 99 ? "99+" : cartCount}
                            </div>
                        )}
                    </a>
                </div>
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
    );
}
