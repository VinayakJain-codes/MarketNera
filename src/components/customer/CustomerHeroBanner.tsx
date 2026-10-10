"use client";

import { ArrowRight, Clock, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface CustomerHeroBannerProps {
    onShopNowClick?: () => void;
    totalProducts?: number;
    totalShops?: number;
}

export default function CustomerHeroBanner({
    onShopNowClick,
    totalProducts = 0,
    totalShops = 0,
}: CustomerHeroBannerProps) {
    return (
        <section className="relative w-full overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md border border-slate-800">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 pointer-events-none" />

            <div className="relative p-6 sm:p-8 lg:p-10 z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Hyperlocal Delivery · Meerut</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Order from local stores in your neighborhood
                    </h1>

                    <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                        Groceries, dairy, and everyday essentials delivered directly from verified neighborhood merchants in 15 to 30 minutes.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                            onClick={onShopNowClick}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                            <span>Browse Catalogue</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <Link
                            href={ROUTES.SHOPS_HOME}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
                        >
                            <Store className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Partner As Shopkeeper</span>
                        </Link>
                    </div>
                </div>

                {/* Right stats pill */}
                <div className="flex md:flex-col gap-3 shrink-0">
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 min-w-[150px] space-y-1">
                        <span className="text-xs text-slate-400 font-semibold block">Active Merchants</span>
                        <p className="text-xl sm:text-2xl font-black text-white">
                            {totalShops > 0 ? `${totalShops} Verified` : "Local"}
                        </p>
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Direct store pickup</span>
                        </span>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 min-w-[150px] space-y-1">
                        <span className="text-xs text-slate-400 font-semibold block">Catalog Items</span>
                        <p className="text-xl sm:text-2xl font-black text-white">
                            {totalProducts > 0 ? `${totalProducts} Listed` : "Available"}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium">
                            Updated live by merchants
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
