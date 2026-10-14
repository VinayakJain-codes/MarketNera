"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
    getShopkeeperOrders,
    updateOrderStatus,
    Order,
    OrderStatus,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS,
    ORDER_STATUS_FLOW,
} from "@/lib/services/orders";
import { playLoudBellSound } from "@/lib/audio-bell";
import ShopkeeperTopbar from "@/components/layout/ShopkeeperTopbar";
import { User } from "@supabase/supabase-js";
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    RefreshCw,
    Inbox,
    CheckCircle,
    XCircle,
    Bell,
    Banknote,
    CreditCard,
} from "lucide-react";

const STATUS_TABS: { label: string; status: OrderStatus | "all" }[] = [
    { label: "All", status: "all" },
    { label: "New (Pending)", status: "pending" },
    { label: "Accepted", status: "accepted" },
    { label: "Preparing", status: "preparing" },
    { label: "Ready", status: "ready" },
    { label: "Delivered", status: "delivered" },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    pending: "accepted",
    accepted: "preparing",
    preparing: "ready",
    ready: "delivered",
};

const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
    pending: "Accept Order",
    accepted: "Start Preparing",
    preparing: "Mark Ready",
    ready: "Mark Delivered",
};

// ── Order Card ──
function OrderQueueCard({
    order,
    onAdvance,
}: {
    order: Order;
    onAdvance: (orderId: string, next: OrderStatus) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const nextStatus = NEXT_STATUS[order.status];
    const date = new Date(order.created_at).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
    const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

    const handleDecline = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to decline / reject this order?")) {
            onAdvance(order.id, "cancelled");
        }
    };

    const handleAccept = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAdvance(order.id, "accepted");
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-xs border overflow-hidden transition-all hover:shadow-md ${
                order.status === "pending"
                    ? "border-emerald-400 ring-2 ring-emerald-500/20"
                    : "border-slate-200/80"
            }`}
        >
            {/* New order highlight badge */}
            {order.status === "pending" && (
                <div className="bg-emerald-600 text-white text-[10px] font-black tracking-wider px-3.5 py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>NEW ORDER — REQUIRES MANUAL ACCEPTANCE</span>
                    </div>
                    <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[9px] uppercase font-bold">
                        Pending
                    </span>
                </div>
            )}

            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full p-4 text-left"
            >
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            {order.payment_method === "cod" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                                    <Banknote className="w-3 h-3 text-amber-500" />
                                    Cash on Delivery
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                                    <CreditCard className="w-3 h-3 text-emerald-500" />
                                    Paid Online
                                </span>
                            )}
                        </div>

                        <p className="text-base font-bold text-slate-800">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} · ₹{order.total_amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ORDER_STATUS_COLORS[order.status]
                            }`}
                        >
                            {ORDER_STATUS_LABELS[order.status]}
                        </span>
                        <span className="text-slate-400">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                    </div>
                </div>

                {/* Quick actions for Pending order right on card */}
                {order.status === "pending" && !expanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Accept Order
                        </button>
                        <button
                            type="button"
                            onClick={handleDecline}
                            className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Decline
                        </button>
                    </div>
                )}
            </button>

            {/* Expanded Content */}
            {expanded && (
                <div className="border-t border-slate-100 px-4 pb-4">
                    <div className="py-3 space-y-2">
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-slate-600">
                                    {item.product_name}{" "}
                                    <span className="text-slate-400 font-medium">×{item.quantity}</span>
                                </span>
                                <span className="font-semibold text-slate-800">
                                    ₹{item.subtotal.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {order.delivery_address && (
                        <div className="flex gap-2 mt-1 p-2.5 bg-slate-50 rounded-xl mb-3 border border-slate-100">
                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {order.delivery_address}
                            </p>
                        </div>
                    )}

                    {/* Pending Action Buttons: Explicit Accept vs Decline */}
                    {order.status === "pending" ? (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                                type="button"
                                onClick={handleAccept}
                                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Accept Order
                            </button>
                            <button
                                type="button"
                                onClick={handleDecline}
                                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-sm font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <XCircle className="w-4 h-4" />
                                Decline Order
                            </button>
                        </div>
                    ) : nextStatus && order.status !== "cancelled" ? (
                        <button
                            type="button"
                            onClick={() => onAdvance(order.id, nextStatus)}
                            className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            {ACTION_LABELS[order.status]}
                        </button>
                    ) : null}

                    {order.status === "delivered" && (
                        <p className="text-center text-xs text-emerald-600 font-bold py-2 bg-emerald-50 rounded-xl border border-emerald-100 mt-2">
                            ✓ Order delivered successfully
                        </p>
                    )}

                    {order.status === "cancelled" && (
                        <p className="text-center text-xs text-rose-500 font-bold py-2 bg-rose-50 rounded-xl border border-rose-100 mt-2">
                            ✕ Order was declined / cancelled
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Page ──
export default function ShopkeeperOrdersPage() {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<OrderStatus | "all">("pending");
    const [bellPlaying, setBellPlaying] = useState(false);

    // Auth session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
    }, []);

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const data = await getShopkeeperOrders(user.id);
        setOrders(data);
        setLoading(false);
    }, [user]);

    // Supabase Realtime channel + Window custom event listener
    useEffect(() => {
        if (!user) return;
        fetchOrders();

        // Listen for layout global alert events
        const onNewOrder = () => fetchOrders();
        const onStatusUpdate = () => fetchOrders();

        window.addEventListener("new-order-received", onNewOrder);
        window.addEventListener("order-status-updated", onStatusUpdate);

        const channel = supabase
            .channel(`shopkeeper-orders-page-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                    filter: `shopkeeper_id=eq.${user.id}`,
                },
                async () => {
                    const data = await getShopkeeperOrders(user.id);
                    setOrders(data);
                }
            )
            .subscribe();

        return () => {
            window.removeEventListener("new-order-received", onNewOrder);
            window.removeEventListener("order-status-updated", onStatusUpdate);
            supabase.removeChannel(channel);
        };
    }, [user, fetchOrders]);

    const handleAdvance = async (orderId: string, next: OrderStatus) => {
        const { success } = await updateOrderStatus(orderId, next);
        if (success) {
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
            );
        }
    };

    const filteredOrders =
        activeTab === "all"
            ? orders
            : orders.filter((o) => o.status === activeTab);

    const pendingCount = orders.filter((o) => o.status === "pending").length;

    return (
        <>
            <ShopkeeperTopbar
                title="Order Queue"
                description="Accept incoming orders, track preparation, and fulfill deliveries."
            />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Management</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {loading ? "Checking orders..." : `${orders.length} total orders registered`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Loud Bell Sound Test Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setBellPlaying(true);
                                playLoudBellSound();
                                setTimeout(() => setBellPlaying(false), 2200);
                            }}
                            title="Test loud service bell sound"
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                                bellPlaying
                                    ? "bg-emerald-600 text-white border-emerald-600 animate-pulse shadow-md shadow-emerald-600/30"
                                    : "bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 border-slate-200"
                            }`}
                        >
                            <Bell className={`w-3.5 h-3.5 ${bellPlaying ? "animate-bounce text-white" : "text-emerald-600"}`} />
                            <span>{bellPlaying ? "Ringing Bell 🔔..." : "Test Bell 🔊"}</span>
                        </button>

                        {/* Manual Refresh */}
                        <button
                            type="button"
                            onClick={fetchOrders}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors shadow-xs cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Status tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
                    {STATUS_TABS.map(({ label, status }) => {
                        const count =
                            status === "all"
                                ? orders.length
                                : orders.filter((o) => o.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    activeTab === status
                                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                                        : "bg-white text-slate-600 border border-slate-200/80 hover:border-emerald-500 hover:text-emerald-700"
                                }`}
                            >
                                {label}
                                {count > 0 && (
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                                            activeTab === status
                                                ? "bg-white/20 text-white"
                                                : status === "pending"
                                                ? "bg-emerald-100 text-emerald-800 animate-pulse"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Urgent Pending banner */}
                {pendingCount > 0 && activeTab !== "pending" && (
                    <button
                        onClick={() => setActiveTab("pending")}
                        className="w-full mb-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/40 text-emerald-900 text-xs font-black flex items-center justify-between hover:bg-emerald-500/25 transition-all cursor-pointer shadow-xs"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                            </span>
                            <span>{pendingCount} new incoming order{pendingCount !== 1 ? "s" : ""} waiting for your acceptance</span>
                        </div>
                        <span className="text-[11px] uppercase tracking-wider text-emerald-700 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-300 font-extrabold">
                            Review Now &rarr;
                        </span>
                    </button>
                )}

                {/* Orders grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/70 space-y-3 animate-pulse">
                                <div className="h-3 bg-slate-200 rounded w-1/3" />
                                <div className="h-4 bg-slate-200 rounded w-2/3" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-200/80 p-8">
                        <Inbox className="w-12 h-12 text-slate-300 mb-4 stroke-[1.2]" />
                        <p className="text-base font-bold text-slate-700">No orders here</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                            {activeTab === "pending"
                                ? "New orders will trigger a loud bell notification and appear here for your manual acceptance."
                                : `No orders currently in "${activeTab}" status.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredOrders.map((order) => (
                            <OrderQueueCard
                                key={order.id}
                                order={order}
                                onAdvance={handleAdvance}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
