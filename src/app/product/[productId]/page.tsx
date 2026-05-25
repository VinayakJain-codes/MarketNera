"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import { addToCart, getCartCount } from "@/lib/services/cart";
import { toggleWishlist, getWishlist } from "@/lib/services/wishlist";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

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

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = use(params);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [product, setProduct] = useState<any>(null);
    const [shop, setShop] = useState<any>(null);
    const [media, setMedia] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                // Fetch product with media
                const { data: prodData, error: prodErr } = await supabase
                    .from("shopkeeper_products")
                    .select("*, product_media(*)")
                    .eq("id", productId)
                    .single();

                if (prodErr || !prodData) {
                    console.error("Error fetching product:", prodErr);
                    setLoading(false);
                    return;
                }

                setProduct(prodData);
                setMedia(prodData.product_media || []);

                // Fetch shop profile
                const { data: shopData } = await supabase
                    .from("shopkeeper")
                    .select("*")
                    .eq("user_id", prodData.shop_id)
                    .single();

                setShop(shopData);
            } catch (error) {
                console.error("Error details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    // Check cart and wishlist status
    useEffect(() => {
        if (!user || !product) return;

        getCartCount(user.id).then(setCartCount);
        
        getWishlist(user.id).then((items) => {
            setIsWishlisted(items.some((i) => i.product_id === product.id));
        });

        // Check if current product is already in user's cart
        supabase
            .from("cart_items")
            .select("id")
            .eq("customer_id", user.id)
            .eq("product_id", product.id)
            .then(({ data }) => {
                if (data && data.length > 0) setIsAdded(true);
            });
    }, [user, product]);

    const handleAddToCart = async () => {
        if (!user) {
            router.push(ROUTES.LOGIN_CUSTOMER);
            return;
        }

        if (isAdded) {
            router.push(ROUTES.CUSTOMER_CART);
            return;
        }

        setIsAdded(true);
        const result = await addToCart(user.id, product.id, product.shop_id);
        if (result.success) {
            setCartCount((c) => c + 1);
            toast.success("Added to Cart!");
        } else {
            setIsAdded(false);
            toast.error("Could not add to cart.");
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            router.push(ROUTES.LOGIN_CUSTOMER);
            return;
        }

        const nextState = !isWishlisted;
        setIsWishlisted(nextState);

        const { added, error } = await toggleWishlist(user.id, product.id);
        if (error) {
            setIsWishlisted(!nextState);
            toast.error(error);
        } else {
            toast.success(nextState ? "Added to Wishlist!" : "Removed from Wishlist!");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = ROUTES.HOME;
    };

    if (loading) {
        return (
            <div className="w-full max-w-[480px] md:max-w-7xl mx-auto min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-xs font-bold">Fetching product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full max-w-[480px] md:max-w-7xl mx-auto min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inventory_2</span>
                <h1 className="text-xl font-bold text-slate-900 mb-1">Product not found</h1>
                <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold">
                    Go Back
                </button>
            </div>
        );
    }

    const cfg = CATEGORY_CONFIG[product.category] ?? CATEGORY_CONFIG.Other;
    const imgUrl = media.find((m) => m.is_primary)?.media_url || media[0]?.media_url;
    const discountPct = product.sale_price && product.sale_price < product.price
        ? Math.round((1 - product.sale_price / product.price) * 100)
        : null;

    return (
        <div className="w-full bg-slate-50/40 min-h-screen">
            <div className="w-full max-w-[480px] md:max-w-none mx-auto bg-white min-h-screen md:shadow-none shadow-xl relative">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 md:py-0 border-b border-slate-100/80">
                    <div className="max-w-7xl mx-auto md:px-6 flex items-center justify-between h-auto md:h-16 gap-4">
                        <div className="hidden md:flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => router.push(ROUTES.CUSTOMER_DASHBOARD)}>
                            <span className="material-symbols-outlined text-primary text-3xl font-black">shopping_basket</span>
                            <span className="font-extrabold text-slate-800 text-lg tracking-tight">Marketnera</span>
                        </div>

                        <div className="flex-1 md:max-w-xl hidden md:flex items-center justify-start text-sm font-bold text-slate-500">
                            <span>Product Details</span>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                            {/* Desktop Cart Shortcut */}
                            <a
                                href={ROUTES.CUSTOMER_CART}
                                className="hidden md:flex relative w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center hover:shadow-md transition-shadow premium-hover text-slate-600 hover:text-primary"
                                title="Shopping Cart"
                            >
                                <span className="material-symbols-outlined">shopping_bag</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </a>

                            <button onClick={handleLogout} title="Log Out" className="relative w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow premium-hover text-slate-600 hover:text-red-500">
                                <span className="material-symbols-outlined transition-colors">logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)]">
                    {/* Left Sidebar */}
                    <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 px-4 py-6 sticky top-16 h-[calc(100vh-4rem)] bg-white shrink-0">
                        <nav className="space-y-1.5 flex-1">
                            <a
                                href={ROUTES.CUSTOMER_DASHBOARD}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">home</span>
                                Home
                            </a>
                            <a
                                href="/customer/shops"
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">storefront</span>
                                Shops
                            </a>
                            <a
                                href={ROUTES.CUSTOMER_CART}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">shopping_bag</span>
                                My Cart
                            </a>
                            <a
                                href={ROUTES.CUSTOMER_ORDERS}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">receipt_long</span>
                                Orders
                            </a>
                            <a
                                href={ROUTES.CUSTOMER_PROFILE}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all duration-300"
                            >
                                <span className="material-symbols-outlined">person</span>
                                Profile
                            </a>
                        </nav>
                    </aside>

                    {/* Product Details Section */}
                    <main className="flex-grow min-w-0 pb-24 md:pb-8 md:px-8 py-6 px-4">
                        {/* Back navigation */}
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-primary text-xs font-bold mb-6 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Back
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Product Image Frame */}
                            <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative p-6 border border-slate-100 shadow-sm">
                                {imgUrl ? (
                                    <Image
                                        alt={product.name}
                                        src={imgUrl}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-contain"
                                        unoptimized
                                    />
                                ) : (
                                    <div className={`w-full h-full ${cfg.bg} flex items-center justify-center rounded-3xl`}>
                                        <span className={`material-symbols-outlined text-[100px] ${cfg.text} opacity-30`}>{cfg.icon}</span>
                                    </div>
                                )}

                                {discountPct && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow">
                                        Save {discountPct}%
                                    </span>
                                )}

                                <button
                                    onClick={handleToggleWishlist}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <span className={`material-symbols-outlined text-2xl ${isWishlisted ? "fill-1 text-red-500" : ""}`}>
                                        favorite
                                    </span>
                                </button>
                            </div>

                            {/* Details Column */}
                            <div className="flex flex-col h-full">
                                <span className={`self-start bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3`}>
                                    {product.category}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                                    {product.name}
                                </h1>
                                {product.unit_type && (
                                    <p className="text-sm font-semibold text-slate-400 mb-4">Pack size: {product.unit_type}</p>
                                )}

                                {/* Price block */}
                                <div className="flex items-baseline gap-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 self-start">
                                    <span className="text-3xl font-black text-slate-900">
                                        ₹{product.sale_price ?? product.price}
                                    </span>
                                    {product.sale_price && product.sale_price < product.price && (
                                        <span className="text-sm text-slate-400 line-through font-bold">
                                            ₹{product.price}
                                        </span>
                                    )}
                                </div>

                                {/* Shop Referral */}
                                {shop && (
                                    <div
                                        onClick={() => router.push(`/shop/${shop.user_id}`)}
                                        className="flex items-center gap-3 p-4 bg-white border border-slate-150 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 mb-6 shadow-sm group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-2xl">storefront</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Seller</p>
                                            <p className="text-sm font-black text-slate-800 truncate group-hover:text-primary transition-colors">{shop.shop_name}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                                            chevron_right
                                        </span>
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">Product Description</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {product.description || `Fresh and high-quality ${product.name.toLowerCase()} sourced directly from your local nearby seller.`}
                                    </p>
                                </div>

                                {/* Action button */}
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                                        isAdded
                                            ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                            : "bg-primary text-white shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                                    }`}
                                >
                                    <span className="material-symbols-outlined">
                                        {isAdded ? "shopping_cart_checkout" : "shopping_bag"}
                                    </span>
                                    {isAdded ? "GO TO CART" : "ADD TO CART"}
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
