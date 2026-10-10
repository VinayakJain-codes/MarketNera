"use client";

import { LiveCategorySummary } from "@/lib/services/customerCatalog";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

interface CustomerCategoryStripProps {
    categories: LiveCategorySummary[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
    loading?: boolean;
}

export default function CustomerCategoryStrip({
    categories,
    selectedCategory,
    onSelectCategory,
    loading = false,
}: CustomerCategoryStripProps) {
    if (loading) {
        return (
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="h-9 w-28 rounded-xl bg-slate-200/70 animate-pulse shrink-0"
                    />
                ))}
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                        Browse by Category
                    </h2>
                </div>
                <Link
                    href={ROUTES.CATEGORIES}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                >
                    <span>All Categories</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Clean, authentic category chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === null
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                    All Items
                </button>

                {categories.map((cat) => {
                    const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
                    return (
                        <button
                            key={cat.slug}
                            onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                    ? "bg-emerald-700 text-white shadow-xs"
                                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            <span>{cat.name}</span>
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                                    isSelected
                                        ? "bg-emerald-800 text-emerald-100"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {cat.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
