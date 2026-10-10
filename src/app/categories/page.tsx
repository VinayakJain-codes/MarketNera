"use client";

import { useState, useEffect } from "react";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import Footer from "@/components/layout/Footer";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import ProductCard from "@/components/customer/ProductCard";
import {
    getLiveCatalogProducts,
    getLiveCategories,
    LiveCatalogProduct,
    LiveCategorySummary,
} from "@/lib/services/customerCatalog";
import { Tag, Store, ArrowRight, PackageOpen } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<LiveCategorySummary[]>([]);
    const [products, setProducts] = useState<LiveCatalogProduct[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setLoading(true);
            try {
                const [cats, prods] = await Promise.all([
                    getLiveCategories(),
                    getLiveCatalogProducts(),
                ]);

                if (isMounted) {
                    setCategories(cats);
                    setProducts(prods);
                }
            } catch (err) {
                console.error("Error loading categories page:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadData();
        return () => {
            isMounted = false;
        };
    }, []);

    const displayedProducts = selectedCategory
        ? products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
        : products;

    return (
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between pb-16 lg:pb-0">
            <CustomerNavbar />

            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 max-w-7xl">
                {/* Header */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            Departments &amp; Categories
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                        Product Categories
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                        Explore available inventory from neighborhood stores in Meerut
                    </p>
                </div>

                {/* Categories Pills */}
                {loading ? (
                    <div className="flex gap-2.5 overflow-x-auto pb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-10 w-32 rounded-xl bg-slate-200 animate-pulse shrink-0" />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white border border-slate-200">
                        <p className="text-xs text-slate-500">No categories found in the database.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                selectedCategory === null
                                    ? "bg-slate-900 text-white shadow-xs"
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            All Categories ({products.length})
                        </button>

                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat.name;
                            return (
                                <button
                                    key={cat.slug}
                                    onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        isSelected
                                            ? "bg-emerald-700 text-white shadow-xs"
                                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <span>{cat.name}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                                            isSelected ? "bg-emerald-800 text-emerald-100" : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Products Grid */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">
                            {selectedCategory ? `${selectedCategory} Products` : "All Listed Products"}
                        </h2>
                        <span className="text-xs text-slate-500">
                            {displayedProducts.length} {displayedProducts.length === 1 ? "item" : "items"} available
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-2">
                            <PackageOpen className="w-8 h-8 text-slate-400 mx-auto" />
                            <p className="text-xs font-bold text-slate-700">No products found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                            {displayedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Merchant Onboarding Strip */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            Are you a local shopkeeper or retailer in Meerut?
                        </h3>
                        <p className="text-xs text-slate-500">
                            List your products and start accepting customer orders with instant delivery.
                        </p>
                    </div>
                    <Link
                        href={ROUTES.SHOPS_HOME}
                        className="px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                        <Store className="w-3.5 h-3.5" />
                        <span>Register as Shopkeeper</span>
                    </Link>
                </div>
            </main>

            <Footer />
            <CustomerBottomNav />
        </div>
    );
}
