"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getShopkeeperProfile, ShopkeeperProfile } from "@/lib/services/shopkeeper";
import { getProducts, Product } from "@/lib/api/products";
import { addToCart } from "@/lib/services/cart";
import { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import Image from "next/image";

const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; border: string; text: string }> = {
    Grocery:     { icon: "grocery",      bg: "bg-orange-50",  border: "border-orange-100",  text: "text-orange-500" },
    Electronics: { icon: "devices",      bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-500" },
    Medicine:    { icon: "medication",   bg: "bg-red-50",     border: "border-red-100",     text: "text-red-500" },
    Stationery:  { icon: "edit_note",    bg: "bg-purple-50",  border: "border-purple-100",  text: "text-purple-500" },
    Snacks:      { icon: "bakery_dining",bg: "bg-yellow-50",  border: "border-yellow-100",  text: "text-yellow-600" },
    Fashion:     { icon: "checkroom",    bg: "bg-pink-50",    border: "border-pink-100",    text: "text-pink-500" },
    Home:        { icon: "chair",        bg: "bg-teal-50",    border: "border-teal-100",    text: "text-teal-500" },
    Other:       { icon: "category",     bg: "bg-slate-50",   border: "border-slate-100",   text: "text-slate-500" },
};

export default function ShopDetailPage({ params }: { params: Promise<{ shopId: string }> }) {
    const { shopId } = use(params);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [shop, setShop] = useState<ShopkeeperProfile | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
    }, []);

    useEffect(() => {
        const fetchShopAndProducts = async () => {
            try {
                const shopData = await getShopkeeperProfile(shopId);
                setShop(shopData);
                if (shopData) {
                    const productsData = await getProducts(shopId, { status: "published" });
                    setProducts(productsData);

                    // Quietly increment views for all loaded products
                    productsData.forEach(async (p) => {
                        try {
                            await supabase.rpc("increment_product_view", { p_product_id: p.id });
                        } catch (e) {}
                    });
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShopAndProducts();
    }, [shopId]);

    const handleAdd = async (product: Product) => {
        if (!user) {
            toast.error("Please log in to add items to cart");
            return;
        }
        const alreadyAdded = addedProductIds.has(product.id);
        setAddedProductIds((prev) => {
            const next = new Set(prev);
            if (next.has(product.id)) next.delete(product.id);
            else next.add(product.id);
            return next;
        });
        if (!alreadyAdded) {
            const result = await addToCart(user.id, product.id, product.shop_id);
            if (result.success) {
                toast.success("Added to cart");
            } else {
                setAddedProductIds((prev) => { const next = new Set(prev); next.delete(product.id); return next; });
                toast.error("Could not add to cart");
            }
        }
    };

    const getProductImage = (product: Product & { product_media?: { media_url: string; is_primary: boolean; sort_order: number }[] }): string => {
        const media = product.product_media;
        if (!media || media.length === 0) return "";
        const primary = media.find(m => m.is_primary) || media.sort((a, b) => a.sort_order - b.sort_order)[0];
        return primary?.media_url ?? "";
    };

    if (loading) {
        return (
            <div className="w-full max-w-[480px] md:max-w-5xl lg:max-w-7xl mx-auto min-h-screen bg-white">
                <div className="h-48 bg-slate-200 animate-pulse" />
                <div className="p-4 space-y-4">
                    <div className="h-8 bg-slate-200 animate-pulse w-1/3 rounded" />
                    <div className="h-4 bg-slate-200 animate-pulse w-1/4 rounded" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="w-full max-w-[480px] md:max-w-5xl lg:max-w-7xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">store_off</span>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Shop not found</h1>
                <p className="text-slate-500 mb-6 text-center">The shop you're looking for doesn't exist or is currently unavailable.</p>
                <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 premium-hover">
                    Go Back
                </button>
            </div>
        );
    }

    const cfg = CATEGORY_CONFIG[shop.category] ?? CATEGORY_CONFIG.Other;

    return (
        <div className="w-full max-w-[480px] md:max-w-5xl lg:max-w-7xl mx-auto min-h-screen bg-slate-50 relative pb-12">
            {/* Header / Banner */}
            <header className="relative w-full h-56 md:h-64 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden rounded-b-3xl shadow-md">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4 z-10">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                </div>
                <div className="absolute bottom-6 left-6 z-10 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-sm`}>
                            {shop.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold bg-green-500/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Open
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black drop-shadow-md tracking-tight mb-1">{shop.shop_name}</h1>
                    <p className="text-sm md:text-base font-medium text-white/80 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {(shop.address || "").split(" ||| ")[0]}
                    </p>
                </div>
                {/* Custom Shop Photo Banner Backdrop */}
                {(shop.address || "").split(" ||| ")[1] && (
                    <div className="absolute inset-0 z-0">
                        <img src={(shop.address || "").split(" ||| ")[1]} className="w-full h-full object-cover opacity-40 blur-[1px]" alt="" />
                    </div>
                )}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
                    <span className="material-symbols-outlined text-[160px] text-white">{cfg.icon}</span>
                </div>
            </header>

            {/* Products Grid */}
            <main className="px-4 mt-8 md:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">All Products</h2>
                    <span className="text-slate-500 text-sm font-medium">{products.length} items</span>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                        <span className="material-symbols-outlined text-5xl block mb-3 text-slate-300">inventory_2</span>
                        <p className="text-base font-semibold text-slate-900">No products available</p>
                        <p className="text-sm mt-1 text-slate-500">This shop hasn't published any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product, i) => {
                            const imgUrl = getProductImage(product as any);
                            const pCfg = CATEGORY_CONFIG[product.category] ?? CATEGORY_CONFIG.Other;
                            const isAdded = addedProductIds.has(product.id);
                            const discountPct = product.sale_price && product.sale_price < product.price
                                ? Math.round((1 - product.sale_price / product.price) * 100)
                                : null;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl p-3 shadow-sm border border-slate-100/80 flex flex-col animate-fade-in-up premium-hover"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3 relative">
                                        {imgUrl ? (
                                            <Image
                                                alt={product.name}
                                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                                src={imgUrl}
                                                width={200}
                                                height={200}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className={`w-full h-full ${pCfg.bg} flex items-center justify-center`}>
                                                <span className={`material-symbols-outlined text-[48px] ${pCfg.text} opacity-40`}>{pCfg.icon}</span>
                                            </div>
                                        )}
                                        {discountPct && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                                                -{discountPct}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow flex flex-col justify-start">
                                        <h5 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">{product.name}</h5>
                                        {product.unit_type && (
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">{product.unit_type}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-base font-black text-slate-900 tracking-tight">
                                                ₹{product.sale_price ?? product.price}
                                            </span>
                                            {product.sale_price && product.sale_price < product.price && (
                                                <span className="text-xs text-slate-400 line-through font-medium">₹{product.price}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAdd(product as any)}
                                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all premium-active ${
                                                isAdded
                                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                                    : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[18px] font-bold">
                                                {isAdded ? "check" : "add"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
