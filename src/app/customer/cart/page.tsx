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
import { placeOrder, cancelOrder } from "@/lib/services/orders";
import { loadRazorpayScript } from "@/lib/services/razorpay";
import { ROUTES } from "@/constants/routes";
import { User } from "@supabase/supabase-js";
import { getAddresses, CustomerAddress } from "@/lib/services/addresses";
import { validateCoupon } from "@/lib/services/coupons";
import toast from "react-hot-toast";

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
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");

    // Address states
    const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);

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

    // ── Fetch saved addresses ──
    useEffect(() => {
        if (!user) return;
        getAddresses(user.id).then((list) => {
            setAddresses(list);
            const def = list.find((a) => a.is_default) || list[0] || null;
            setSelectedAddress(def);
        });
    }, [user]);

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
    const deliveryFee = 0;

    const discountAmount = appliedCoupon
        ? appliedCoupon.discount_type === "percentage"
            ? (appliedCoupon.discount_value / 100) * subtotal
            : appliedCoupon.discount_value
        : 0;

    const total = Math.max(0, subtotal - discountAmount + deliveryFee);
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setCouponError(null);
        if (!couponCode.trim()) return;

        const res = await validateCoupon(couponCode, subtotal);
        if (res.success && res.coupon) {
            setAppliedCoupon(res.coupon);
            setCouponCode("");
            toast.success("Coupon applied successfully!");
        } else {
            setCouponError(res.error || "Failed to apply coupon.");
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError(null);
        toast.success("Coupon removed.");
    };

    // ── Place Order ──
    const handlePlaceOrder = async () => {
        if (!user || items.length === 0 || placing) return;
        setPlaceError(null);
        setPlacing(true);

        if (!selectedAddress) {
            setPlaceError("Please select or add a delivery address to complete your order.");
            setPlacing(false);
            return;
        }

        const deliveryAddressString = `${selectedAddress.label}: ${selectedAddress.address_line}, ${selectedAddress.city} - ${selectedAddress.pincode}`;

        // Group items by shopkeeper and validate
        const shopkeeperId = items[0].shopkeeper_id;
        const hasMultipleShops = items.some(item => item.shopkeeper_id !== shopkeeperId);
        if (hasMultipleShops) {
            setPlaceError("You can only order items from one shop at a time. Please remove items from other shops to checkout.");
            setPlacing(false);
            return;
        }
        const orderItems = items.map((item) => ({
            productId: item.product_id,
            productName: item.product?.name ?? "Product",
            unitPrice: item.product?.sale_price ?? item.product?.price ?? 0,
            quantity: item.quantity,
        }));

        if (paymentMethod === "cod") {
            const { order, error } = await placeOrder({
                customerId: user.id,
                shopkeeperId,
                items: orderItems,
                totalAmount: total,
                deliveryAddress: deliveryAddressString,
                paymentMethod: "cod",
                paymentStatus: "pending",
            });

            if (error || !order) {
                setPlaceError(error ?? "Failed to place order. Please try again.");
                setPlacing(false);
                return;
            }

            // Clear cart then redirect to orders
            await clearCart(user.id);
            router.push(ROUTES.CUSTOMER_ORDERS);
        } else {
            // Razorpay Flow
            try {
                // 1. Create order record in Supabase with payment_method = 'razorpay'
                const { order, error } = await placeOrder({
                    customerId: user.id,
                    shopkeeperId,
                    items: orderItems,
                    totalAmount: total,
                    deliveryAddress: deliveryAddressString,
                    paymentMethod: "razorpay",
                    paymentStatus: "pending",
                });

                if (error || !order) {
                    setPlaceError(error ?? "Failed to initialize order. Please try again.");
                    setPlacing(false);
                    return;
                }

                // 2. Call backend create-order API
                const response = await fetch("/api/payments/razorpay/create-order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderId: order.id }),
                });

                const createOrderResult = await response.json();

                if (!response.ok || !createOrderResult.success) {
                    throw new Error(createOrderResult.error || "Failed to initiate transaction.");
                }

                const { keyId, order: razorpayOrder } = createOrderResult;

                // 3. Dynamically load the Razorpay checkout script
                const scriptLoaded = await loadRazorpayScript();
                if (!scriptLoaded) {
                    throw new Error("Unable to load payment SDK. Check your internet connection.");
                }

                // 4. Configure Razorpay checkout options
                const options = {
                    key: keyId,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "MarketNera",
                    description: `Order Payment for #${order.id.slice(0, 8)}`,
                    order_id: razorpayOrder.id,
                    handler: async (paymentResponse: any) => {
                        setPlacing(true);
                        try {
                            // 5. Send verify-payment request to backend
                            const verifyResponse = await fetch("/api/payments/razorpay/verify-payment", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                    razorpay_order_id: paymentResponse.razorpay_order_id,
                                    razorpay_signature: paymentResponse.razorpay_signature,
                                }),
                              });

                              const verifyResult = await verifyResponse.json();

                              if (!verifyResponse.ok || !verifyResult.success) {
                                  throw new Error(verifyResult.error || "Payment verification failed.");
                              }

                              // 6. Clear cart and redirect to success
                              await clearCart(user.id);
                              router.push(`${ROUTES.CUSTOMER_ORDERS}?payment=success`);
                          } catch (err: any) {
                              setPlaceError(err.message || "Payment verification failed. Please contact support.");
                              setPlacing(false);
                          }
                      },
                      prefill: {
                          email: user.email || "",
                      },
                      theme: {
                          color: "#F97316", // brand primary orange
                      },
                      modal: {
                          ondismiss: async () => {
                              setPlacing(false);
                              setPlaceError("Payment cancelled.");
                              await cancelOrder(order.id, user.id);
                          },
                      },
                  };

                  // 5. Open checkout modal
                  const rzp = new window.Razorpay(options);
                  rzp.open();

              } catch (err: any) {
                  setPlaceError(err.message || "Payment initiation failed. Please try again.");
                  setPlacing(false);
              }
          }
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
                    <button onClick={async () => {
                        if (!user) return;
                        setLoading(true);
                        await clearCart(user.id);
                        setItems([]);
                        setLoading(false);
                    }} className="text-red-500 font-bold text-xs uppercase tracking-wide hover:text-red-600 transition-colors">
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

            {/* ─── Delivery Address ─── */}
            {!loading && items.length > 0 && (
                <section className="px-4 py-2 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                Delivery Address
                            </h2>
                            <button
                                onClick={() => {
                                    if (addresses.length > 0) {
                                        setShowAddressModal(true);
                                    } else {
                                        router.push(ROUTES.CUSTOMER_ADDRESSES);
                                    }
                                }}
                                className="text-primary font-bold text-xs uppercase tracking-wide hover:opacity-85 transition-opacity"
                            >
                                {selectedAddress ? "Change" : "Add Address"}
                            </button>
                        </div>

                        {selectedAddress ? (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                                <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">
                                    {selectedAddress.label === "Home" ? "home" : selectedAddress.label === "Work" ? "work" : "location_on"}
                                </span>
                                <div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{selectedAddress.label}</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">{selectedAddress.address_line}</p>
                                    {(selectedAddress.city || selectedAddress.pincode) && (
                                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                                            {[selectedAddress.city, selectedAddress.pincode].filter(Boolean).join(" - ")}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push(ROUTES.CUSTOMER_ADDRESSES)}
                                className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-all"
                            >
                                <span className="material-symbols-outlined text-base">add_circle</span>
                                Add a delivery address to checkout
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* ─── Address Selector Modal ─── */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-[480px] rounded-t-3xl p-6 pb-10 shadow-2xl animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Select Delivery Address</h3>
                            <button onClick={() => setShowAddressModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {addresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    onClick={() => {
                                        setSelectedAddress(addr);
                                        setShowAddressModal(false);
                                    }}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 relative ${
                                        selectedAddress?.id === addr.id
                                            ? "border-emerald-500 bg-emerald-50/10 shadow-sm"
                                            : "border-slate-100 hover:border-slate-200 bg-white"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">
                                        {addr.label === "Home" ? "home" : addr.label === "Work" ? "work" : "location_on"}
                                    </span>
                                    <div className="flex-1 min-w-0 pr-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-black text-[11px] text-slate-800 uppercase tracking-wide">{addr.label}</span>
                                            {addr.is_default && (
                                                <span className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Default</span>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed truncate">{addr.address_line}</p>
                                    </div>
                                    {selectedAddress?.id === addr.id && (
                                        <span className="material-symbols-outlined text-emerald-500 text-lg absolute top-4 right-4">check_circle</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setShowAddressModal(false);
                                router.push(ROUTES.CUSTOMER_ADDRESSES);
                            }}
                            className="w-full mt-4 py-3 rounded-xl border border-dashed border-primary/50 text-primary bg-primary/5 text-xs font-black uppercase tracking-wider hover:bg-primary/10 transition-colors flex justify-center items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add New Address
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Order Summary ─── */}
            {!loading && items.length > 0 && (
                <section className="px-4 py-4 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">Order Summary</h2>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 animate-pulse">
                                <span className="material-symbols-outlined text-[14px]">celebration</span> Free Delivery!
                            </span>
                        </div>

                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Subtotal ({itemCount} items)</span>
                            <span className="text-slate-800">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-slate-500">
                            <span>Delivery fee</span>
                            <span className="text-green-600 font-bold">Free</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-sm font-medium text-red-500 animate-fade-in">
                                <span>Coupon Discount</span>
                                <span>- ₹{discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        {/* Promo Code System */}
                        <div className="pt-2 border-t border-slate-100/80">
                            {appliedCoupon ? (
                                <div className="flex justify-between items-center bg-rose-50/40 border border-dashed border-rose-200 rounded-xl p-3 animate-scale-in">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-rose-500 text-[20px] fill-1">local_offer</span>
                                        <div>
                                            <p className="text-xs font-black text-rose-900 tracking-wide uppercase">{appliedCoupon.code}</p>
                                            <p className="text-[10px] font-semibold text-rose-500 mt-0.5">Applied successfully</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="text-xs font-black text-rose-500 hover:text-rose-700 uppercase tracking-wider transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Promo Code (e.g. WELCOME20)"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:border-primary uppercase font-bold tracking-wider"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-[10px] text-red-500 font-bold animate-fade-in pl-1">{couponError}</p>
                                    )}
                                    {!couponError && (
                                        <p className="text-[9px] text-slate-400 font-semibold pl-1">Tip: Use <span className="font-bold text-slate-500">WELCOME20</span> for 20% off!</p>
                                    )}
                                </form>
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

            {/* ─── Payment Method ─── */}
            {!loading && items.length > 0 && (
                <section className="px-4 py-2 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">payments</span>
                            Payment Method
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {/* COD Option */}
                            <button
                                onClick={() => setPaymentMethod("cod")}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all cursor-pointer relative overflow-hidden ${
                                    paymentMethod === "cod"
                                        ? "border-green-500 bg-green-50/30 text-green-900 font-bold shadow-md shadow-green-500/5 scale-[1.02]"
                                        : "border-slate-100 hover:border-slate-200 bg-white text-slate-600 font-medium"
                                }`}
                            >
                                {paymentMethod === "cod" && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>
                                    </div>
                                )}
                                <span className={`material-symbols-outlined text-3xl mb-2 ${paymentMethod === "cod" ? "text-green-600 animate-pulse" : "text-slate-400"}`}>
                                    payments
                                </span>
                                <span className="text-xs">Cash on Delivery</span>
                                <span className="text-[10px] text-slate-400 mt-1">Pay at doorstep</span>
                            </button>

                            {/* Razorpay Option */}
                            <button
                                onClick={() => setPaymentMethod("razorpay")}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all cursor-pointer relative overflow-hidden ${
                                    paymentMethod === "razorpay"
                                        ? "border-blue-600 bg-blue-50/30 text-blue-900 font-bold shadow-md shadow-blue-500/5 scale-[1.02]"
                                        : "border-slate-100 hover:border-slate-200 bg-white text-slate-600 font-medium"
                                }`}
                            >
                                {paymentMethod === "razorpay" && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>
                                    </div>
                                )}
                                <span className={`material-symbols-outlined text-3xl mb-2 ${paymentMethod === "razorpay" ? "text-blue-600 fill-1" : "text-slate-400"}`}>
                                    credit_card
                                </span>
                                <span className="text-xs">Pay Online</span>
                                <span className="text-[10px] text-slate-400 mt-1">UPI, Card, Wallet</span>
                            </button>
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
                            className={`flex-1 md:flex-none md:w-56 flex justify-center items-center gap-2 px-6 py-4 text-white rounded-xl font-black text-sm shadow-xl transition-all disabled:opacity-60 premium-active ${
                                paymentMethod === "razorpay"
                                    ? "bg-blue-600 shadow-blue-600/30 hover:bg-blue-700"
                                    : "bg-green-500 shadow-green-500/30 hover:bg-green-600"
                            }`}
                        >
                            {placing ? (
                                <>
                                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                                    Placing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-xl fill-1">
                                        {paymentMethod === "razorpay" ? "credit_card" : "bolt"}
                                    </span>
                                    {paymentMethod === "razorpay" ? "Pay & Place Order" : "Place Order (COD)"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
