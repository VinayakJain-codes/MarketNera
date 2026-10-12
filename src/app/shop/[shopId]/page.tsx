"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/customer/ProductCard";
import { getShopkeeperProfile, ShopkeeperProfile } from "@/lib/services/shopkeeper";
import {
    getLiveCatalogProducts,
    LiveCatalogProduct,
} from "@/lib/services/customerCatalog";
import { ROUTES } from "@/constants/routes";
import {
    Store,
    MapPin,
    Clock,
    Phone,
    ShieldCheck,
    Search,
    ArrowLeft,
    X,
    Package,
    Sparkles,
} from "lucide-react";

export default function ShopDetailPage({
    params,
}: {
    params: Promise<{ shopId: string }>;
}) {
    const { shopId } = use(params);
    const router = useRouter();

    const [shop, setShop] = useState<ShopkeeperProfile | null>(null);
    const [products, setProducts] = useState<LiveCatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchShopData() {
            setLoading(true);
            try {
                const [shopData, prodsData] = await Promise.all([
                    getShopkeeperProfile(shopId),
                    getLiveCatalogProducts({ shopId }),
                ]);

                if (isMounted) {
                    setShop(shopData);
                    setProducts(prodsData);
                }
            } catch (err) {
                console.error("Error loading shop detail:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchShopData();
        return () => {
            isMounted = false;
        };
    }, [shopId]);

    // Categories in this specific shop
    const shopCategories = Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
    );

    const filteredProducts = products.filter((p) => {
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
            !q ||
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            p.category.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between">
                <CustomerNavbar />
                <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-7xl space-y-6">
                    <div className="h-60 rounded-3xl bg-slate-200 animate-pulse" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 p-4 animate-pulse" />
                        ))}
                    </div>
                </main>
                <Footer />
                <CustomerBottomNav />
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between">
                <CustomerNavbar />
                <main className="container mx-auto px-4 py-16 text-center max-w-lg space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Store className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Store Not Found</h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        This store might be temporarily offline or does not exist.
                    </p>
                    <Link
                        href={ROUTES.CUSTOMER_SHOPS}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Stores</span>
                    </Link>
                </main>
                <Footer />
                <CustomerBottomNav />
            </div>
        );
    }

    const [cleanAddress, photoUrl] = (shop.address || "").split(" ||| ");
    const bannerImage = shop.banner_url || photoUrl;

    return (
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 pb-16 lg:pb-0">
            {/* Top Customer Navigation Bar */}
            <CustomerNavbar />

            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 space-y-6 sm:space-y-8 max-w-7xl">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Link href={ROUTES.HOME} className="hover:text-slate-900 transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href={ROUTES.CUSTOMER_SHOPS} className="hover:text-slate-900 transition-colors">
                        Stores
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900 font-bold truncate max-w-[200px]">
                        {shop.shop_name}
                    </span>
                </div>

                {/* 1. Storefront Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md border border-slate-800">
                    {/* Banner Photo Backdrop */}
                    {bannerImage ? (
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={bannerImage}
                                alt={shop.shop_name}
                                fill
                                unoptimized
                                priority
                                className="object-cover opacity-35"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900" />
                    )}

                    <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            {/* Badges strip */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Verified Merchant</span>
                                </span>

                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-white backdrop-blur-xs border border-white/20">
                                    {shop.category || "General Store"}
                                </span>

                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                                    <Clock className="w-3 h-3" />
                                    <span>15–30m Doorstep</span>
                                </span>
                            </div>

                            {/* Shop Name & Tagline */}
                            <div>
                                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                    {shop.shop_name}
                                </h1>
                                {shop.tagline && (
                                    <p className="text-sm sm:text-base text-slate-300 font-medium italic mt-1">
                                        "{shop.tagline}"
                                    </p>
                                )}
                            </div>

                            {/* Address & Phone */}
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300 font-medium pt-1">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>{cleanAddress || "Meerut, Uttar Pradesh"}</span>
                                </span>

                                {shop.phone && (
                                    <a
                                        href={`tel:+91${shop.phone}`}
                                        className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors"
                                    >
                                        <Phone className="w-3.5 h-3.5 shrink-0" />
                                        <span>+91 {shop.phone}</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right stats badge */}
                        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 min-w-[160px] space-y-1 shrink-0">
                            <span className="text-xs text-slate-400 font-semibold block">Store Inventory</span>
                            <p className="text-2xl font-black text-white">
                                {products.length} {products.length === 1 ? "Item" : "Items"}
                            </p>
                            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Direct shelf prices</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Store Catalog Header & Filters */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Search in this Store */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search items in ${shop.shop_name}...`}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all shadow-2xs"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label="Clear search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Item counts & Reset */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                            <span className="text-slate-500 font-medium">
                                Showing <strong>{filteredProducts.length}</strong> items
                            </span>

                            {(searchQuery || selectedCategory) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory(null);
                                    }}
                                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer underline underline-offset-2"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category tabs if store has multiple categories */}
                    {shopCategories.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                    selectedCategory === null
                                        ? "bg-emerald-700 text-white shadow-xs"
                                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                                }`}
                            >
                                All Products
                            </button>

                            {shopCategories.map((cat) => {
                                const isSelected = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                            isSelected
                                                ? "bg-emerald-700 text-white shadow-xs"
                                                : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 3. Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">No products available</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {products.length === 0
                                ? "This store hasn't published any products yet. Please check back later!"
                                : "No products matched your search or category filter in this shop."}
                        </p>
                        {(searchQuery || selectedCategory) && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory(null);
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                                Show All Shop Products
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <CustomerBottomNav />
        </div>
    );
}
