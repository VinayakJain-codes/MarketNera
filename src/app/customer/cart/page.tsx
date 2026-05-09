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
    const deliveryFee = subtotal > 0 ? 40 : 0;
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
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    aria-label="Go back"
                >
                    <span className="material-symbols-outlined text-slate-600 text-xl">arrow_back</span>
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-900">My Cart</h1>
                    {!loading && (
                        <p className="text-xs text-slate-400">
                            {itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? "s" : ""}` : "Your cart is empty"}
                        </p>
                    )}
                </div>
            </header>

            {/* ─── Empty state ─── */}
            {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl text-orange-300">shopping_cart</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                    <p className="text-sm text-slate-400 mb-8">Browse nearby shops and add some items!</p>
                    <button
                        onClick={() => router.push(ROUTES.CUSTOMER_DASHBOARD)}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                    >
                        Browse Products
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
                                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex gap-3 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 0.06}s` }}
                                >
                                    {/* Product image */}
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center">
                                        {imgUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={imgUrl} alt={product?.name ?? ""} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className={`material-symbols-outlined text-3xl ${cfg.text} opacity-40`}>{cfg.icon}</span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                                            {product?.name ?? "Product"}
                                        </h3>
                                        {product?.unit_type && (
                                            <p className="text-[10px] text-primary font-medium mt-0.5">per {product.unit_type}</p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-base font-bold text-slate-900">
                                                ₹{(displayPrice * item.quantity).toFixed(2)}
                                            </span>

                                            {/* Qty controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQtyChange(item, -1)}
                                                    disabled={!!updatingId}
                                                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <span className="material-symbols-outlined text-base">remove</span>
                                                </button>
                                                <span className="w-6 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQtyChange(item, 1)}
                                                    disabled={!!updatingId}
                                                    className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                                                    aria-label="Increase quantity"
                                                >
                                                    <span className="material-symbols-outlined text-base">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => handleRemove(item)}
                                        disabled={!!updatingId}
                                        className="self-start text-slate-300 hover:text-red-400 transition-colors disabled:opacity-40 mt-0.5"
                                        aria-label="Remove item"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete_outline</span>
                                    </button>
                                </div>
                            );
                        })
                    }
                </section>
            )}

            {/* ─── Order Summary ─── */}
            {!loading && items.length > 0 && (
                <section className="px-4 py-4 animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-3">
                        <h2 className="text-sm font-bold text-slate-700">Order Summary</h2>

                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Subtotal ({itemCount} items)</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Delivery fee</span>
                            <span>₹{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-dashed border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
                            <span>Total</span>
                            <span className="text-primary">₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Checkout CTA ─── */}
            {!loading && items.length > 0 && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] md:max-w-3xl bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-4 z-50">
                    {placeError && (
                        <p className="text-xs text-red-500 mb-2 text-center">{placeError}</p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs text-slate-400">Total payable</p>
                            <p className="text-xl font-black text-slate-900">₹{total.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={placing}
                            className="flex items-center gap-2 px-6 py-3 bg-[#13ec5b] text-slate-900 rounded-xl font-bold text-sm shadow-lg shadow-green-400/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                        >
                            {placing ? (
                                <>
                                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                    Placing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">bolt</span>
                                    Place Order
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                        Payment on delivery · Free delivery above ₹500
                    </p>
                </div>
            )}
        </div>
    );
}
