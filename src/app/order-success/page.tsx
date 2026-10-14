"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import Footer from "@/components/layout/Footer";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Store, ShoppingBag, ArrowRight, ShieldCheck, UserPlus, MessageCircle, Eye, BellRing } from "lucide-react";
import { ROUTES } from "@/constants/routes";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError("No order ID was found in the link.");
            return;
        }

        if (typeof window !== "undefined") {
            try {
                localStorage.setItem("marketnera_active_order_id", orderId);
            } catch {
                // ignore
            }
        }

        async function fetchOrder() {
            try {
                const res = await fetch(`/api/orders/summary?orderId=${encodeURIComponent(orderId!)}`);
                const data = await res.json();
                if (res.ok && data.success && data.order) {
                    setOrder(data.order);
                } else {
                    setError(data.error || "Could not retrieve order details.");
                }
            } catch {
                setError("Network error while loading your order confirmation.");
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [orderId]);

    return (
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between pb-16 lg:pb-0">
            <CustomerNavbar />

            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 max-w-2xl space-y-6">
                {loading ? (
                    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-4 animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto" />
                        <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto" />
                        <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
                        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                            <span className="text-2xl font-bold">!</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">Order Notice</h1>
                        <p className="text-xs text-slate-500">{error}</p>
                        <div className="pt-2">
                            <Link
                                href={ROUTES.HOME}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Go to Store Homepage</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Success Banner */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 stroke-[2]" />
                            </div>

                            <div className="space-y-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                                    Order Confirmed
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                    Thank you for your order!
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                    Your order has been sent to the store and will arrive in 15–30 minutes.
                                </p>
                            </div>

                            {/* Estimated Delivery Card */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-emerald-700 text-white">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Estimated Delivery</p>
                                        <p className="text-[11px] text-slate-500 font-medium">Within 15 to 30 mins</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                    Fast Delivery ⚡
                                </span>
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="text-slate-400 font-semibold">Order ID</span>
                                <span className="font-mono font-bold text-slate-800">{order.id}</span>
                            </div>

                            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-4">
                                <span className="text-slate-400 font-semibold shrink-0">Store</span>
                                <span className="font-bold text-slate-800 text-right flex items-center gap-1.5">
                                    <Store className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{order.shop_name}</span>
                                </span>
                            </div>

                            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-4">
                                <span className="text-slate-400 font-semibold shrink-0">Delivery Address</span>
                                <span className="font-medium text-slate-700 text-right max-w-xs">
                                    {order.delivery_address}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="text-slate-400 font-semibold">Payment</span>
                                <span className="font-bold text-slate-800 uppercase">
                                    Paid Online (Razorpay)
                                </span>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2 pt-1">
                                <p className="font-bold text-slate-900 text-xs">Ordered Items</p>
                                <div className="space-y-2">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between text-slate-600">
                                            <span>
                                                {item.product_name} <strong className="text-slate-800">× {item.quantity}</strong>
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                ₹{item.subtotal || item.unit_price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-950">
                                <span>Total Paid</span>
                                <span className="text-base text-emerald-800">₹{order.total_amount}</span>
                            </div>
                        </div>

                        {/* ── Order Action Bars: See Order & WhatsApp Query (8923678493) ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Link
                                href={ROUTES.CUSTOMER_ORDERS}
                                className="py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
                            >
                                <Eye className="w-4 h-4" />
                                <span>See Order &amp; Live Tracking</span>
                            </Link>

                            <a
                                href={`https://wa.me/918923678493?text=${encodeURIComponent(
                                    `Hi MarketNera Support, I have an order related query regarding my order #${order.id.slice(0, 8).toUpperCase()} (₹${order.total_amount}).`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 active:scale-95 transition-all"
                            >
                                <MessageCircle className="w-4 h-4 fill-slate-950 text-slate-950" />
                                <span>Order Query (WhatsApp: 8923678493)</span>
                            </a>
                        </div>

                        {/* Guest Account Optional Callout */}
                        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5">
                                <UserPlus className="w-5 h-5 text-emerald-700 shrink-0" />
                                <div>
                                    <p className="font-bold text-emerald-950">Want to save addresses for next time?</p>
                                    <p className="text-emerald-800 text-[11px]">Create an account in 1 click to track orders anytime.</p>
                                </div>
                            </div>
                            <Link
                                href={ROUTES.SIGNUP_CUSTOMER}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-bold shrink-0 hover:bg-emerald-800"
                            >
                                Create Account
                            </Link>
                        </div>

                        {/* Continue Shopping button */}
                        <div className="text-center pt-2">
                            <Link
                                href={ROUTES.HOME}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors w-full sm:w-auto shadow-sm"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Continue Shopping</span>
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
            <CustomerBottomNav />
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#fafaf9]" />}>
            <OrderSuccessContent />
        </Suspense>
    );
}
