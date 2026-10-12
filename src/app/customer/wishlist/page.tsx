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
import Link from "next/link";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import {
    Heart,
    Trash2,
    ShoppingCart,
    ArrowLeft,
    Store,
    ShoppingBag,
    Check,
} from "lucide-react";

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
        setItems((prev) => prev.filter((item) => item.product_id !== productId));

        const { error } = await toggleWishlist(user.id, productId);
        if (error) {
            toast.error(error);
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
            window.dispatchEvent(new Event("marketnera_cart_updated"));
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
        <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between font-sans text-slate-900">
            {/* Top Navigation */}
            <CustomerNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6 flex-1">
                {/* Header */}
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-3">
                        <Link
                            href={ROUTES.CUSTOMER_DASHBOARD}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-xs"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span>My Wishlist</span>
                                {!loading && items.length > 0 && (
                                    <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        {items.length} Items
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Saved favorites for quick neighborhood reordering
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-40 rounded-2xl bg-white border border-slate-100 animate-pulse"
                            />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-4 shadow-xs">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                            <Heart className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Save products you buy frequently by clicking the heart icon on any product.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                        >
                            <span>Browse Catalog</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map((item) => {
                            const product = item.product;
                            const isAdded = addedProductIds.has(item.product_id);
                            const imgUrl = getProductImage(product);

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
                                >
                                    <div className="flex gap-3.5">
                                        <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 relative">
                                            {imgUrl ? (
                                                <Image
                                                    src={imgUrl}
                                                    alt={product?.name || "Product"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                {product?.category || "Essential"}
                                            </span>
                                            <h4 className="text-sm font-bold text-slate-900 truncate">
                                                {product?.name}
                                            </h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-black text-slate-900">
                                                    ₹{product?.sale_price || product?.price}
                                                </span>
                                                {product?.sale_price && product?.price > product.sale_price && (
                                                    <span className="text-xs text-slate-400 line-through">
                                                        ₹{product.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                                isAdded
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    <span>In Cart</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                    <span>Move to Cart</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleRemove(item.product_id)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Bottom Nav & Modern Footer */}
            <Footer />
            <CustomerBottomNav />
        </div>
    );
}
