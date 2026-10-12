"use client";

import { LiveCatalogProduct } from "@/lib/services/customerCatalog";
import ProductCard from "@/components/customer/ProductCard";
import { PackageOpen, Store, ArrowRight, RefreshCw } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

interface CustomerProductGridProps {
    products: LiveCatalogProduct[];
    loading?: boolean;
    searchQuery?: string;
    selectedCategory?: string | null;
    onResetFilters?: () => void;
}

export default function CustomerProductGrid({
    products,
    loading = false,
    searchQuery = "",
    selectedCategory = null,
    onResetFilters,
}: CustomerProductGridProps) {
    // Loading skeleton grid
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-6 w-48 bg-slate-200/80 rounded-lg animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <div
                            key={n}
                            className="rounded-2xl border border-slate-200/60 bg-white p-3 space-y-3 animate-pulse"
                        >
                            <div className="aspect-square w-full rounded-xl bg-slate-100" />
                            <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                            <div className="h-8 bg-slate-100 rounded-lg w-full mt-2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (!products || products.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 sm:p-14 text-center space-y-4 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                    <PackageOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                        {searchQuery
                            ? `No products found for "${searchQuery}"`
                            : selectedCategory
                            ? `No items currently listed in "${selectedCategory}"`
                            : "No products available in this area yet"}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Local merchants regularly update inventory and restock daily essentials.
                    </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    {Boolean(searchQuery || selectedCategory) && (
                        <button
                            onClick={onResetFilters}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Clear Filters</span>
                        </button>
                    )}

                    <Link
                        href={ROUTES.SIGNUP_SHOPKEEPER}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                    >
                        <Store className="w-3.5 h-3.5" />
                        <span>Are you a local shopkeeper? Register your shop</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {selectedCategory ? `${selectedCategory}` : "Available in Your Neighborhood"}
                    </h2>
                    <p className="text-xs text-slate-500">
                        Showing {products.length} {products.length === 1 ? "item" : "items"} from verified local stores
                    </p>
                </div>

                {Boolean(searchQuery || selectedCategory) && (
                    <button
                        onClick={onResetFilters}
                        className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                        Show all products
                    </button>
                )}
            </div>

            {/* Live Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
