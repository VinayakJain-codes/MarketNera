"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    getCustomerOrders,
    cancelOrder,
    Order,
    OrderStatus,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS,
    ORDER_STATUS_FLOW,
} from "@/lib/services/orders";
import { ROUTES } from "@/constants/routes";
import { User } from "@supabase/supabase-js";

// ── Skeleton ──
const OrderSkeleton = () => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3 animate-pulse">
        <div className="flex justify-between">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-5 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="border-t border-slate-100 pt-3 flex justify-between">
            <div className="h-3 bg-slate-200 rounded w-1/4" />
            <div className="h-3 bg-slate-200 rounded w-1/5" />
        </div>
    </div>
);

// ── Status Progress Bar ──
function StatusProgress({ status }: { status: OrderStatus }) {
    if (status === "cancelled") {
        return (
            <div className="flex items-center gap-2 mt-3">
                <span className="material-symbols-outlined text-red-400 text-sm">cancel</span>
                <span className="text-xs text-red-500 font-medium">Order cancelled</span>
            </div>
        );
    }
    const currentIdx = ORDER_STATUS_FLOW.indexOf(status);
    return (
        <div className="mt-3">
            <div className="flex items-center gap-1">
                {ORDER_STATUS_FLOW.map((s, i) => (
                    <div key={s} className="flex items-center gap-1 flex-1">
                        <div
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                i <= currentIdx ? "bg-primary" : "bg-slate-200"
                            }`}
                        />
                        {i < ORDER_STATUS_FLOW.length - 1 && null}
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-primary font-semibold mt-1">
                {ORDER_STATUS_LABELS[status]}
            </p>
        </div>
    );
}

// ── Order Card ──
function OrderCard({
    order,
    onCancel,
}: {
    order: Order;
    onCancel: (orderId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    const date = new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full p-4 text-left"
            >
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} · ₹{order.total_amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
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

                {/* Progress bar */}
                <StatusProgress status={order.status} />
            </button>

            {/* Expanded items */}
            {expanded && (
                <div className="border-t border-slate-100 px-4 pb-4">
                    <div className="py-3 space-y-2">
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-slate-600">
                                    {item.product_name}{" "}
                                    <span className="text-slate-400">×{item.quantity}</span>
                                </span>
                                <span className="font-semibold text-slate-800">
                                    ₹{item.subtotal.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    {order.delivery_address && (
                        <div className="flex gap-2 mt-2 p-2 bg-slate-50 rounded-lg">
                            <span className="material-symbols-outlined text-slate-400 text-sm mt-0.5">location_on</span>
                            <p className="text-xs text-slate-500">{order.delivery_address}</p>
                        </div>
                    )}
                    {/* Cancel action (only for pending) */}
                    {order.status === "pending" && (
                        <button
                            onClick={() => onCancel(order.id)}
                            className="mt-3 w-full py-2 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Page ──
export default function CustomerOrdersPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"active" | "past">("active");

    // Auth
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) {
                router.push(ROUTES.LOGIN_CUSTOMER);
                return;
            }
            setUser(session.user);
        });
    }, [router]);

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const data = await getCustomerOrders(user.id);
        setOrders(data);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancel = async (orderId: string) => {
        if (!user) return;
        const { success } = await cancelOrder(orderId, user.id);
        if (success) {
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" as OrderStatus } : o))
            );
        }
    };

    // Filter
    const ACTIVE_STATUSES: OrderStatus[] = ["pending", "accepted", "preparing", "ready"];
    const filteredOrders = orders.filter((o) =>
        filter === "active"
            ? ACTIVE_STATUSES.includes(o.status)
            : !ACTIVE_STATUSES.includes(o.status)
    );

    const activeCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

    return (
        <div className="w-full max-w-[480px] md:max-w-3xl mx-auto bg-gray-50 min-h-screen shadow-xl relative pb-8">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    aria-label="Go back"
                >
                    <span className="material-symbols-outlined text-slate-600 text-xl">arrow_back</span>
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-900">My Orders</h1>
                    <p className="text-xs text-slate-400">
                        {loading ? "Loading..." : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
            </header>

            {/* Filter tabs */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
                    <button
                        onClick={() => setFilter("active")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            filter === "active"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500"
                        }`}
                    >
                        Active
                        {activeCount > 0 && (
                            <span className="ml-1.5 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {activeCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setFilter("past")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            filter === "past"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500"
                        }`}
                    >
                        Past Orders
                    </button>
                </div>
            </div>

            {/* Orders list */}
            <section className="px-4 py-2 space-y-3">
                {loading ? (
                    [1, 2, 3].map((i) => <OrderSkeleton key={i} />)
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined text-4xl text-orange-300">receipt_long</span>
                        </div>
                        <h2 className="text-base font-bold text-slate-700 mb-1">
                            {filter === "active" ? "No active orders" : "No past orders"}
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">
                            {filter === "active"
                                ? "Your active orders will appear here"
                                : "Completed and cancelled orders will appear here"}
                        </p>
                        <button
                            onClick={() => router.push(ROUTES.CUSTOMER_DASHBOARD)}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    filteredOrders.map((order, i) => (
                        <div
                            key={order.id}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <OrderCard order={order} onCancel={handleCancel} />
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}
