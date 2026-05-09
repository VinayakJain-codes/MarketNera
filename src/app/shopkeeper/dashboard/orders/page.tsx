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
import ShopkeeperTopbar from "@/components/layout/ShopkeeperTopbar";
import { User } from "@supabase/supabase-js";

const STATUS_TABS: { label: string; status: OrderStatus | "all" }[] = [
    { label: "All", status: "all" },
    { label: "New", status: "pending" },
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

    return (
        <div
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-shadow hover:shadow-md ${
                order.status === "pending" ? "border-orange-200" : "border-slate-100"
            }`}
        >
            {/* New order highlight */}
            {order.status === "pending" && (
                <div className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">new_releases</span>
                    NEW ORDER
                </div>
            )}

            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full p-4 text-left"
            >
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">
                            #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
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
                        <span className="material-symbols-outlined text-slate-300 text-lg">
                            {expanded ? "expand_less" : "expand_more"}
                        </span>
                    </div>
                </div>
            </button>

            {/* Expanded */}
            {expanded && (
                <div className="border-t border-slate-100 px-4 pb-4">
                    <div className="py-3 space-y-2">
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-slate-600">
                                    {item.product_name}{" "}
                                    <span className="text-slate-400">×{item.quantity}</span>
                                </span>
                                <span className="font-medium text-slate-800">
                                    ₹{item.subtotal.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    {order.delivery_address && (
                        <div className="flex gap-2 mt-1 p-2 bg-slate-50 rounded-lg mb-3">
                            <span className="material-symbols-outlined text-slate-400 text-sm mt-0.5">location_on</span>
                            <p className="text-xs text-slate-500">{order.delivery_address}</p>
                        </div>
                    )}

                    {/* Advance status */}
                    {nextStatus && order.status !== "cancelled" && (
                        <button
                            onClick={() => onAdvance(order.id, nextStatus)}
                            className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            {ACTION_LABELS[order.status]}
                        </button>
                    )}
                    {order.status === "delivered" && (
                        <p className="text-center text-xs text-green-600 font-semibold py-2">
                            ✓ Order delivered
                        </p>
                    )}
                    {order.status === "cancelled" && (
                        <p className="text-center text-xs text-red-500 font-semibold py-2">
                            Order was cancelled
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

    // Auth
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

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

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
            <ShopkeeperTopbar />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Order Queue</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {loading ? "Loading..." : `${orders.length} total orders`}
                        </p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Refresh
                    </button>
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
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    activeTab === status
                                        ? "bg-primary text-white shadow-md"
                                        : "bg-white text-slate-500 border border-slate-200 hover:border-primary hover:text-primary"
                                }`}
                            >
                                {label}
                                {count > 0 && (
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            activeTab === status
                                                ? "bg-white/30 text-white"
                                                : status === "pending"
                                                ? "bg-orange-100 text-orange-600"
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

                {/* New order alert */}
                {pendingCount > 0 && activeTab !== "pending" && (
                    <button
                        onClick={() => setActiveTab("pending")}
                        className="w-full mb-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">notifications_active</span>
                        {pendingCount} new order{pendingCount !== 1 ? "s" : ""} waiting — tap to view
                    </button>
                )}

                {/* Orders grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 space-y-3 animate-pulse">
                                <div className="h-3 bg-slate-200 rounded w-1/3" />
                                <div className="h-4 bg-slate-200 rounded w-2/3" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">inbox</span>
                        <p className="text-base font-semibold text-slate-500">No orders here</p>
                        <p className="text-xs text-slate-400 mt-1">
                            {activeTab === "pending"
                                ? "New orders will appear here"
                                : `No ${activeTab} orders`}
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
