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
import { addProductReview } from "@/lib/services/reviews";
import { reorderPastOrder } from "@/lib/services/cart";
import toast from "react-hot-toast";

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
        <div className="mt-4 pb-2">
            <div className="flex items-center justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-[5px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0">
                    <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${(currentIdx / (ORDER_STATUS_FLOW.length - 1)) * 100}%` }}
                    />
                </div>
                {/* Nodes */}
                {ORDER_STATUS_FLOW.map((s, i) => {
                    const isCompleted = i <= currentIdx;
                    return (
                        <div key={s} className="flex flex-col items-center relative z-10 w-1/4">
                            <div className={`w-3 h-3 rounded-full mb-1 flex-shrink-0 transition-colors shadow-sm ring-2 ring-white ${
                                isCompleted ? "bg-primary" : "bg-slate-200"
                            }`} />
                            <span className={`text-[9px] font-bold tracking-tight text-center ${
                                isCompleted ? "text-primary" : "text-slate-400"
                            }`}>
                                {ORDER_STATUS_LABELS[s]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Product Review Form ──
function ProductReviewForm({ productId, userId }: { productId: string; userId: string }) {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const { success } = await addProductReview(productId, userId, rating, text);
        if (success) {
            setSubmitted(true);
            toast.success("Review submitted! Thank you ✓");
        } else {
            toast.error("You have already reviewed this product.");
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <p className="text-[11px] text-green-600 font-bold flex items-center gap-1 mt-1 animate-fade-in">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Review submitted
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2 p-3 bg-slate-50 border border-slate-100/50 rounded-xl space-y-2 animate-fade-in-up">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Rate this product</p>
            <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-400 focus:outline-none hover:scale-110 transition-transform"
                    >
                        <span className={`material-symbols-outlined text-[18px] ${
                            star <= rating ? "fill-1" : ""
                        }`}>
                            star
                        </span>
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Write a quick comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none bg-white focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-40"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}

// ── Order Card ──
function OrderCard({
    order,
    onCancel,
    onReorder,
    reorderingId,
}: {
    order: Order;
    onCancel: (orderId: string) => void;
    onReorder: (order: Order) => void;
    reorderingId: string | null;
}) {
    const [expanded, setExpanded] = useState(false);
    const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    const date = new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const isPastOrder = order.status === "delivered" || order.status === "cancelled";

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden animate-fade-in-up premium-hover">
            {/* Header */}
            <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full p-5 text-left focus:outline-none"
            >
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                            Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm font-black text-slate-900 tracking-tight">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} · ₹{order.total_amount.toFixed(2)}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-1">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                ORDER_STATUS_COLORS[order.status]
                            }`}
                        >
                            {ORDER_STATUS_LABELS[order.status]}
                        </span>
                        <span className="material-symbols-outlined text-slate-300 text-xl transition-transform duration-300" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                            expand_more
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <StatusProgress status={order.status} />
            </button>

            {/* Expanded items */}
            {expanded && (
                <div className="border-t border-slate-100/80 px-5 pb-5">
                    <div className="py-4 space-y-4">
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">
                                        <span className="text-slate-800 font-bold">{item.quantity}×</span> {item.product_name}
                                    </span>
                                    <span className="font-black text-slate-900">
                                        ₹{item.subtotal.toFixed(2)}
                                    </span>
                                </div>
                                {order.status === "delivered" && (
                                    <ProductReviewForm productId={item.product_id} userId={order.customer_id} />
                                )}
                            </div>
                        ))}
                    </div>
                    {order.delivery_address && (
                        <div className="flex items-start gap-2 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">location_on</span>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{order.delivery_address}</p>
                        </div>
                    )}
                    {/* Cancel action (only for pending) */}
                    {order.status === "pending" && (
                        <button
                            onClick={() => onCancel(order.id)}
                            className="mt-4 w-full py-3 rounded-xl border-2 border-red-100 text-red-500 text-xs font-black uppercase tracking-wider hover:bg-red-50 transition-colors premium-active"
                        >
                            Cancel Order
                        </button>
                    )}
                    {/* Reorder Action (for past orders) */}
                    {isPastOrder && (
                        <button
                            onClick={() => onReorder(order)}
                            disabled={reorderingId !== null}
                            className="mt-4 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 premium-active disabled:opacity-50"
                        >
                            {reorderingId === order.id ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Reordering...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">replay</span>
                                    Reorder past purchase
                                </>
                            )}
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
    const [reorderingId, setReorderingId] = useState<string | null>(null);

    const handleReorder = async (order: Order) => {
        if (!user || !order.order_items || order.order_items.length === 0) return;
        setReorderingId(order.id);
        const reorderItems = order.order_items.map(item => ({
            product_id: item.product_id,
            shop_id: order.shopkeeper_id,
            quantity: item.quantity,
        }));
        
        const loadId = toast.loading("Adding past items to cart...");
        const { success, error } = await reorderPastOrder(user.id, reorderItems);
        
        if (success) {
            toast.success("Items added! Redirecting to checkout...", { id: loadId });
            router.push(ROUTES.CUSTOMER_CART);
        } else {
            toast.error(error || "Failed to reorder items.", { id: loadId });
            setReorderingId(null);
        }
    };

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
        if (!user) return;
        fetchOrders();

        const channel = supabase
            .channel(`customer-orders-${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                    filter: `customer_id=eq.${user.id}`,
                },
                async (payload) => {
                    console.log("Realtime customer order update received:", payload);
                    const data = await getCustomerOrders(user.id);
                    setOrders(data);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchOrders]);

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
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 premium-hover"
                        aria-label="Go back"
                    >
                        <span className="material-symbols-outlined text-slate-600 text-xl">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            My Orders
                            {!loading && orders.length > 0 && (
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
                            )}
                        </h1>
                    </div>
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
                    <div className="flex flex-col items-center justify-center py-28 px-6 text-center animate-fade-in-up">
                        <div className="w-28 h-28 bg-orange-50/50 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-6xl text-orange-300 drop-shadow-sm">receipt_long</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                            {filter === "active" ? "No active orders" : "No past orders"}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mb-8">
                            {filter === "active"
                                ? "Your active orders will appear here"
                                : "Completed and cancelled orders will appear here"}
                        </p>
                        <button
                            onClick={() => router.push(ROUTES.CUSTOMER_DASHBOARD)}
                            className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 premium-hover premium-active"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    filteredOrders.map((order, i) => (
                        <div
                            key={order.id}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <OrderCard 
                                order={order} 
                                onCancel={handleCancel} 
                                onReorder={handleReorder}
                                reorderingId={reorderingId}
                            />
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}
