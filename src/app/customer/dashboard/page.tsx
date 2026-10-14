"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { getAllShopkeepers, ShopkeeperProfile, getNearbyShops } from "@/lib/services/shopkeeper";
import { getLiveCatalogProducts, LiveCatalogProduct } from "@/lib/services/customerCatalog";
import { getCustomerOrders, Order } from "@/lib/services/orders";
import { getWishlistCount } from "@/lib/services/wishlist";
import { getAddressCount } from "@/lib/services/addresses";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/customer/ProductCard";
import {
    ShoppingBag,
    Heart,
    MapPin,
    Clock,
    Store,
    ArrowRight,
    Truck,
    Package,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    Search,
    ChevronRight,
    SlidersHorizontal,
    Compass,
    MessageCircle,
} from "lucide-react";

/* ── Active status display metadata ── */
const ACTIVE_STATUS_INFO: Record<string, { title: string; desc: string; badge: string }> = {
    pending: {
        title: "Order Placed — Waiting for Store Acceptance",
        desc: "Your order has been sent to the store. You'll receive live alerts as soon as it's accepted.",
        badge: "Waiting Acceptance",
    },
    accepted: {
        title: "Order Accepted by Store",
        desc: "The store has accepted your order and will start packing shortly.",
        badge: "Order Accepted",
    },
    preparing: {
        title: "Store is Preparing Your Order",
        desc: "Your items are being freshly packed and prepared for delivery.",
        badge: "Preparing Items",
    },
    ready: {
        title: "Ready / Out for Delivery",
        desc: "Your order is packed and heading to your delivery address!",
        badge: "Out for Delivery",
    },
};

/* ── Category metadata with Lucide icons ── */
const CATEGORIES = [
    { label: "All", id: "All" },
    { label: "Grocery & Staples", id: "Grocery" },
    { label: "Snacks & Drinks", id: "Snacks" },
    { label: "Dairy & Bakery", id: "Dairy" },
    { label: "Pharmacy & Care", id: "Medicine" },
    { label: "Electronics", id: "Electronics" },
    { label: "Home Essentials", id: "Home" },
    { label: "Stationery", id: "Stationery" },
];

