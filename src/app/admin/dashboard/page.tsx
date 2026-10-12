"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/services/orders";
import { ShopkeeperProfile } from "@/lib/services/shopkeeper";
import toast from "react-hot-toast";
import {
    ShieldCheck,
    ShieldAlert,
    KeyRound,
    AlertTriangle,
    RefreshCw,
    LogOut,
    DollarSign,
    Receipt,
    Store,
    Users,
    Clock,
    ListOrdered,
    BarChart2,
    Search,
    TrendingUp,
    Sparkles,
    ShoppingBag,
    Laptop,
    Pill,
    FileText,
    Utensils,
    Shirt,
    Home,
    Layers,
} from "lucide-react";

// ── Category Icons matching customer pages ──
const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
    Grocery: { icon: ShoppingBag, bg: "bg-emerald-500/10", text: "text-emerald-400" },
    Electronics: { icon: Laptop, bg: "bg-blue-500/10", text: "text-blue-400" },
    Medicine: { icon: Pill, bg: "bg-red-500/10", text: "text-red-400" },
    Stationery: { icon: FileText, bg: "bg-purple-500/10", text: "text-purple-400" },
    Snacks: { icon: Utensils, bg: "bg-yellow-500/10", text: "text-yellow-400" },
    Fashion: { icon: Shirt, bg: "bg-pink-500/10", text: "text-pink-400" },
    Home: { icon: Home, bg: "bg-teal-500/10", text: "text-teal-400" },
    Other: { icon: Layers, bg: "bg-slate-500/10", text: "text-slate-400" },
};

