"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LiveCatalogProduct } from "@/lib/services/customerCatalog";
import { Plus, Minus, Clock, Store, Package } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { addToCart, updateCartQty, removeFromCart } from "@/lib/services/cart";

interface ProductCardProps {
    product: LiveCatalogProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [quantity, setQuantity] = useState<number>(0);
    const [cartItemId, setCartItemId] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const isOutOfStock = product.stock_quantity <= 0;
    const hasDiscount =
        product.sale_price !== null &&
        product.sale_price > 0 &&
        product.sale_price < product.price;

    const displayPrice = hasDiscount ? product.sale_price! : product.price;
    const strikePrice = hasDiscount ? product.price : null;
    const discountPercent =
        hasDiscount && product.price > 0
            ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
            : 0;

    // Check user's current cart quantity
    useEffect(() => {
        let isMounted = true;

        const checkCart = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from("cart_items")
                    .select("id, quantity")
                    .eq("user_id", session.user.id)
                    .eq("product_id", product.id)
                    .maybeSingle();

                if (isMounted && data) {
                    setQuantity(data.quantity);
                    setCartItemId(data.id);
                }
            } else {
                try {
                    const guestCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
                    const item = guestCart.find((i: { id: string }) => i.id === product.id);
                    if (isMounted && item) {
                        setQuantity(item.quantity || 1);
                    }
                } catch {
                    // ignore
                }
            }
        };

        checkCart();
        return () => {
            isMounted = false;
        };
    }, [product.id]);

    const syncGuestCart = (newQty: number) => {
        try {
            const guestCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
            let updated;
            if (newQty <= 0) {
                updated = guestCart.filter((i: { id: string }) => i.id !== product.id);
            } else {
                const idx = guestCart.findIndex((i: { id: string }) => i.id === product.id);
                if (idx >= 0) {
                    guestCart[idx].quantity = newQty;
                    updated = guestCart;
                } else {
                    updated = [
                        ...guestCart,
                        {
                            id: product.id,
                            name: product.name,
                            price: displayPrice,
                            quantity: newQty,
                            shopId: product.shop_id,
                            unit: product.unit_type,
                            image: product.media_url,
                        },
                    ];
                }
            }
            localStorage.setItem("marketnera_guest_cart", JSON.stringify(updated));
            window.dispatchEvent(new Event("marketnera_cart_updated"));
        } catch {
            // ignore
        }
    };

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock || loadingAction) return;

        setLoadingAction(true);
        const newQty = 1;
        setQuantity(newQty);
        syncGuestCart(newQty);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const res = await addToCart(session.user.id, product.id, product.shop_id);
                if (res.success) {
                    window.dispatchEvent(new Event("marketnera_cart_updated"));
                }
            }
            toast.success(`Added ${product.name} to cart`, {
                position: "bottom-center",
                duration: 1500,
                style: {
                    background: "#064e3b",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "12px",
                },
            });
        } catch (err) {
            console.error("Cart error:", err);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleIncrement = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loadingAction) return;

        const newQty = quantity + 1;
        setQuantity(newQty);
        syncGuestCart(newQty);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user && cartItemId) {
                await updateCartQty(session.user.id, cartItemId, newQty);
                window.dispatchEvent(new Event("marketnera_cart_updated"));
            }
        } catch {
            // ignore
        }
    };

    const handleDecrement = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loadingAction) return;

        const newQty = Math.max(0, quantity - 1);
        setQuantity(newQty);
        syncGuestCart(newQty);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user && cartItemId) {
                if (newQty === 0) {
                    await removeFromCart(session.user.id, product.id);
                    setCartItemId(null);
                } else {
                    await updateCartQty(session.user.id, cartItemId, newQty);
                }
                window.dispatchEvent(new Event("marketnera_cart_updated"));
            }
        } catch {
            // ignore
        }
    };

    return (
        <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200">
            {/* Top Media & Tags */}
            <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                    {product.media_url ? (
                        <Image
                            src={product.media_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300 p-4">
                            <Package className="w-10 h-10 stroke-[1.5]" />
                            <span className="text-[10px] font-semibold text-slate-400 mt-1">
                                {product.category}
                            </span>
                        </div>
                    )}

                    {/* Delivery SLA badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-xs border border-slate-100 backdrop-blur-xs">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{product.delivery_time_minutes}m delivery</span>
                    </div>

                    {/* Discount badge */}
                    {discountPercent > 0 && (
                        <div className="absolute top-2 right-2 rounded-md bg-emerald-700 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                            {discountPercent}% OFF
                        </div>
                    )}

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-bold">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="mt-2.5 space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {product.category}
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                        {product.unit_type}
                    </p>
                </div>
            </Link>

            {/* Merchant and Price + Cart */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate">
                    <Store className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{product.shop_name}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-slate-950">
                            ₹{displayPrice}
                        </span>
                        {strikePrice && (
                            <span className="text-xs font-semibold text-slate-400 line-through">
                                ₹{strikePrice}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    {quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            disabled={isOutOfStock || loadingAction}
                            className={`h-8 px-4 rounded-lg text-xs font-bold transition-all ${
                                isOutOfStock
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-600 hover:bg-emerald-600 hover:text-white active:scale-95 cursor-pointer shadow-2xs"
                            }`}
                        >
                            ADD
                        </button>
                    ) : (
                        <div className="flex h-8 items-center rounded-lg bg-emerald-700 text-white text-xs font-bold shadow-2xs">
                            <button
                                onClick={handleDecrement}
                                className="px-2 h-full hover:bg-emerald-800 rounded-l-lg transition-colors flex items-center justify-center cursor-pointer"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 min-w-[20px] text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                className="px-2 h-full hover:bg-emerald-800 rounded-r-lg transition-colors flex items-center justify-center cursor-pointer"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