export default function CustomerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Location
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Data state
    const [shops, setShops] = useState<ShopkeeperProfile[]>([]);
    const [products, setProducts] = useState<LiveCatalogProduct[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [orderCount, setOrderCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [addressCount, setAddressCount] = useState(0);

    const [loadingShops, setLoadingShops] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Auth & User Profile
    useEffect(() => {
        let isMounted = true;
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return;
            setUser(session?.user ?? null);
            setAuthLoading(false);

            if (session?.user) {
                // Fetch stats for customer
                getWishlistCount(session.user.id).then((c) => isMounted && setWishlistCount(c));
                getAddressCount(session.user.id).then((c) => isMounted && setAddressCount(c));
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });

        // Detect Location
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => console.log("Location access denied or unavailable")
            );
        }

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Fetch and sync active customer orders in real-time
    const refreshCustomerOrders = useCallback(async () => {
        if (!user) return;
        try {
            const orders = await getCustomerOrders(user.id);
            setOrderCount(orders.length);
            // Only keep truly active in-progress orders
            const ongoing = orders.filter((o) =>
                ["pending", "accepted", "preparing", "ready"].includes(o.status)
            );
            setActiveOrders(ongoing);
        } catch (e) {
            console.error("Error refreshing customer orders on dashboard:", e);
        }
    }, [user]);

    // Live sync for customer active orders: 3.5s auto-polling, focus listener, custom events, Supabase realtime
    useEffect(() => {
        if (!user) return;
        refreshCustomerOrders();

        const onFocus = () => refreshCustomerOrders();
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onFocus);

        const pollInterval = setInterval(() => {
            refreshCustomerOrders();
        }, 3500);

        const onOrderEvent = () => refreshCustomerOrders();
        window.addEventListener("customer_order_placed", onOrderEvent);
        window.addEventListener("customer_order_delivered", onOrderEvent);

        const channel = supabase
            .channel(`dashboard-orders-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                    filter: `customer_id=eq.${user.id}`,
                },
                () => {
                    refreshCustomerOrders();
                }
            )
            .subscribe();

        return () => {
            clearInterval(pollInterval);
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onFocus);
            window.removeEventListener("customer_order_placed", onOrderEvent);
            window.removeEventListener("customer_order_delivered", onOrderEvent);
            supabase.removeChannel(channel);
        };
    }, [user, refreshCustomerOrders]);

    // Fetch Shops
    useEffect(() => {
        setLoadingShops(true);
        if (coords) {
            getNearbyShops(coords.lat, coords.lng)
                .then((data) => {
                    setShops(data);
                    setLoadingShops(false);
                })
                .catch(() => setLoadingShops(false));
        } else {
            getAllShopkeepers()
                .then((data) => {
                    setShops(data);
                    setLoadingShops(false);
                })
                .catch(() => setLoadingShops(false));
        }
    }, [coords]);

    // Fetch Products
    const fetchProducts = useCallback(() => {
        setLoadingProducts(true);
        getLiveCatalogProducts({
            search: debouncedSearch || undefined,
            category: selectedCategory === "All" ? undefined : selectedCategory,
            limit: 40,
        })
            .then((data) => {
                setProducts(data);
                setLoadingProducts(false);
            })
            .catch(() => setLoadingProducts(false));
    }, [debouncedSearch, selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const metadata = user?.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Valued Customer";
    const initial = fullName.charAt(0).toUpperCase();

    // Latest active order for quick tracking widget
    const latestActiveOrder = activeOrders[0] || null;

    return (
        <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
            {/* Top Navigation */}
            <CustomerNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8 flex-1">
                {/* ─── Customer Welcome & Dashboard Command Bar ─── */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
                    {/* Background Decorative Accents */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl -z-0 pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-teal-50/40 rounded-full blur-2xl -z-0 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Left: Greeting & Profile Info */}
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
                                {user?.user_metadata?.avatar_url ? (
                                    <Image
                                        src={user.user_metadata.avatar_url}
                                        alt={fullName}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover rounded-2xl"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    initial
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                        Hi, {fullName}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Verified Customer</span>
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Hyperlocal delivery in 15–30 mins to Civil Lines, Meerut</span>
                                </p>
                            </div>
                        </div>

                        {/* Right: Quick Portal Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                            <Link
                                href={ROUTES.CUSTOMER_ORDERS}
                                className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all text-center flex flex-col items-center justify-center"
                            >
                                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-emerald-700 mb-1">
                                    <ShoppingBag className="w-4 h-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Orders
                                    </span>
                                </div>
                                <span className="text-lg font-black text-slate-900 group-hover:text-emerald-700">
                                    {orderCount}
                                </span>
                            </Link>

                            <Link
                                href={ROUTES.CUSTOMER_WISHLIST}
                                className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all text-center flex flex-col items-center justify-center"
                            >
                                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-emerald-700 mb-1">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Wishlist
                                    </span>
                                </div>
                                <span className="text-lg font-black text-slate-900 group-hover:text-emerald-700">
                                    {wishlistCount}
                                </span>
                            </Link>

                            <Link
                                href={ROUTES.CUSTOMER_ADDRESSES}
                                className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all text-center flex flex-col items-center justify-center"
                            >
                                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-emerald-700 mb-1">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Saved
                                    </span>
                                </div>
                                <span className="text-lg font-black text-slate-900 group-hover:text-emerald-700">
                                    {addressCount}
                                </span>
                            </Link>

                            <Link
                                href={ROUTES.CUSTOMER_SHOPS}
                                className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 hover:border-emerald-200 transition-all text-center flex flex-col items-center justify-center"
                            >
                                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-emerald-700 mb-1">
                                    <Store className="w-4 h-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Stores
                                    </span>
                                </div>
                                <span className="text-lg font-black text-slate-900 group-hover:text-emerald-700">
                                    {shops.length}
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── Active Order Live Status Widget ─── */}
                {latestActiveOrder &&
                    ["pending", "accepted", "preparing", "ready"].includes(latestActiveOrder.status) && (
                    <section className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_70%)] pointer-events-none" />

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                                    </span>
                                    <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                                        {ACTIVE_STATUS_INFO[latestActiveOrder.status]?.badge || "Live Active Order"}
                                    </span>
                                    <span className="text-xs text-emerald-300 font-mono">
                                        #{latestActiveOrder.id.slice(0, 8).toUpperCase()}
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                                    {ACTIVE_STATUS_INFO[latestActiveOrder.status]?.title || "Store is Preparing Your Order"}
                                </h2>

                                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
                                    {ACTIVE_STATUS_INFO[latestActiveOrder.status]?.desc || "Your neighborhood store has accepted the order and delivery is scheduled within 15–30 minutes."}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-center">
                                <Link
                                    href={ROUTES.CUSTOMER_ORDERS}
                                    className="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-black text-xs sm:text-sm shadow-md hover:bg-emerald-50 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
                                >
                                    <Truck className="w-4 h-4 text-emerald-700" />
                                    <span>Track Live Delivery</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href={`https://wa.me/918923678493?text=${encodeURIComponent(
                                        `Hi MarketNera Support, I have a query regarding my order #${latestActiveOrder.id.slice(0, 8).toUpperCase()} (₹${Number(latestActiveOrder.total_amount).toFixed(2)}).`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-[#25D366]/20 active:scale-95 transition-all inline-flex items-center justify-center gap-1.5"
                                >
                                    <MessageCircle className="w-4 h-4 fill-slate-950 text-slate-950" />
                                    <span>Order Query (WA)</span>
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── Quick Category Pills ─── */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                            <span>Browse Categories</span>
                        </h2>
                        <Link
                            href={ROUTES.CATEGORIES}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                            <span>All Categories</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                        {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                                        isSelected
                                            ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-[1.02]"
                                            : "bg-white hover:bg-slate-100/80 text-slate-700 border border-slate-200/80"
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* ─── Verified Neighborhood Stores Row ─── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Store className="w-5 h-5 text-emerald-600" />
                                <span>Neighborhood Stores Near You</span>
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                Direct inventory from trusted kiranas and retail shops in your area
                            </p>
                        </div>

                        <Link
                            href={ROUTES.CUSTOMER_SHOPS}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
                        >
                            <span>Browse All ({shops.length})</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {loadingShops ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-36 rounded-3xl bg-white border border-slate-100 animate-pulse p-5"
                                />
                            ))}
                        </div>
                    ) : shops.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-3">
                            <Store className="w-10 h-10 text-slate-300 mx-auto" />
                            <h3 className="font-bold text-slate-800 text-sm">No shops listed in this radius</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                We are rapidly expanding our partner store network in Meerut.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {shops.slice(0, 4).map((shop) => (
                                <Link
                                    key={shop.user_id}
                                    href={`/shop/${shop.user_id}`}
                                    className="group bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-base flex items-center justify-center border border-emerald-100 shrink-0">
                                                {shop.shop_name?.charAt(0).toUpperCase() || "S"}
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Verified</span>
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
                                                {shop.shop_name}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-1 font-medium mt-0.5">
                                                {shop.address || "Local Neighborhood"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                                        <span className="flex items-center gap-1 text-emerald-700">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>15–30 mins</span>
                                        </span>
                                        <span className="text-slate-400 group-hover:text-slate-800 transition-colors flex items-center gap-0.5">
                                            <span>Visit Store</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* ─── Instant Essentials Catalog ─── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Package className="w-5 h-5 text-emerald-600" />
                                <span>
                                    {selectedCategory === "All"
                                        ? "Recommended Everyday Items"
                                        : `${selectedCategory} Products`}
                                </span>
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                Delivered doorstep in 15–30 minutes at guaranteed offline MRP
                            </p>
                        </div>

                        <span className="text-xs font-bold text-slate-400">
                            {products.length} products
                        </span>
                    </div>

                    {loadingProducts ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-2xl bg-white border border-slate-100 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-3">
                            <Search className="w-12 h-12 text-slate-300 mx-auto" />
                            <h3 className="font-bold text-slate-800 text-base">No items found</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                No products match your search or filter. Try choosing another category or clearing your search.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSearchQuery("");
                                }}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Bottom Navigation & Modern Footer */}
            <Footer />
            <CustomerBottomNav />
        </div>
    );
}
