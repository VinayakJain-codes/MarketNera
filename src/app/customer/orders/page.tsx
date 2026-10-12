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
import Link from "next/link";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import {
    ShoppingBag,
    ArrowLeft,
    Clock,
    MapPin,
    ChevronDown,
    RotateCcw,
    XCircle,
    CheckCircle2,
    Star,
    Truck,
    Package,
    ShieldCheck,
} from "lucide-react";

// ── Skeleton Loader ──
const OrderSkeleton = () => (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
        </div>
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="border-t border-slate-100 pt-3 flex justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
        </div>
    </div>
);

// ── Status Progress Bar ──
function StatusProgress({ status }: { status: OrderStatus }) {
    if (status === "cancelled") {
        return (
            <div className="flex items-center gap-1.5 mt-3 text-rose-600 bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold border border-rose-100">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>This order was cancelled</span>
            </div>
        );
    }
    const currentIdx = ORDER_STATUS_FLOW.indexOf(status);
    return (
        <div className="mt-4 pt-2">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-[6px] left-[8%] right-[8%] h-[3px] bg-slate-100 z-0">
                    <div
                        className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                        style={{ width: `${(currentIdx / (ORDER_STATUS_FLOW.length - 1)) * 100}%` }}
                    />
                </div>
                {/* Status Nodes */}
                {ORDER_STATUS_FLOW.map((s, i) => {
                    const isCompleted = i <= currentIdx;
                    return (
                        <div key={s} className="flex flex-col items-center relative z-10 w-1/5">
                            <div
                                className={`w-3.5 h-3.5 rounded-full mb-1.5 flex-shrink-0 transition-colors shadow-xs ring-4 ring-white ${
                                    isCompleted ? "bg-emerald-600" : "bg-slate-200"
                                }`}
                            />
                            <span
                                className={`text-[10px] font-bold tracking-tight text-center ${
                                    isCompleted ? "text-emerald-700 font-extrabold" : "text-slate-400"
                                }`}
                            >
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
            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reviewed · Thank you!</span>
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 font-medium">Rate:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-xs ${star <= rating ? "text-amber-400" : "text-slate-200"} hover:scale-125 transition-transform`}
                    >
                        ★
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Write a quick review..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1 outline-none focus:border-emerald-600 bg-white"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                    {submitting ? "..." : "Post"}
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
    onCancel: (id: string) => void;
    onReorder: (order: Order) => void;
    reorderingId: string | null;
}) {
    const [expanded, setExpanded] = useState(false);
    const date = new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    const isPastOrder = order.status === "delivered" || order.status === "cancelled";

    return (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden hover:border-slate-300 transition-all">
            {/* Header Click Area */}
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left p-5 flex flex-col gap-3 cursor-pointer"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 tracking-tight font-mono">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                · {date}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 mt-1">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} ·{" "}
                            <span className="font-black text-slate-900">₹{order.total_amount.toFixed(2)}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                ORDER_STATUS_COLORS[order.status]
                            }`}
                        >
                            {ORDER_STATUS_LABELS[order.status]}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                                expanded ? "rotate-180" : ""
                            }`}
                        />
                    </div>
                </div>

                {/* Live Progress Bar */}
                <StatusProgress status={order.status} />
            </button>

            {/* Expanded items */}
            {expanded && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-3 space-y-4 bg-slate-50/40">
                    <div className="space-y-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Ordered Items
                        </span>
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col gap-1">
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-slate-700 font-medium">
                                        <strong className="text-slate-900 font-bold">{item.quantity}×</strong> {item.product_name}
                                    </span>
                                    <span className="font-bold text-slate-900">
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
                        <div className="flex items-start gap-2.5 p-3.5 bg-white rounded-xl border border-slate-100 text-xs text-slate-600">
                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-slate-900 block mb-0.5">Delivery Address</span>
                                <p className="leading-relaxed">{order.delivery_address}</p>
                            </div>
                        </div>
                    )}

                    {/* Cancel action (only for pending) */}
                    {order.status === "pending" && (
                        <button
                            onClick={() => onCancel(order.id)}
                            className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                            Cancel Order
                        </button>
                    )}

                    {/* Reorder Action (for past orders) */}
                    {isPastOrder && (
                        <button
                            onClick={() => onReorder(order)}
                            disabled={reorderingId !== null}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                            {reorderingId === order.id ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    <span>Adding to Cart...</span>
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Reorder Past Items</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Page Component ──
export default function CustomerOrdersPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"active" | "past">("active");
    const [reorderingId, setReorderingId] = useState<string | null>(null);

    const handleReorder = async (order: Order) => {
        if (!user || reorderingId) return;
        setReorderingId(order.id);
        const reorderItems = (order.order_items || []).map((item) => ({
            product_id: item.product_id,
            shop_id: order.shopkeeper_id,
            quantity: item.quantity,
        }));
        const res = await reorderPastOrder(user.id, reorderItems);
        if (res.success) {
            toast.success("Items added to your cart!");
            router.push(ROUTES.CUSTOMER_CART);
        } else {
            toast.error(res.error || "Failed to reorder items.");
            setReorderingId(null);
        }
    };

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
                async () => {
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
            toast.success("Order cancelled successfully");
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" as OrderStatus } : o))
            );
        }
    };

    // Filter active vs past
    const ACTIVE_STATUSES: OrderStatus[] = ["pending", "accepted", "preparing", "ready"];
    const filteredOrders = orders.filter((o) =>
        filter === "active"
            ? ACTIVE_STATUSES.includes(o.status)
            : !ACTIVE_STATUSES.includes(o.status)
    );

    const activeCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

    return (
        <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between font-sans text-slate-900">
            {/* Top Navigation */}
            <CustomerNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6 flex-1">
                {/* Header Card */}
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-3">
                        <Link
                            href={ROUTES.CUSTOMER_DASHBOARD}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
                            aria-label="Back to dashboard"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span>My Orders</span>
                                {!loading && orders.length > 0 && (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        {orders.length} Total
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Realtime status, doorstep SLA tracking, and past order history
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-sm">
                    <button
                        onClick={() => setFilter("active")}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            filter === "active"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <span>Active Orders</span>
                        {activeCount > 0 && (
                            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                                {activeCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setFilter("past")}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            filter === "past"
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Past Orders
                    </button>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map((i) => <OrderSkeleton key={i} />)
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-4 shadow-xs">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {filter === "active" ? "No active orders right now" : "No past orders found"}
                                </h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    {filter === "active"
                                        ? "When you order groceries or essentials, your live doorstep tracker will appear here."
                                        : "Your completed and delivered orders will be archived here for easy 1-click reordering."}
                                </p>
                            </div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                            >
                                <span>Start Shopping</span>
                            </Link>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onCancel={handleCancel}
                                onReorder={handleReorder}
                                reorderingId={reorderingId}
                            />
                        ))
                    )}
                </div>
            </main>

            {/* Bottom Nav & Modern Footer */}
            <Footer />
            <CustomerBottomNav />
        </div>
    );
}
