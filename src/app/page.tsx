"use client";

import { useState, useEffect, useRef, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerHeroBanner from "@/components/customer/CustomerHeroBanner";
import CustomerCategoryStrip from "@/components/customer/CustomerCategoryStrip";
import CustomerProductGrid from "@/components/customer/CustomerProductGrid";
import NeighborhoodShops from "@/components/customer/NeighborhoodShops";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import {
    getLiveCatalogProducts,
    getLiveCategories,
    getLiveShops,
    LiveCatalogProduct,
    LiveCategorySummary,
    LiveShopSummary,
} from "@/lib/services/customerCatalog";

function CustomerHomePageContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category");
    const initialQuery = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

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
                    getLiveCatalogProducts({
                        category: selectedCategory,
                        search: searchQuery,
                    }),
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
        }, 150);

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
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 pb-28 lg:pb-0">
            {/* Top Customer Navigation Bar */}
            <CustomerNavbar
                searchQuery={searchQuery}
                onSearchChange={(q) => setSearchQuery(q)}
            />

            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8 space-y-6 sm:space-y-10 max-w-7xl">
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
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    loading={loadingData}
                />

                {/* 3. Neighborhood Verified Stores (from database) */}
                <NeighborhoodShops shops={shops} loading={loadingData} />

                {/* 4. Live Product Catalogue Grid */}
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

            {/* Mobile Bottom Navigation */}
            <CustomerBottomNav />
        </div>
    );
}

export default function CustomerHomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#fafaf9]" />}>
            <CustomerHomePageContent />
        </Suspense>
    );
}