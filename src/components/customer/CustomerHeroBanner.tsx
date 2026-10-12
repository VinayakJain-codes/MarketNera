"use client";

import Image from "next/image";
import { ArrowRight, Sparkles, Store } from "lucide-react";
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
        <section className="relative w-full space-y-3">
            {/* Clickable Showcase Promotional Banner */}
            <div
                role="button"
                tabIndex={0}
                onClick={onShopNowClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onShopNowClick?.();
                    }
                }}
                className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-100/80 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-emerald-950/5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Fresh Groceries From Your Nearby Stores - Click to browse catalogue"
            >
                {/* Responsive 3:2 Promotional Poster Image */}
                <div className="relative w-full aspect-[3/2] overflow-hidden">
                    <Image
                        src="/posters/fresh-groceries-nearby-stores.png"
                        alt="MarketNera - Fresh Groceries From Your Nearby Stores. Fast & Reliable Hyperlocal Delivery in Meerut"
                        fill
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                    />

                    {/* Subtle hover gradient depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Floating Quick Action CTA Button */}
                    <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-10">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShopNowClick?.();
                            }}
                            className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/30 transition-all transform group-hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <span>Browse Catalogue</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* Floating Live Badge (desktop & tablet) */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-white/60 shadow-xs text-xs font-bold text-slate-800">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>15–30m Doorstep Delivery</span>
                    </div>
                </div>
            </div>

            {/* Quick Strip Below Banner: Active Stats & Partner CTA */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 sm:gap-4 font-semibold flex-wrap">
                    <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{totalShops > 0 ? `${totalShops} Verified Stores` : "Verified Local Stores"}</span>
                    </span>
                    <span className="hidden sm:inline-block text-slate-400">•</span>
                    <span className="text-slate-600">
                        {totalProducts > 0 ? `${totalProducts}+ Catalog Items Listed` : "Daily fresh produce & essentials"}
                    </span>
                </div>

                <Link
                    href={ROUTES.SIGNUP_SHOPKEEPER}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors ml-auto sm:ml-0"
                >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Own a store? Partner as Shopkeeper</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>
    );
}
