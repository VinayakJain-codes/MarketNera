"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { getWishlist, toggleWishlist, WishlistItem } from "@/lib/services/wishlist";
import { addToCart, getCartCount } from "@/lib/services/cart";
import toast from "react-hot-toast";
import Image from "next/image";

/* ── Category config ── */
const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; text: string }> = {
    Grocery:     { icon: "grocery",      bg: "bg-orange-50",  text: "text-orange-500" },
    Electronics: { icon: "devices",      bg: "bg-blue-50",    text: "text-blue-500" },
    Medicine:    { icon: "medication",   bg: "bg-red-50",     text: "text-red-500" },
    Stationery:  { icon: "edit_note",    bg: "bg-purple-50",  text: "text-purple-500" },
    Snacks:      { icon: "bakery_dining",bg: "bg-yellow-50",  text: "text-yellow-600" },
    Fashion:     { icon: "checkroom",    bg: "bg-pink-50",    text: "text-pink-500" },
    Home:        { icon: "chair",        bg: "bg-teal-50",    text: "text-teal-500" },
    Other:       { icon: "category",     bg: "bg-slate-50",   text: "text-slate-500" },
};

export default function WishlistPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set());

    // Auth & Init
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) {
                router.push(ROUTES.LOGIN_CUSTOMER);
                return;
            }
            setUser(session.user);
            getWishlist(session.user.id).then((wishlist) => {
                setItems(wishlist);
                setLoading(false);
            });
            getCartCount(session.user.id).then(setCartCount);
        });
    }, [router]);

    const handleRemove = async (productId: string) => {
        if (!user) return;

        // Optimistic update
        setItems((prev) => prev.filter((item) => item.product_id !== productId));

        const { error } = await toggleWishlist(user.id, productId);
        if (error) {
            toast.error(error);
            // Refetch on error
            const wishlist = await getWishlist(user.id);
            setItems(wishlist);
        } else {
            toast.success("Removed from wishlist");
        }
    };

    const handleAddToCart = async (product: any) => {
        if (!user) return;
        setAddedProductIds((prev) => new Set([...prev, product.id]));

        const result = await addToCart(user.id, product.id, product.shop_id);
        if (result.success) {
            setCartCount((c) => c + 1);
            toast.success("Added to cart!");
        } else {
            setAddedProductIds((prev) => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
            toast.error(result.error || "Failed to add to cart");
        }
    };

    const getProductImage = (product: any): string => {
        const media = product?.product_media;
        if (!media || media.length === 0) return "";
        const primary = media.find((m: any) => m.is_primary) || media[0];
        return primary?.media_url ?? "";
    };

    return (
        <div className="w-full max-w-[480px] md:max-w-3xl mx-auto bg-slate-50 min-h-screen shadow-xl relative pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        aria-label="Go back"
                    >
                        <span className="material-symbols-outlined text-slate-600 text-xl">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            My Wishlist
                            {!loading && items.length > 0 && (
                                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            )}
                        </h1>
                    </div>
                </div>
                <div className="relative">
                    <a
                        href={ROUTES.CUSTOMER_CART}
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        aria-label="View cart"
                    >
                        <span className="material-symbols-outlined text-slate-600 text-xl">shopping_bag</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </a>
                </div>
            </header>

            {/* Content list */}
            <div className="p-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 animate-pulse">
                                <div className="w-20 h-20 bg-slate-200 rounded-xl" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                                    <div className="h-4 bg-slate-200 rounded w-1/4 mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 px-6 text-center animate-fade-in-up">
                        <div className="w-28 h-28 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-6xl text-rose-300">favorite</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Your Wishlist is empty</h2>
                        <p className="text-sm font-medium text-slate-500 mb-8">
                            Tap the heart button on products to save them for later!
                        </p>
                        <button
                            onClick={() => router.push(ROUTES.CUSTOMER_DASHBOARD)}
                            className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 premium-hover premium-active"
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const product = item.product;
                            if (!product) return null;
                            const imgUrl = getProductImage(product);
                            const cfg = CATEGORY_CONFIG[product.category] ?? CATEGORY_CONFIG.Other;
                            const isAdded = addedProductIds.has(product.id);

                            return (
                                <div
                                    key={item.id}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 premium-hover animate-fade-in-up items-center relative"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                                        {imgUrl ? (
                                            <Image
                                                src={imgUrl}
                                                alt={product.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-contain"
                                                unoptimized
                                            />
                                        ) : (
                                            <span className={`material-symbols-outlined text-3xl ${cfg.text}`}>{cfg.icon}</span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow min-w-0 pr-8">
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${cfg.text} bg-${cfg.text.split("-")[1]}-50 px-2 py-0.5 rounded-full`}>
                                            {product.category}
                                        </span>
                                        <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">{product.name}</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-base font-black text-slate-900">
                                                ₹{product.sale_price ?? product.price}
                                            </span>
                                            {product.sale_price && product.sale_price < product.price && (
                                                <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={isAdded}
                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                                isAdded
                                                    ? "bg-slate-100 text-slate-400"
                                                    : "bg-primary text-white hover:opacity-90 active:scale-95 shadow-sm"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                {isAdded ? "check" : "shopping_cart"}
                                            </span>
                                            {isAdded ? "Added" : "Add"}
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="px-4 py-2 rounded-xl border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
