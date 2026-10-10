"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerHeroBanner from "@/components/customer/CustomerHeroBanner";
import CustomerCategoryStrip from "@/components/customer/CustomerCategoryStrip";
import CustomerProductGrid from "@/components/customer/CustomerProductGrid";
import NeighborhoodShops from "@/components/customer/NeighborhoodShops";
import Footer from "@/components/layout/Footer";
import {
    getLiveCatalogProducts,
    getLiveCategories,
    getLiveShops,
    LiveCatalogProduct,
    LiveCategorySummary,
    LiveShopSummary,
} from "@/lib/services/customerCatalog";
import { Clock, Store, ShieldCheck, Zap } from "lucide-react";

export default function CustomerHomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [products, setProducts] = useState<LiveCatalogProduct[]>([]);
    const [categories, setCategories] = useState<LiveCategorySummary[]>([]);
    const [shops, setShops] = useState<LiveShopSummary[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const catalogRef = useRef<HTMLDivElement>(null);
    const [, startTransition] = useTransition();

    // Fetch initial live database entities
    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            setLoadingData(true);
            try {
                const [prods, cats, shs] = await Promise.all([
                    getLiveCatalogProducts(),
                    getLiveCategories(),
                    getLiveShops(),
                ]);

                if (isMounted) {
                    setProducts(prods);
                    setCategories(cats);
                    setShops(shs);
                }
            } catch (err) {
                console.error("Failed to load catalog data:", err);
            } finally {
                if (isMounted) {
                    setLoadingData(false);
                }
            }
        }

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter or re-query when search or category changes
    useEffect(() => {
        let isMounted = true;

        async function filterProducts() {
            try {
                const filtered = await getLiveCatalogProducts({
                    category: selectedCategory,
                    search: searchQuery,
                });
                if (isMounted) {
                    setProducts(filtered);
                }
            } catch (err) {
                console.error("Failed to filter products:", err);
            }
        }

        const timer = setTimeout(() => {
            startTransition(() => {
                filterProducts();
            });
        }, 200);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [searchQuery, selectedCategory]);

    const scrollToCatalog = () => {
        catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
            {/* Top Customer Navigation Bar */}
            <CustomerNavbar
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                    setSearchQuery(q);
                    if (q.trim() && catalogRef.current) {
                        scrollToCatalog();
                    }
                }}
            />

            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8 sm:space-y-10 max-w-7xl">
                {/* 1. Production Quick-Commerce Hero Banner */}
                <CustomerHeroBanner
                    onShopNowClick={scrollToCatalog}
                    totalProducts={products.length}
                    totalShops={shops.length}
                />

                {/* 2. Live Category Strip (fetched directly from Supabase) */}
                <CustomerCategoryStrip
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => {
                        setSelectedCategory(cat);
                        scrollToCatalog();
                    }}
                    loading={loadingData}
                />

                {/* 3. Neighborhood Verified Stores (from database) */}
                <NeighborhoodShops shops={shops} loading={loadingData} />

                {/* 4. Value / Trust Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2.5 p-2">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                            <Clock className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">15–30m Doorstep</p>
                            <p className="text-[11px] text-slate-400 font-normal">Hyperlocal delivery</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                            <Store className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Verified Stores</p>
                            <p className="text-[11px] text-slate-400 font-normal">Direct from your street</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">MRP Guarantee</p>
                            <p className="text-[11px] text-slate-400 font-normal">Zero packaging surge</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                            <Zap className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Instant UPI &amp; COD</p>
                            <p className="text-[11px] text-slate-400 font-normal">Pay safely at delivery</p>
                        </div>
                    </div>
                </div>

                {/* 5. Live Product Catalogue Grid */}
                <div ref={catalogRef} className="pt-2">
                    <CustomerProductGrid
                        products={products}
                        loading={loadingData}
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                        onResetFilters={handleResetFilters}
                    />
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}