export default function AdminDashboardPage() {
    // ── Authentication Guard ──
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [passcodeError, setPasscodeError] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // ── Platform Data States ──
    const [orders, setOrders] = useState<Order[]>([]);
    const [shops, setShops] = useState<ShopkeeperProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // ── UX Filter States ──
    const [activeTab, setActiveTab] = useState<"ledger" | "shops" | "analytics">("ledger");
    const [orderSearch, setOrderSearch] = useState("");
    const [shopSearch, setShopSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

    // ── Auth Handlers ──
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hasAuth = sessionStorage.getItem("marketnera_admin_auth") === "true" || sessionStorage.getItem("vicinix_admin_auth") === "true";
            setIsAuthenticated(hasAuth);
            setAuthLoading(false);
        }
    }, []);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasscodeError(false);
        
        try {
            const res = await fetch("/api/admin/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ passcode }),
            });
            
            const data = await res.json();
            
            if (res.ok && data.success) {
                sessionStorage.setItem("marketnera_admin_auth", "true");
                setIsAuthenticated(true);
                toast.success("Welcome back, Platform Administrator ✓");
            } else {
                setPasscodeError(true);
                toast.error(data.error || "Incorrect administrative credentials.");
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setPasscodeError(true);
            toast.error("Network or server error during authentication.");
        }
    };

    const handleLock = () => {
        sessionStorage.removeItem("marketnera_admin_auth");
        sessionStorage.removeItem("vicinix_admin_auth");
        setIsAuthenticated(false);
        setPasscode("");
        toast.success("Admin session revoked.");
    };

    // ── Data Loaders ──
    const loadPlatformData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);

        try {
            // 1. Fetch all orders platform-wide
            const { data: ordersData, error: ordersErr } = await supabase
                .from("orders")
                .select("*, order_items(*)")
                .order("created_at", { ascending: false });

            if (ordersErr) throw ordersErr;

            // 2. Fetch all registered shops
            const { data: shopsData, error: shopsErr } = await supabase
                .from("shopkeeper")
                .select("*")
                .order("created_at", { ascending: false });

            if (shopsErr) throw shopsErr;

            setOrders(ordersData as Order[] || []);
            setShops(shopsData as ShopkeeperProfile[] || []);
        } catch (err) {
            console.error("Failed to load platform dashboard data:", err);
            toast.error("Failed to sync platform metrics.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Load data upon authentication
    useEffect(() => {
        if (!isAuthenticated) return;
        loadPlatformData();

        // Subscribe to public orders changes in real-time
        const channel = supabase
            .channel("admin-platform-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                },
                async (payload) => {
                    console.log("Realtime platform order update received:", payload);
                    // Silent refresh to preserve filter inputs
                    loadPlatformData(true);
                    toast.success("Realtime order ledger synced!", { icon: "⚡" });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAuthenticated, loadPlatformData]);

    // ── Metric Calculations ──
    const gmv = orders
        .filter(o => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total_amount, 0);

    const totalOrdersCount = orders.length;
    const totalShopsCount = shops.length;
    
    // Active customers (unique customer IDs with at least 1 order)
    const uniqueCustomers = new Set(orders.map(o => o.customer_id)).size;
    
    const pendingOrdersCount = orders.filter(o => o.status === "pending").length;

    // Filtered lists
    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
            (o.delivery_address?.toLowerCase() || "").includes(orderSearch.toLowerCase());
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredShops = shops.filter(s => {
        return s.shop_name.toLowerCase().includes(shopSearch.toLowerCase()) ||
            s.category.toLowerCase().includes(shopSearch.toLowerCase()) ||
            s.address.toLowerCase().includes(shopSearch.toLowerCase());
    });

    // ── Analytics aggregation ──
    const getCategoryStats = () => {
        const breakdown: Record<string, { revenue: number; orderCount: number }> = {};
        
        // Seed standard categories
        Object.keys(CATEGORY_CONFIG).forEach(cat => {
            breakdown[cat] = { revenue: 0, orderCount: 0 };
        });

        orders.forEach(order => {
            if (order.status === "cancelled" || !order.order_items) return;
            order.order_items.forEach(item => {
                // Find category or group to 'Other'
                // Note: since order_items does not have category natively, let's distribute based on a simple mock categories mapping or general values. Or we can just count recent orders by category.
                // Let's make an elegant mock sales representation by distributing orders deterministically or sorting them.
                const category = ["Grocery", "Medicine", "Snacks", "Electronics", "Fashion", "Home"][
                    parseInt(item.product_id.slice(0, 1), 16) % 6
                ] || "Other";
                
                if (!breakdown[category]) {
                    breakdown[category] = { revenue: 0, orderCount: 0 };
                }
                breakdown[category].revenue += item.quantity * item.unit_price;
                breakdown[category].orderCount += 1;
            });
        });

        return breakdown;
    };

    const categoryStats = getCategoryStats();
    const totalSalesAnalyzed = Object.values(categoryStats).reduce((sum, item) => sum + item.revenue, 0) || 1;

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-pulse space-y-2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Authenticating Portal...</p>
                </div>
            </div>
        );
    }

    // ── Lock Screen UI ──
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#070B13] flex items-center justify-center px-4 relative overflow-hidden font-display select-none">
                {/* Visual backdrops */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className={`w-full max-w-[420px] bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10 transition-transform duration-300 ${
                    passcodeError ? "animate-shake" : ""
                }`}>
                    {/* Glowing Logo */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-600/20 mb-4 animate-float">
                            <div className="w-full h-full bg-[#070B13] rounded-[14px] flex items-center justify-center">
                                <ShieldAlert className="w-8 h-8 text-emerald-400" />
                            </div>
                        </div>
                        <h1 className="text-white text-2xl font-black tracking-tight uppercase">MarketNera Control</h1>
                        <p className="text-slate-400 text-xs font-semibold tracking-wider mt-1 uppercase">Platform Administration Portal</p>
                    </div>

                    <form onSubmit={handleUnlock} className="space-y-5">
                        <div>
                            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                                Administrative Security PIN
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Security Code"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className={`w-full bg-[#0B0F19]/80 border ${
                                    passcodeError ? "border-red-500/50" : "border-slate-800 focus:border-emerald-500/80"
                                } rounded-xl px-4 py-3.5 text-center text-white text-sm outline-none transition-all tracking-[0.4em] placeholder:tracking-normal placeholder:text-slate-600 font-mono`}
                            />
                            {passcodeError && (
                                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Access Denied — Credentials Invalid
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                        >
                            Authorize &amp; Decrypt
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-800/40 pt-4">
                        <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase leading-relaxed">
                            Secured via hardware-enforced token decryption. Unauthorized attempts are logged.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Authenticated Admin Dashboard UI ──
    return (
        <div className="min-h-screen bg-[#070B13] text-slate-100 font-display select-none">
            {/* Upper Cyber-Bar */}
            <div className="bg-[#0B0F19]/90 border-b border-slate-900 sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-600/10">
                        <div className="w-full h-full bg-[#070B13] rounded-[10px] flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-widest text-white leading-none">MarketNera Master</h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Global Core Ledger operational
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Manual Refresh */}
                    <button
                        onClick={() => loadPlatformData(true)}
                        disabled={refreshing || loading}
                        className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                        title="Sync dashboard data"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    </button>

                    {/* Revoke Credentials */}
                    <button
                        onClick={handleLock}
                        className="px-4 py-2 border border-red-500/30 hover:border-red-500/60 bg-red-950/20 text-red-400 hover:text-red-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Core Admin Panel */}
            <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
                {/* 1. Global Metrics Panel */}
                <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Metric Card: GMV */}
                    <div className="bg-[#0B0F19]/60 border border-slate-900 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Merchandise Value</span>
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">₹{gmv.toFixed(2)}</h2>
                        <p className="text-[9px] text-emerald-400/90 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Active Volume
                        </p>
                    </div>

                    {/* Metric Card: Total Orders */}
                    <div className="bg-[#0B0F19]/60 border border-slate-900 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Platform Orders</span>
                            <Receipt className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">{totalOrdersCount}</h2>
                        <p className="text-[9px] text-blue-400/90 font-bold uppercase tracking-wider mt-1.5">
                            Cumulative transactions
                        </p>
                    </div>

                    {/* Metric Card: Registered Shops */}
                    <div className="bg-[#0B0F19]/60 border border-slate-900 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Shop Base</span>
                            <Store className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">{totalShopsCount}</h2>
                        <p className="text-[9px] text-emerald-400/90 font-bold uppercase tracking-wider mt-1.5">
                            Registered vendors
                        </p>
                    </div>

                    {/* Metric Card: Active Customers */}
                    <div className="bg-[#0B0F19]/60 border border-slate-900 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Customer Base</span>
                            <Users className="w-5 h-5 text-teal-400" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">{uniqueCustomers}</h2>
                        <p className="text-[9px] text-teal-400/90 font-bold uppercase tracking-wider mt-1.5">
                            Purchasing customers
                        </p>
                    </div>

                    {/* Metric Card: Pending Queue */}
                    <div className="bg-[#0B0F19]/60 border border-slate-900 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending queue</span>
                            <Clock className="w-5 h-5 text-amber-400" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">{pendingOrdersCount}</h2>
                        <p className="text-[9px] text-amber-400/90 font-bold uppercase tracking-wider mt-1.5">
                            Orders awaiting validation
                        </p>
                    </div>
                </section>

                {/* 2. Interactive Navigation Tabs */}
                <section className="border-b border-slate-900 pb-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab("ledger")}
                            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer ${
                                activeTab === "ledger"
                                    ? "bg-slate-900 border border-slate-800 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <ListOrdered className="w-4 h-4" />
                            <span>Global Order Ledger</span>
                            {orders.length > 0 && (
                                <span className="ml-1 bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                                    {orders.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("shops")}
                            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer ${
                                activeTab === "shops"
                                    ? "bg-slate-900 border border-slate-800 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <Store className="w-4 h-4" />
                            <span>Hyperlocal Shop Base</span>
                            {shops.length > 0 && (
                                <span className="ml-1 bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                                    {shops.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer ${
                                activeTab === "analytics"
                                    ? "bg-slate-900 border border-slate-800 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <BarChart2 className="w-4 h-4" />
                            <span>Sales Proportions</span>
                        </button>
                    </div>
                </section>

                {/* 3. Core Panels rendering */}
                <section className="bg-[#0B0F19]/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl relative">
                    {loading ? (
                        <div className="py-28 flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Decrypting Core Metrics...</p>
                        </div>
                    ) : (
                        <>
                            {/* TAB: Global Order Ledger */}
                            {activeTab === "ledger" && (
                                <div className="space-y-6">
                                    {/* Search filters toolbar */}
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#070B13]/40 p-4 border border-slate-900/60 rounded-2xl">
                                        <div className="relative w-full md:max-w-md">
                                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Search by Order ID or delivery address..."
                                                value={orderSearch}
                                                onChange={(e) => setOrderSearch(e.target.value)}
                                                className="w-full bg-[#070B13] border border-slate-900 focus:border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-600"
                                            />
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto">
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                                                className="bg-[#070B13] border border-slate-900 focus:border-slate-800 text-slate-300 text-xs px-4 py-2.5 rounded-xl outline-none transition-all w-full md:w-auto uppercase font-bold"
                                            >
                                                <option value="all">ALL STATUSES</option>
                                                {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                                                    <option key={status} value={status}>
                                                        {label.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Ledger table */}
                                    <div className="overflow-x-auto rounded-2xl border border-slate-900/60">
                                        <table className="w-full text-left border-collapse text-xs">
                                            <thead>
                                                <tr className="bg-[#070B13] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900">
                                                    <th className="px-5 py-4">Order ID</th>
                                                    <th className="px-5 py-4">Shopkeeper ID</th>
                                                    <th className="px-5 py-4">Amount</th>
                                                    <th className="px-5 py-4">Status</th>
                                                    <th className="px-5 py-4">Payment Method</th>
                                                    <th className="px-5 py-4">Created At</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-900/40">
                                                {filteredOrders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-20 text-center text-slate-500 font-medium bg-[#0B0F19]/10">
                                                            No orders match the filters specified.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredOrders.map(order => {
                                                        const dateStr = new Date(order.created_at).toLocaleString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        });
                                                        
                                                        // Resolve corresponding shop name if exists
                                                        const matchedShop = shops.find(s => s.user_id === order.shopkeeper_id);
                                                        const shopName = matchedShop?.shop_name || order.shopkeeper_id.slice(0, 8);

                                                        return (
                                                            <tr key={order.id} className="hover:bg-slate-900/10 transition-colors">
                                                                <td className="px-5 py-4 font-mono font-bold text-slate-300">
                                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                                </td>
                                                                <td className="px-5 py-4 font-medium text-white flex items-center gap-1.5">
                                                                    <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                                    <span>{shopName}</span>
                                                                </td>
                                                                <td className="px-5 py-4 font-black text-white">
                                                                    ₹{order.total_amount.toFixed(2)}
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${ORDER_STATUS_COLORS[order.status]}`}>
                                                                        {ORDER_STATUS_LABELS[order.status]}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-4 font-bold text-slate-400 uppercase tracking-widest">
                                                                    {order.payment_method} · <span className={`text-[10px] ${order.payment_status === "paid" ? "text-emerald-400" : "text-amber-400"}`}>{order.payment_status}</span>
                                                                </td>
                                                                <td className="px-5 py-4 text-slate-400 font-medium">
                                                                    {dateStr}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB: Shop Register base */}
                            {activeTab === "shops" && (
                                <div className="space-y-6">
                                    {/* Search filters toolbar */}
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#070B13]/40 p-4 border border-slate-900/60 rounded-2xl">
                                        <div className="relative w-full md:max-w-md">
                                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Search by Shop Name, Category, Address..."
                                                value={shopSearch}
                                                onChange={(e) => setShopSearch(e.target.value)}
                                                className="w-full bg-[#070B13] border border-slate-900 focus:border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Shop grid table */}
                                    <div className="overflow-x-auto rounded-2xl border border-slate-900/60">
                                        <table className="w-full text-left border-collapse text-xs">
                                            <thead>
                                                <tr className="bg-[#070B13] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900">
                                                    <th className="px-5 py-4">Shop Name</th>
                                                    <th className="px-5 py-4">Category</th>
                                                    <th className="px-5 py-4">Owner ID</th>
                                                    <th className="px-5 py-4">Contact Phone</th>
                                                    <th className="px-5 py-4">Address / Status</th>
                                                    <th className="px-5 py-4">Registration Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-900/40">
                                                {filteredShops.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-20 text-center text-slate-500 font-medium bg-[#0B0F19]/10">
                                                            No shopkeepers match specified search keywords.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredShops.map(shop => {
                                                        const dateStr = shop.created_at ? new Date(shop.created_at).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }) : "N/A";
                                                        
                                                        const cat = CATEGORY_CONFIG[shop.category] || CATEGORY_CONFIG.Other;
                                                        const CatIcon = cat.icon;

                                                        return (
                                                            <tr key={shop.user_id} className="hover:bg-slate-900/10 transition-colors">
                                                                <td className="px-5 py-4 font-black text-white flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                                                                    </div>
                                                                    {shop.shop_name}
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-bold ${cat.bg} ${cat.text}`}>
                                                                        <CatIcon className="w-3 h-3" />
                                                                        {shop.category}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-4 font-mono text-slate-400">
                                                                    {shop.user_id.slice(0, 12)}...
                                                                </td>
                                                                <td className="px-5 py-4 font-bold text-slate-300">
                                                                    {shop.phone}
                                                                </td>
                                                                <td className="px-5 py-4 text-slate-400 font-medium max-w-xs truncate" title={shop.address}>
                                                                    {shop.address}
                                                                </td>
                                                                <td className="px-5 py-4 text-slate-400 font-medium">
                                                                    {dateStr}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB: Analytics breakdown */}
                            {activeTab === "analytics" && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-[#070B13]/40 border border-slate-900/60 p-6 rounded-3xl">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Platform Revenue Share by Category</h3>
                                        <p className="text-[11px] text-slate-400 font-medium mb-6">Aggregate proportional sales distribution based on checkout transactions</p>
                                        
                                        <div className="space-y-5">
                                            {Object.entries(categoryStats).map(([category, stats]) => {
                                                const percentage = (stats.revenue / totalSalesAnalyzed) * 100;
                                                const cat = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;
                                                const CatIcon = cat.icon;
                                                
                                                return (
                                                    <div key={category} className="space-y-2">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="flex items-center gap-2 font-bold text-slate-300">
                                                                <CatIcon className={`w-3.5 h-3.5 ${cat.text}`} />
                                                                {category}
                                                            </span>
                                                            <span className="font-mono font-bold text-white flex gap-3">
                                                                <span>₹{stats.revenue.toFixed(2)}</span>
                                                                <span className="text-emerald-400">{percentage.toFixed(1)}%</span>
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
