"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    getCart,
    updateCartQty,
    removeFromCart,
    computeSubtotal,
    clearCart,
    CartItem,
} from "@/lib/services/cart";
import { placeOrder } from "@/lib/services/orders";
import { ROUTES } from "@/constants/routes";
import { User } from "@supabase/supabase-js";

// ── Category icon map (reused from dashboard) ──
const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; text: string }> = {
    Grocery: { icon: "grocery", bg: "bg-orange-50", text: "text-orange-500" },
    Electronics: { icon: "devices", bg: "bg-blue-50", text: "text-blue-500" },
    Medicine: { icon: "medication", bg: "bg-red-50", text: "text-red-500" },
    Stationery: { icon: "edit_note", bg: "bg-purple-50", text: "text-purple-500" },
    Snacks: { icon: "bakery_dining", bg: "bg-yellow-50", text: "text-yellow-600" },
    Fashion: { icon: "checkroom", bg: "bg-pink-50", text: "text-pink-500" },
    Home: { icon: "chair", bg: "bg-teal-50", text: "text-teal-500" },
    Other: { icon: "category", bg: "bg-slate-50", text: "text-slate-500" },
};

// ── Skeleton ──
const CartItemSkeleton = () => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-3 animate-pulse">
        <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/4" />
        </div>
    </div>
);

