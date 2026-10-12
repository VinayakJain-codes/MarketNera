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
    getGuestCart,
    updateGuestCartQty,
    removeGuestCartItem,
    clearGuestCart,
} from "@/lib/services/cart";
import { cancelOrder } from "@/lib/services/orders";
import { loadRazorpayScript } from "@/lib/services/razorpay";
import { ROUTES } from "@/constants/routes";
import { User } from "@supabase/supabase-js";
import { getAddresses, CustomerAddress } from "@/lib/services/addresses";
import { validateCoupon } from "@/lib/services/coupons";
import toast from "react-hot-toast";
import Link from "next/link";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import {
    ArrowLeft,
    ShoppingBag,
    Trash2,
    Minus,
    Plus,
    MapPin,
    Home as HomeIcon,
    Briefcase,
    Truck,
    X,
    CheckCircle2,
    Check,
    Sparkles,
    Tag,
    ShieldCheck,
    CreditCard,
    AlertCircle,
    Lock,
    Loader2,
} from "lucide-react";

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
    const [paymentMethod, setPaymentMethod] = useState<"razorpay">("razorpay");

    // Address states
    const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Guest delivery form state
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [guestAddress, setGuestAddress] = useState("");
    const [guestLandmark, setGuestLandmark] = useState("");
    const [guestCity, setGuestCity] = useState("Meerut");
    const [guestPincode, setGuestPincode] = useState("250001");

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);

    // Terms & Checkout notice state
    const [agreedToTerms, setAgreedToTerms] = useState(true);

    // ── Auth check ──
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // ── Fetch saved addresses (logged-in user only) ──
    useEffect(() => {
        if (!user) return;
        getAddresses(user.id).then((list) => {
            setAddresses(list);
            const def = list.find((a) => a.is_default) || list[0] || null;
            setSelectedAddress(def);
        });
    }, [user]);

    // ── Fetch cart (handles user & guest) ──
    const fetchCart = useCallback(async () => {
        setLoading(true);
        if (user) {
            const cartItems = await getCart(user.id);
            setItems(cartItems);
        } else {
            try {
                const guestItems = getGuestCart();
                if (guestItems.length === 0) {
                    setItems([]);
                    setLoading(false);
                    return;
                }

                // Hydrate with latest product details from DB
                const productIds = guestItems.map((i) => i.id).filter(Boolean);
                const { data: dbProducts } = await supabase
                    .from("shopkeeper_products")
                    .select(`
                        id,
                        name,
                        price,
                        sale_price,
                        unit_type,
                        shop_id,
                        product_media (media_url, is_primary, sort_order)
                    `)
                    .in("id", productIds);

                const mapped: CartItem[] = guestItems.map((item) => {
                    const dbProd = dbProducts?.find((p) => p.id === item.id);
                    return {
                        id: item.id,
                        user_id: "guest",
                        product_id: item.id,
                        shopkeeper_id: dbProd?.shop_id || item.shopId || "",
                        quantity: Number(item.quantity) || 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: dbProd ? {
                            id: dbProd.id,
                            name: dbProd.name,
                            price: dbProd.price,
                            sale_price: dbProd.sale_price,
                            unit_type: dbProd.unit_type,
                            shop_id: dbProd.shop_id,
                            product_media: dbProd.product_media || (item.image ? [{ media_url: item.image, is_primary: true, sort_order: 0 }] : []),
                        } : {
                            id: item.id,
                            name: item.name || "Product",
                            price: item.price || 0,
                            sale_price: null,
                            unit_type: item.unit || "unit",
                            shop_id: item.shopId || "",
                            product_media: item.image ? [{ media_url: item.image, is_primary: true, sort_order: 0 }] : [],
                        },
                    };
                });
                setItems(mapped);
            } catch (err) {
                console.error("Failed to read guest cart:", err);
                setItems([]);
            }
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        const handleCartUpdated = () => {
            fetchCart();
        };
        window.addEventListener("marketnera_cart_updated", handleCartUpdated);
        return () => {
            window.removeEventListener("marketnera_cart_updated", handleCartUpdated);
        };
    }, [fetchCart]);

    // ── Actions ──
    const handleQtyChange = async (item: CartItem, delta: number) => {
        if (updatingId) return;
        const newQty = item.quantity + delta;
        setUpdatingId(item.id);

        // Optimistic update
        setItems((prev) =>
            newQty <= 0
                ? prev.filter((i) => i.id !== item.id)
                : prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
        );

        if (user) {
            await updateCartQty(user.id, item.id, newQty);
        } else {
            updateGuestCartQty(item.product_id, newQty);
        }
        setUpdatingId(null);
    };

    const handleRemove = async (item: CartItem) => {
        if (updatingId) return;
        setUpdatingId(item.id);
        setItems((prev) => prev.filter((i) => i.id !== item.id));

        if (user) {
            await removeFromCart(user.id, item.product_id);
        } else {
            removeGuestCartItem(item.product_id);
        }
        setUpdatingId(null);
    };

    const handleClearAll = async () => {
        setLoading(true);
        if (user) {
            await clearCart(user.id);
        } else {
            clearGuestCart();
        }
        setItems([]);
        setLoading(false);
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
        if (items.length === 0 || placing) return;
        setPlaceError(null);
        setPlacing(true);

        if (!agreedToTerms) {
            setPlaceError("Please agree to the Terms & Conditions and Privacy Policy to proceed.");
            setPlacing(false);
            return;
        }

        // Validate address
        let deliveryAddressString = "";
        if (user) {
            if (!selectedAddress) {
                setPlaceError("Please select or add a delivery address to complete your order.");
                setPlacing(false);
                return;
            }
            deliveryAddressString = `${selectedAddress.label}: ${selectedAddress.address_line}, ${selectedAddress.city} - ${selectedAddress.pincode}`;
        } else {
            if (!guestName.trim()) {
                setPlaceError("Please enter your name for delivery.");
                setPlacing(false);
                return;
            }
            const cleanPhone = guestPhone.replace(/\D/g, "");
            if (cleanPhone.length < 10) {
                setPlaceError("Please enter a valid 10-digit mobile number for order delivery & status.");
                setPlacing(false);
                return;
            }
            if (!guestAddress.trim()) {
                setPlaceError("Please enter your street address / house number.");
                setPlacing(false);
                return;
            }
            if (!guestPincode.trim() || guestPincode.replace(/\D/g, "").length < 6) {
                setPlaceError("Please enter a valid 6-digit pincode.");
                setPlacing(false);
                return;
            }

            deliveryAddressString = `${guestAddress.trim()}${guestLandmark.trim() ? `, Landmark: ${guestLandmark.trim()}` : ""}, ${guestCity.trim()} - ${guestPincode.trim()}`;
        }

        // Group items by shopkeeper and validate single shop constraint
        const shopkeeperId = items[0].shopkeeper_id;
        const hasMultipleShops = items.some((item) => item.shopkeeper_id !== shopkeeperId);
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

        try {
            // Place order through backend API (handles guest user provisioning & atomic DB insert)
            const placeRes = await fetch("/api/orders/place", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shopkeeperId,
                    items: orderItems,
                    totalAmount: total,
                    deliveryAddress: deliveryAddressString,
                    customerName: user ? undefined : guestName.trim(),
                    customerPhone: user ? undefined : guestPhone.trim(),
                    notes: user ? undefined : "Guest Checkout",
                    paymentMethod,
                }),
            });

            const placeData = await placeRes.json();
            if (!placeRes.ok || !placeData.success || !placeData.order) {
                setPlaceError(placeData.error || "Failed to place order. Please try again.");
                setPlacing(false);
                return;
            }

            const createdOrder = placeData.order;

            // Razorpay Flow
            const response = await fetch("/api/payments/razorpay/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId: createdOrder.id }),
                });

                const createOrderResult = await response.json();
                if (!response.ok || !createOrderResult.success) {
                    throw new Error(createOrderResult.error || "Failed to initiate transaction.");
                }

                const { keyId, order: razorpayOrder } = createOrderResult;

                const scriptLoaded = await loadRazorpayScript();
                if (!scriptLoaded) {
                    throw new Error("Unable to load payment SDK. Check your internet connection.");
                }

                const options = {
                    key: keyId,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "MarketNera",
                    description: `Order Payment for #${createdOrder.id.slice(0, 8)}`,
                    order_id: razorpayOrder.id,
                    handler: async (paymentResponse: any) => {
                        setPlacing(true);
                        try {
                            const verifyResponse = await fetch("/api/payments/razorpay/verify-payment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
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

                            if (user) {
                                await clearCart(user.id);
                            } else {
                                clearGuestCart();
                            }
                            router.push(`${ROUTES.ORDER_SUCCESS}?orderId=${createdOrder.id}&payment=success`);
                        } catch (err: any) {
                            setPlaceError(err.message || "Payment verification failed. Please contact support.");
                            setPlacing(false);
                        }
                    },
                    prefill: {
                        name: user ? undefined : guestName.trim(),
                        contact: user ? undefined : guestPhone.trim(),
                        email: user?.email || "",
                    },
                    theme: {
                        color: "#059669",
                    },
                    modal: {
                        ondismiss: async () => {
                            setPlacing(false);
                            setPlaceError("Payment cancelled.");
                            if (user) {
                                await cancelOrder(createdOrder.id, user.id);
                            }
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
        } catch (err: any) {
            setPlaceError(err.message || "Payment initiation failed. Please try again.");
            setPlacing(false);
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
        <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between font-sans text-slate-900 selection:bg-emerald-500 selection:text-white pb-36 lg:pb-12">
            {/* Top Navigation */}
            <CustomerNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 flex-1">
                {/* ─── Header ─── */}
                <div className="flex items-center justify-between bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                                <span>My Cart</span>
                                {!loading && itemCount > 0 && (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">{itemCount} items</span>
                                )}
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">Review your items and proceed to instant doorstep delivery</p>
                        </div>
                    </div>
                    {!loading && items.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="text-red-500 font-bold text-xs uppercase tracking-wide hover:text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer px-3 py-2 rounded-xl hover:bg-red-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear cart</span>
                        </button>
                    )}
                </div>

                {/* ─── Empty state ─── */}
                {!loading && items.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-4 max-w-lg mx-auto my-12 shadow-2xs">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
                            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your cart is empty</h2>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Browse nearby shops in Meerut and add freshly stocked groceries and daily essentials to your cart.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push(ROUTES.HOME)}
                            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors shadow-md shadow-emerald-700/20 cursor-pointer"
                        >
                            Browse Stores & Catalogue
                        </button>
                    </div>
                )}

                {/* ─── Cart Items ─── */}
                {(loading || items.length > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-3">
                            {loading
                                ? [1, 2, 3].map(i => <CartItemSkeleton key={i} />)
                                : items.map((item, idx) => {
                                    const product = item.product;
                                    const imgUrl = getProductImage(item);
                                    const displayPrice = product?.sale_price ?? product?.price ?? 0;

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200/80 flex gap-4 animate-fade-in-up relative hover:border-emerald-200 transition-colors"
                                            style={{ animationDelay: `${idx * 0.06}s` }}
                                        >
                                            {/* Product image */}
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                {imgUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={imgUrl} alt={product?.name ?? ""} className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    <ShoppingBag className="w-8 h-8 text-slate-300 stroke-[1.5]" />
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
                                                            className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer p-1"
                                                            aria-label="Remove item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {product?.unit_type && (
                                                        <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">
                                                            {product.unit_type}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100">
                                                    <span className="text-base font-black text-slate-900 tracking-tight">
                                                        ₹{(displayPrice * item.quantity).toFixed(2)}
                                                    </span>

                                                    {/* Qty controls */}
                                                    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                                                        <button
                                                            onClick={() => handleQtyChange(item, -1)}
                                                            disabled={!!updatingId}
                                                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleQtyChange(item, 1)}
                                                            disabled={!!updatingId}
                                                            className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }

                            {/* ─── Delivery Address Section ─── */}
                            <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-5 space-y-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-emerald-600" />
                                                <span>Delivery Address</span>
                                            </h2>
                                            <button
                                                onClick={() => {
                                                    if (addresses.length > 0) {
                                                        setShowAddressModal(true);
                                                    } else {
                                                        router.push(ROUTES.CUSTOMER_ADDRESSES);
                                                    }
                                                }}
                                                className="text-emerald-700 font-bold text-xs uppercase tracking-wide hover:text-emerald-800 transition-colors cursor-pointer"
                                            >
                                                {selectedAddress ? "Change" : "Add Address"}
                                            </button>
                                        </div>

                                        {selectedAddress ? (
                                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                                                    {selectedAddress.label === "Home" ? <HomeIcon className="w-4 h-4" /> : selectedAddress.label === "Work" ? <Briefcase className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{selectedAddress.label}</p>
                                                    <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-relaxed">{selectedAddress.address_line}</p>
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
                                                className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 hover:border-emerald-500 hover:text-emerald-700 transition-all cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add a delivery address to checkout</span>
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                            <div>
                                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                    <Truck className="w-4 h-4 text-emerald-600" />
                                                    <span>Delivery Details</span>
                                                </h2>
                                                <p className="text-[11px] text-slate-500 mt-0.5">No account required. Enter details to receive your order.</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                                                Guest
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                        Full Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Rahul Sharma"
                                                        value={guestName}
                                                        onChange={(e) => setGuestName(e.target.value)}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                        Mobile Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 focus-within:border-emerald-600">
                                                        <span className="px-2.5 py-2.5 bg-slate-100 text-[11px] font-bold text-slate-600 border-r border-slate-200 flex items-center">
                                                            +91
                                                        </span>
                                                        <input
                                                            type="tel"
                                                            maxLength={10}
                                                            placeholder="10-digit number"
                                                            value={guestPhone}
                                                            onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                                            className="w-full px-3 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                    Street Address / House No. <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    placeholder="House / Flat / Floor no., Building name, Street / Locality"
                                                    value={guestAddress}
                                                    onChange={(e) => setGuestAddress(e.target.value)}
                                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50/50 resize-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                    Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Nearby temple, school, park, or shop"
                                                    value={guestLandmark}
                                                    onChange={(e) => setGuestLandmark(e.target.value)}
                                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                        City <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="City"
                                                        value={guestCity}
                                                        onChange={(e) => setGuestCity(e.target.value)}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                                        Pincode <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={6}
                                                        placeholder="6-digit pincode"
                                                        value={guestPincode}
                                                        onChange={(e) => setGuestPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                                                    />
                                                </div>
                                            </div>

                                            {/* Existing Account Prompt */}
                                            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <span>Have an account with saved addresses?</span>
                                                <Link
                                                    href={`${ROUTES.LOGIN_CUSTOMER}?redirect=${encodeURIComponent(ROUTES.CUSTOMER_CART)}`}
                                                    className="text-emerald-700 font-bold hover:underline"
                                                >
                                                    Log In
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right column: Order Summary & Payment */}
                        <div className="space-y-4">
                            {/* Order Summary */}
                            <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-900">Order Summary</h2>
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        <span>Free Delivery</span>
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs font-medium text-slate-500">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({itemCount} items)</span>
                                        <span className="text-slate-800 font-bold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery fee</span>
                                        <span className="text-emerald-600 font-bold">Free</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-rose-600 animate-fade-in font-bold">
                                            <span>Coupon Discount</span>
                                            <span>- ₹{discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Promo Code System */}
                                <div className="pt-2 border-t border-slate-100">
                                    {appliedCoupon ? (
                                        <div className="flex justify-between items-center bg-rose-50/50 border border-dashed border-rose-200 rounded-xl p-3">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-rose-500" />
                                                <div>
                                                    <p className="text-xs font-black text-rose-900 tracking-wide uppercase">{appliedCoupon.code}</p>
                                                    <p className="text-[10px] font-semibold text-rose-500">Applied successfully</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-xs font-black text-rose-600 hover:text-rose-800 uppercase tracking-wider transition-colors cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Promo Code (WELCOME20)"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none bg-slate-50/50 focus:border-emerald-600 uppercase font-bold tracking-wider"
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-[10px] text-red-500 font-bold pl-1">{couponError}</p>
                                            )}
                                            {!couponError && (
                                                <p className="text-[9px] text-slate-400 font-semibold pl-1">Tip: Use <span className="font-bold text-emerald-700">WELCOME20</span> for 20% off!</p>
                                            )}
                                        </form>
                                    )}
                                </div>

                                <div className="border-t-2 border-dashed border-slate-100 pt-3">
                                    <div className="bg-slate-50 rounded-xl p-3 flex justify-between font-black text-slate-900 text-lg border border-slate-100">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        <span>Payment Method</span>
                                    </h2>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        100% Secure
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/20 text-slate-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                <span>Instant Digital Payment</span>
                                                <span className="text-[9px] bg-emerald-700 text-white font-extrabold px-1.5 py-0.2 rounded">PREPAID</span>
                                            </p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                UPI QR, GPay, PhonePe, Paytm, Cards &amp; NetBanking
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                    </div>
                                </div>
                            </div>

                            {/* Checkout CTA Card */}
                            <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-5 space-y-3">
                                {placeError && (
                                    <p className="text-xs text-red-500 text-center font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">{placeError}</p>
                                )}
                                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                                    <p className="font-semibold flex items-start gap-1.5 mb-1.5">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <span>No returns for change of mind. Target delivery in Meerut within 15–30 mins.</span>
                                    </p>
                                    <label className="flex items-center gap-2 mt-1 cursor-pointer text-slate-700 select-none">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                                        />
                                        <span>
                                            I agree to the{" "}
                                            <a href="/terms" target="_blank" className="font-bold underline hover:text-emerald-700">Terms</a>
                                            {" "}and{" "}
                                            <a href="/privacy" target="_blank" className="font-bold underline hover:text-emerald-700">Privacy Policy</a>
                                        </span>
                                    </label>
                                </div>

                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                                    <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-600" /> SSL Encrypted</span>
                                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Razorpay Verified</span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placing || !agreedToTerms}
                                    className="w-full flex justify-center items-center gap-2 py-4 text-white rounded-xl font-black text-sm shadow-xl transition-all disabled:opacity-60 bg-emerald-700 shadow-emerald-700/20 hover:bg-emerald-800 cursor-pointer active:scale-[0.99]"
                                >
                                    {placing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing Payment...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            <span>Pay ₹{total.toFixed(2)} &amp; Place Order</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Address Selector Modal ─── */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
                        <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-fade-in-up border border-slate-200">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Select Delivery Address</h3>
                                <button onClick={() => setShowAddressModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                                    <X className="w-5 h-5" />
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
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 relative cursor-pointer ${
                                            selectedAddress?.id === addr.id
                                                ? "border-emerald-600 bg-emerald-50/20 shadow-2xs"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                                            {addr.label === "Home" ? <HomeIcon className="w-4 h-4" /> : addr.label === "Work" ? <Briefcase className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-6">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-black text-xs text-slate-800 uppercase tracking-wide">{addr.label}</span>
                                                {addr.is_default && (
                                                    <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                                                )}
                                            </div>
                                            <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed truncate">{addr.address_line}</p>
                                        </div>
                                        {selectedAddress?.id === addr.id && (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-4 right-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddressModal(false);
                                    router.push(ROUTES.CUSTOMER_ADDRESSES);
                                }}
                                className="w-full mt-4 py-3 rounded-xl border border-dashed border-emerald-500 text-emerald-700 bg-emerald-50/50 text-xs font-black uppercase tracking-wider hover:bg-emerald-50 transition-colors flex justify-center items-center gap-1.5 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add New Address</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />

            {/* Bottom Nav */}
            <CustomerBottomNav />
        </div>
    );
}
