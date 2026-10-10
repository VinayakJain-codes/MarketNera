"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CatalogProduct } from "@/content/customer";
import { Plus, Minus, Check, Clock, Store } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface ProductCardProps {
    product: CatalogProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [quantity, setQuantity] = useState<number>(0);
    const [isHovered, setIsHovered] = useState(false);

    // Sync initial quantity from guest cart or user session
    useEffect(() => {
        try {
            const guestCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
            const existing = guestCart.find((i: { id: string }) => i.id === product.id);
            if (existing) {
                setQuantity(existing.quantity || 1);
            }
        } catch {
            // ignore
        }
    }, [product.id]);

    const updateLocalCart = (newQty: number) => {
        try {
            const guestCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
            let updated;
            if (newQty <= 0) {
                updated = guestCart.filter((i: { id: string }) => i.id !== product.id);
            } else {
                const index = guestCart.findIndex((i: { id: string }) => i.id === product.id);
                if (index >= 0) {
                    guestCart[index].quantity = newQty;
                    updated = guestCart;
                } else {
                    updated = [...guestCart, { id: product.id, name: product.name, price: product.price, quantity: newQty, image: product.image }];
                }
            }
            localStorage.setItem("marketnera_guest_cart", JSON.stringify(updated));
            window.dispatchEvent(new Event("marketnera_cart_updated"));
        } catch {
            // ignore
        }
    };

    const handleAdd = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newQty = quantity + 1;
        setQuantity(newQty);
        updateLocalCart(newQty);

        // Also sync to Supabase if user is logged in
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { addToCart } = await import("@/lib/services/cart");
                await addToCart(session.user.id, product.id, product.shopId);
            }
        } catch {
            // Keep guest cart fallback
        }

        toast.success(`Added ${product.name} to cart`, {
            duration: 1800,
            position: "bottom-right",
            style: {
                borderRadius: "16px",
                background: "#064e3b",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "bold",
            },
        });
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newQty = quantity + 1;
        setQuantity(newQty);
        updateLocalCart(newQty);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newQty = Math.max(0, quantity - 1);
        setQuantity(newQty);
        updateLocalCart(newQty);
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1"
        >
            {/* Top Image & Badges */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Delivery SLA Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-black text-slate-800 shadow-xs backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{product.deliveryTime}</span>
                </div>

                {/* Discount Badge */}
                {product.discountPercent > 0 && (
                    <div className="absolute top-2 right-2 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-black text-white shadow-xs">
                        {product.discountPercent}% OFF
                    </div>
                )}
            </div>

            {/* Product Meta Details */}
            <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                    {product.brand && (
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                            {product.brand}
                        </p>
                    )}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        {product.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 font-semibold">
                        {product.unit}
                    </p>
                </div>

                {/* Seller Store Name */}
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate">
                    <Store className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{product.shopName}</span>
                </div>

                {/* Pricing and ADD Button */}
                <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                            ₹{product.price}
                        </span>
                        {product.mrp > product.price && (
                            <span className="text-[11px] font-bold text-slate-400 line-through">
                                ₹{product.mrp}
                            </span>
                        )}
                    </div>

                    {/* Interactive Add or Qty Selector */}
                    {quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="inline-flex h-9 items-center justify-center rounded-xl border border-emerald-600 bg-emerald-50 px-5 text-xs font-black text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white shadow-xs active:scale-95 cursor-pointer"
                        >
                            ADD
                        </button>
                    ) : (
                        <div className="flex h-9 items-center rounded-xl bg-emerald-700 text-white shadow-md font-black text-xs">
                            <button
                                onClick={handleDecrement}
                                className="px-2.5 h-full hover:bg-emerald-800 rounded-l-xl transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 min-w-[20px] text-center font-bold">
                                {quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                className="px-2.5 h-full hover:bg-emerald-800 rounded-r-xl transition-colors active:scale-95 flex items-center justify-center cursor-pointer"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
