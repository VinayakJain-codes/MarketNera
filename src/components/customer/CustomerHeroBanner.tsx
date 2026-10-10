"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface CustomerHeroBannerProps {
    onShopNowClick?: () => void;
}

export default function CustomerHeroBanner({ onShopNowClick }: CustomerHeroBannerProps) {
    return (
        <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#185a2b] via-[#1f7337] to-[#2c8d45] text-white shadow-xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center p-6 sm:p-10 lg:p-12 gap-8">
                {/* Left Text & CTA */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-6 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Hyperlocal Delivery In 15 Mins</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-sm">
                        Stock up on daily essentials
                    </h1>

                    <p className="text-emerald-100 text-sm sm:text-lg max-w-xl font-medium leading-relaxed">
                        Get farm-fresh goodness &amp; a range of exotic fruits, vegetables, eggs, dairy &amp; everyday pantry staples delivered directly to your doorstep.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                        <button
                            onClick={onShopNowClick}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-emerald-950 font-black text-sm sm:text-base shadow-xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                            <span>Shop Now</span>
                            <ArrowRight className="w-4 h-4 text-emerald-700" />
                        </button>

                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Over 1,200+ local products available</span>
                        </div>
                    </div>
                </div>

                {/* Right Image Composition matching Blinkit reference */}
                <div className="lg:col-span-5 relative flex justify-center items-center">
                    <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20 group">
                        <Image
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                            alt="Fresh organic fruits, vegetables, dairy and essentials"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        {/* Live Delivery Stamp */}
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 flex items-center justify-between text-slate-900 shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">⚡</span>
                                <div>
                                    <p className="text-xs font-black">Direct from Meerut Mandi</p>
                                    <p className="text-[11px] text-slate-500 font-medium">Harvested &amp; delivered fresh daily</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                                100% Genuine
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
