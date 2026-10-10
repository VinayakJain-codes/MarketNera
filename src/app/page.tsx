"use client";

import { useState, useRef } from "react";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerHeroBanner from "@/components/customer/CustomerHeroBanner";
import CustomerPromoCards from "@/components/customer/CustomerPromoCards";
import CustomerCategoryStrip from "@/components/customer/CustomerCategoryStrip";
import CustomerProductGrid from "@/components/customer/CustomerProductGrid";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants/routes";
import { Zap, ShieldCheck, Clock, Store, ArrowRight } from "lucide-react";

export default function CustomerHomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const catalogRef = useRef<HTMLDivElement>(null);

    const scrollToCatalog = () => {
        catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleSelectFilter = (slug: string) => {
        setSelectedCategory(slug);
        scrollToCatalog();
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
    };

    return (
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-display flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
            {/* Customer Navbar with Search & Navigation */}
            <CustomerNavbar
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                    setSearchQuery(q);
                    if (q.trim() && catalogRef.current) {
                        scrollToCatalog();
                    }
                }}
            />

            <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8 sm:space-y-12 max-w-7xl">
                {/* 1. Blinkit-Style Green Essentials Hero Banner */}
                <CustomerHeroBanner onShopNowClick={scrollToCatalog} />

                {/* 2. Three Quick-Delivery Promotional Cards */}
                <CustomerPromoCards onSelectFilter={handleSelectFilter} />

                {/* 3. Horizontal Category Quick-Nav Strip */}
                <CustomerCategoryStrip
                    selectedCategory={selectedCategory}
                    onSelectCategory={(slug) => {
                        setSelectedCategory(slug);
                        scrollToCatalog();
                    }}
                />

                {/* Trust Badges Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2.5 px-3 py-1.5">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-black text-slate-900">15-Minute Delivery</p>
                            <p className="text-[10px] text-slate-400 font-medium">To your doorstep</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-1.5">
                        <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                            <Store className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-black text-slate-900">Local Verified Stores</p>
                            <p className="text-[10px] text-slate-400 font-medium">Trusted neighborhood kiranas</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-1.5">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-black text-slate-900">Best Price Guarantee</p>
                            <p className="text-[10px] text-slate-400 font-medium">No hidden fees or markups</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-1.5">
                        <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-black text-slate-900">Easy UPI &amp; COD</p>
                            <p className="text-[10px] text-slate-400 font-medium">Pay on delivery or online</p>
                        </div>
                    </div>
                </div>

                {/* 4. Product Catalogue Grid (Anchor for scrolling) */}
                <div ref={catalogRef} className="pt-2">
                    <CustomerProductGrid
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                        onResetFilters={handleResetFilters}
                    />
                </div>

                {/* 5. Merchant Portal Callout Banner */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-3 text-center md:text-left max-w-2xl">
                            <span className="inline-block text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                Grow With MarketNera
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                                Own a local store? Register as a shopkeeper
                            </h2>
                            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                                Join hundreds of local kiranas, supermarkets, pharmacies, and specialty shops reaching thousands of digital customers in Meerut with zero setup fee.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            <a
                                href={ROUTES.SHOPS_HOME}
                                className="px-6 py-3.5 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <Store className="w-4 h-4" />
                                <span>Go to Merchant Portal</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer with legal & platform links */}
            <Footer />
        </div>
    );
}