"use client";

import Image from "next/image";
import { CUSTOMER_CATEGORIES } from "@/content/customer";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface CustomerCategoryStripProps {
    selectedCategory?: string | null;
    onSelectCategory?: (slug: string | null) => void;
}

export default function CustomerCategoryStrip({
    selectedCategory,
    onSelectCategory,
}: CustomerCategoryStripProps) {
    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Explore Categories</span>
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            Fast 15m Delivery
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Select a category to quickly filter local store inventories
                    </p>
                </div>

                <a
                    href={ROUTES.CATEGORIES}
                    className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                </a>
            </div>

            {/* Horizontal Scrollable Categories Strip */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
                {/* "All" category button */}
                <button
                    onClick={() => onSelectCategory?.(null)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl w-24 sm:w-28 border transition-all cursor-pointer ${
                        selectedCategory === null
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                            : "bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                    }`}
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-100/60 flex items-center justify-center text-xl mb-1.5">
                        ⚡
                    </div>
                    <span className="text-xs font-black text-center truncate w-full">
                        All Items
                    </span>
                    <span className="text-[10px] opacity-75 font-semibold">
                        Catalogue
                    </span>
                </button>

                {CUSTOMER_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory?.(isSelected ? null : cat.slug)}
                            className={`flex-shrink-0 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl w-24 sm:w-28 border transition-all cursor-pointer group ${
                                isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                                    : "bg-white text-slate-800 border-slate-200/80 hover:border-emerald-300 hover:shadow-sm"
                            }`}
                        >
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden mb-1.5 shadow-xs bg-slate-100">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span
                                className={`text-[11px] sm:text-xs font-black text-center leading-tight line-clamp-1 w-full ${
                                    isSelected ? "text-white" : "text-slate-800"
                                }`}
                            >
                                {cat.name.split(",")[0]}
                            </span>
                            <span
                                className={`text-[9px] font-semibold ${
                                    isSelected ? "text-emerald-100" : "text-slate-400"
                                }`}
                            >
                                {cat.itemCount || "In stock"}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
