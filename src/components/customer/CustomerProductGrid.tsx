"use client";

import { useMemo } from "react";
import { CATALOG_PRODUCTS, CatalogProduct, CUSTOMER_CATEGORIES } from "@/content/customer";
import ProductCard from "@/components/customer/ProductCard";
import { ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface CustomerProductGridProps {
    searchQuery?: string;
    selectedCategory?: string | null;
    onResetFilters?: () => void;
}

export default function CustomerProductGrid({
    searchQuery = "",
    selectedCategory = null,
    onResetFilters,
}: CustomerProductGridProps) {
    // Filter products based on search and selected category
    const filteredProducts = useMemo(() => {
        let list = CATALOG_PRODUCTS;

        if (selectedCategory) {
            list = list.filter((p) => p.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand?.toLowerCase().includes(q) ||
                    p.shopName.toLowerCase().includes(q)
            );
        }

        return list;
    }, [searchQuery, selectedCategory]);

    // Grouping by categories if no specific search or filter is active
    const isFiltered = Boolean(selectedCategory || searchQuery.trim());

    const shelves = useMemo(() => {
        if (isFiltered) return [];

        const dairy = CATALOG_PRODUCTS.filter((p) => p.category === "dairy-bread-eggs");
        const fresh = CATALOG_PRODUCTS.filter((p) => p.category === "fruits-vegetables");
        const snacks = CATALOG_PRODUCTS.filter(
            (p) => p.category === "snacks-munchies" || p.category === "breakfast-instant"
        );
        const drinks = CATALOG_PRODUCTS.filter((p) => p.category === "cold-drinks-juices");
        const pharmacy = CATALOG_PRODUCTS.filter((p) => p.category === "pharmacy");

        return [
            {
                title: "Dairy, Bread & Morning Essentials",
                subtitle: "Fresh milk, brown breads, butter and eggs delivered at 7 AM",
                icon: "🥛",
                products: dairy,
            },
            {
                title: "Fresh Vegetables & Fruits",
                subtitle: "Direct from verified local Mandi farms",
                icon: "🥦",
                products: fresh,
            },
            {
                title: "Snacks, Namkeen & Quick Bites",
                subtitle: "Crispy chips, noodles, and evening munchies",
                icon: "🍿",
                products: snacks,
            },
            {
                title: "Cold Drinks, Colas & Juices",
                subtitle: "Chilled beverages ready to refresh",
                icon: "🥤",
                products: drinks,
            },
            {
                title: "Pharmacy & Wellness First Aid",
                subtitle: "Everyday healthcare delivered safely in 15 mins",
                icon: "💊",
                products: pharmacy,
            },
        ];
    }, [isFiltered]);

    return (
        <section className="w-full space-y-12">
            {/* If filtered or searched, show direct unified grid */}
            {isFiltered ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span>Showing Products</span>
                                {selectedCategory && (
                                    <span className="text-sm font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full capitalize">
                                        {selectedCategory.replace(/-/g, " ")}
                                    </span>
                                )}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                Found {filteredProducts.length} items available in your area
                            </p>
                        </div>

                        <button
                            onClick={onResetFilters}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                        >
                            Reset filters
                        </button>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                            <h3 className="text-lg font-black text-slate-800">No items match your query</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Try searching for common terms like milk, chips, eggs, or check other categories.
                            </p>
                            <button
                                onClick={onResetFilters}
                                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                            >
                                Clear Search &amp; Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Shelved Sections */
                <div className="space-y-12">
                    {shelves.map((shelf) => (
                        <div key={shelf.title} className="space-y-4">
                            {/* Shelf Header */}
                            <div className="flex items-end justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                        <span>{shelf.icon}</span>
                                        <span>{shelf.title}</span>
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                        {shelf.subtitle}
                                    </p>
                                </div>

                                <a
                                    href={ROUTES.CATEGORIES}
                                    className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 group"
                                >
                                    <span>See more</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            </div>

                            {/* Product Shelf Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3.5 sm:gap-5">
                                {shelf.products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