export default function CartPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [placing, setPlacing] = useState(false);
    const [placeError, setPlaceError] = useState<string | null>(null);

    // ── Auth check ──
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) {
                router.push(ROUTES.LOGIN_CUSTOMER);
                return;
            }
            setUser(session.user);
        });
    }, [router]);

    // ── Fetch cart ──
    const fetchCart = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const cartItems = await getCart(user.id);
        setItems(cartItems);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // ── Actions ──
    const handleQtyChange = async (item: CartItem, delta: number) => {
        if (!user || updatingId) return;
        const newQty = item.quantity + delta;
        setUpdatingId(item.id);

        // Optimistic update
        setItems(prev =>
            newQty <= 0
                ? prev.filter(i => i.id !== item.id)
                : prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
        );

        await updateCartQty(user.id, item.id, newQty);
        setUpdatingId(null);
    };

    const handleRemove = async (item: CartItem) => {
        if (!user || updatingId) return;
        setUpdatingId(item.id);
        setItems(prev => prev.filter(i => i.id !== item.id));
        await removeFromCart(user.id, item.product_id);
        setUpdatingId(null);
    };

    // ── Compute totals ──
    const subtotal = computeSubtotal(items);
    const deliveryFee = subtotal > 500 ? 0 : (subtotal > 0 ? 40 : 0);
    const total = subtotal + deliveryFee;
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    // ── Place Order ──
    const handlePlaceOrder = async () => {
        if (!user || items.length === 0 || placing) return;
        setPlaceError(null);
        setPlacing(true);

        // Group items by shopkeeper (multi-shopkeeper not supported yet — use first shopkeeper)
        const shopkeeperId = items[0].shopkeeper_id;
        const orderItems = items.map((item) => ({
            productId: item.product_id,
            productName: item.product?.name ?? "Product",
            unitPrice: item.product?.sale_price ?? item.product?.price ?? 0,
            quantity: item.quantity,
        }));

        const { order, error } = await placeOrder({
            customerId: user.id,
            shopkeeperId,
            items: orderItems,
            totalAmount: total,
        });

        if (error || !order) {
            setPlaceError(error ?? "Failed to place order. Please try again.");
            setPlacing(false);
            return;
        }

        // Clear cart then redirect to orders
        await clearCart(user.id);
        router.push(ROUTES.CUSTOMER_ORDERS);
    };

    // ── Product image helper ──
    const getProductImage = (item: CartItem): string => {
        const media = item.product?.product_media ?? [];
        if (media.length === 0) return "";
        const primary = media.find(m => m.is_primary) ?? media.sort((a, b) => a.sort_order - b.sort_order)[0];
        return primary?.media_url ?? "";
    };

    return (
        <div className="w-full max-w-[480px] md:max-w-3xl mx-auto bg-gray-50 min-h-screen shadow-xl relative pb-32">
            {/* ─── Header ─── */}
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
                            My Cart
                            {!loading && itemCount > 0 && (
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
                            )}
                        </h1>
                    </div>
                </div>
                {!loading && items.length > 0 && (
                    <button onClick={() => {}} className="text-red-500 font-bold text-xs uppercase tracking-wide hover:text-red-600 transition-colors">
                        Clear all
                    </button>
                )}
            </header>

            {/* ─── Empty state ─── */}
            {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-fade-in-up">
                    <div className="w-28 h-28 bg-orange-50/50 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-6xl text-orange-300 drop-shadow-sm">shopping_bag</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Your cart is empty</h2>
                    <p className="text-sm font-medium text-slate-500 mb-8">Browse nearby shops and add some items to your cart.</p>
                    <button
                        onClick={() => router.push(ROUTES.CUSTOMER_DASHBOARD)}
                        className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 premium-hover premium-active"
                    >
                        Start Shopping
                    </button>
                </div>
            )}

            {/* ─── Cart Items ─── */}
            {(loading || items.length > 0) && (
                <section className="px-4 py-4 space-y-3">
                    {loading
                        ? [1, 2, 3].map(i => <CartItemSkeleton key={i} />)
                        : items.map((item, idx) => {
                            const product = item.product;
                            const imgUrl = getProductImage(item);
                            const displayPrice = product?.sale_price ?? product?.price ?? 0;
                            const cfg = CATEGORY_CONFIG.Other;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 flex gap-4 animate-fade-in-up relative premium-hover"
                                    style={{ animationDelay: `${idx * 0.06}s` }}
                                >
                                    {/* Product image */}
                                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center">
                                        {imgUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={imgUrl} alt={product?.name ?? ""} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className={`material-symbols-outlined text-3xl ${cfg.text} opacity-40`}>{cfg.icon}</span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 pr-6">
                                                    {product?.name ?? "Product"}
                                                </h3>
                                                {/* Remove */}
                                                <button
                                                    onClick={() => handleRemove(item)}
                                                    disabled={!!updatingId}
                                                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40"
                                                    aria-label="Remove item"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete_outline</span>
                                                </button>
                                            </div>
                                            {product?.unit_type && (
                                                <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1">
                                                    {product.unit_type}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-end justify-between mt-3">
                                            <span className="text-base font-black text-slate-900 tracking-tight">
                                                ₹{(displayPrice * item.quantity).toFixed(2)}
                                            </span>

                                            {/* Qty controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleQtyChange(item, -1)}
                                                    disabled={!!updatingId}
                                                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 premium-active"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <span className="material-symbols-outlined text-base">remove</span>
                                                </button>
                                                <span className="w-5 text-center text-sm font-black text-slate-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQtyChange(item, 1)}
                                                    disabled={!!updatingId}
                                                    className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30 transition-all disabled:opacity-40 premium-active"
                                                    aria-label="Increase quantity"
                                                >
                                                    <span className="material-symbols-outlined text-base">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </section>
            )}

            {/* ─── Order Summary ─── */}
            {!loading && items.length > 0 && (
                <section className="px-4 py-4 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">Order Summary</h2>
                            {subtotal > 500 && (
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">celebration</span> Free Delivery!
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Subtotal ({itemCount} items)</span>
                            <span className="text-slate-800">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Delivery fee</span>
                            {subtotal > 500 ? (
                                <span className="text-green-600 font-bold">Free</span>
                            ) : (
                                <span className="text-slate-800">₹{deliveryFee.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="border-t-2 border-dashed border-slate-100 pt-4 pb-2">
                            <div className="bg-slate-50 rounded-xl px-3 py-2.5 -mx-1 flex justify-between font-black text-slate-900 text-lg">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Checkout CTA ─── */}
            {!loading && items.length > 0 && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] md:max-w-3xl bg-white border-t border-slate-100 px-4 py-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                    {placeError && (
                        <p className="text-xs text-red-500 mb-2 text-center font-bold bg-red-50 p-2 rounded-lg">{placeError}</p>
                    )}
                    <div className="flex justify-center mb-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase gap-3">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lock</span> Secure Checkout</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">payments</span> COD Available</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Payable</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">₹{total.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className="flex-1 md:flex-none md:w-56 flex justify-center items-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl font-black text-sm shadow-xl shadow-green-500/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 premium-active"
                        >
                            {placing ? (
                                <>
                                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                                    Placing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-xl fill-1">bolt</span>
                                    Place Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
