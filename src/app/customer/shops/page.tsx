"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import { getLiveShops, LiveShopSummary } from "@/lib/services/customerCatalog";
import { ROUTES } from "@/constants/routes";
import {
    Store,
    MapPin,
    Clock,
    Search,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    X,
    Phone,
    SlidersHorizontal,
    ShoppingBag,
} from "lucide-react";

function CustomerShopsContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category");
    const initialQuery = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const [shops, setShops] = useState<LiveShopSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [, startTransition] = useTransition();

    useEffect(() => {
        let isMounted = true;
        async function fetchShops() {
            setLoading(true);
            try {
                const data = await getLiveShops();
                if (isMounted) {
                    setShops(data);
                }
            } catch (err) {
                console.error("Failed to load shops:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        fetchShops();
        return () => {
            isMounted = false;
        };
    }, []);

    // Unique category list derived from live shops
    const availableCategories = Array.from(
        new Set(shops.map((s) => s.category).filter(Boolean))
    );

    const filteredShops = shops.filter((shop) => {
        const matchesCategory = !selectedCategory || shop.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
            !q ||
            shop.name.toLowerCase().includes(q) ||
            shop.category.toLowerCase().includes(q) ||
            shop.address.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
    });

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 pb-28 lg:pb-0">
            {/* Top Customer Navigation Bar */}
            <CustomerNavbar
                searchQuery={searchQuery}
                onSearchChange={(q) => setSearchQuery(q)}
            />

            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8 max-w-7xl">
                {/* 1. Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 sm:p-8 md:p-10 text-white shadow-md border border-slate-800">
                    <div className="relative z-10 max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <Store className="w-3.5 h-3.5" />
                            <span>Neighborhood Merchant Network</span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Verified Local Stores in Meerut
                        </h1>

                        <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                            Order groceries, dairy, and daily essentials straight from your trusted street merchants. Packed fresh by local shopkeepers and delivered in 15–30 minutes.
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-300 font-semibold">
                            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/80">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{shops.length} Verified Stores</span>
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/80">
                                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                <span>15–30m Doorstep SLA</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Search & Category Filters Bar */}
                <div className="space-y-4">
                    {/* Search & Stats Strip */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by store name or category..."
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

                        {/* Stores Count & Reset */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                            <span className="text-slate-500 font-medium">
                                Showing <strong>{filteredShops.length}</strong> {filteredShops.length === 1 ? "store" : "stores"}
                            </span>

                            {(searchQuery || selectedCategory) && (
                                <button
                                    onClick={resetFilters}
                                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer underline underline-offset-2"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    {availableCategories.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                    selectedCategory === null
                                        ? "bg-emerald-700 text-white shadow-xs"
                                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                                }`}
                            >
                                All Categories
                            </button>

                            {availableCategories.map((cat) => {
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

                {/* 3. Stores Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-64 rounded-2xl bg-white border border-slate-200/80 p-4 animate-pulse space-y-3"
                            >
                                <div className="h-32 bg-slate-200 rounded-xl" />
                                <div className="h-4 bg-slate-200 rounded w-2/3" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filteredShops.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                            <Store className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">No stores found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            We couldn't find any stores matching your current search or category filter.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                            Show All Stores
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredShops.map((shop) => (
                            <Link
                                key={shop.id}
                                href={`/shop/${shop.id}`}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 active:scale-[0.99]"
                            >
                                {/* Top Banner Visual */}
                                <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800">
                                    {shop.banner_url ? (
                                        <Image
                                            src={shop.banner_url}
                                            alt={shop.name}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                                            <Store className="w-16 h-16 stroke-[1.2]" />
                                        </div>
                                    )}

                                    {/* Shading overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                                    {/* Top Left: Category Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-emerald-800 shadow-xs backdrop-blur-xs">
                                            {shop.category}
                                        </span>
                                    </div>

                                    {/* Top Right: SLA Delivery Badge */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/95 text-white shadow-xs">
                                            <Clock className="w-3 h-3" />
                                            <span>{shop.delivery_time_minutes}m</span>
                                        </span>
                                    </div>

                                    {/* Bottom Title on Image */}
                                    <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors truncate">
                                                {shop.name}
                                            </h3>
                                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                        </div>
                                        {shop.tagline && (
                                            <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                                                {shop.tagline}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Info Container */}
                                <div className="p-4 space-y-3 flex flex-col justify-between grow">
                                    <div className="space-y-1.5">
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{shop.address}</span>
                                        </p>

                                        {shop.phone && (
                                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span>+91 {shop.phone}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-600 flex items-center gap-1.5">
                                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>{shop.product_count} {shop.product_count === 1 ? "product" : "products"}</span>
                                        </span>

                                        <span className="text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                                            <span>Visit Store</span>
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* 4. Partner Banner */}
                <div className="rounded-3xl bg-emerald-50/70 border border-emerald-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                            Own a Store in Meerut?
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                            Expand your kirana with MarketNera online delivery
                        </h3>
                        <p className="text-xs text-slate-600 max-w-xl">
                            Join neighborhood merchants already serving nearby customers. Setup in 2 minutes with zero upfront fees.
                        </p>
                    </div>

                    <Link
                        href={ROUTES.SIGNUP_SHOPKEEPER}
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 transition-colors shadow-xs inline-flex items-center gap-1.5"
                    >
                        <span>Register as Shopkeeper</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <CustomerBottomNav />
        </div>
    );
}

export default function CustomerShopsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#fafaf9]" />}>
            <CustomerShopsContent />
        </Suspense>
    );
}
