"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Clock,
    Store,
    ShieldCheck,
    Zap,
    ArrowRight,
    X,
    CheckCircle2,
    Sparkles,
    QrCode,
    Truck,
    BadgePercent,
    ExternalLink,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface CustomerValuePostersProps {
    onExploreCatalog?: () => void;
    onScrollToShops?: () => void;
}

type ModalType = "delivery" | "shops" | "mrp" | "payments" | "megapromo" | null;

export default function CustomerValuePosters({
    onExploreCatalog,
    onScrollToShops,
}: CustomerValuePostersProps) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const posters = [
        {
            id: "delivery",
            badge: "15–30m Express",
            badgeColor: "bg-emerald-600 text-white",
            borderColor: "hover:border-emerald-500 hover:shadow-emerald-500/10",
            glowColor: "from-emerald-500/10 to-transparent",
            tagline: "Hyperlocal Delivery",
            title: "15–30m Doorstep",
            description: "Direct dispatch from neighborhood stores to your door in 15–30 mins.",
            imageSrc: "/posters/doorstep-delivery.jpg",
            imageAlt: "15–30 Minute Doorstep Hyperlocal Delivery Poster",
            icon: Clock,
            accentBg: "bg-emerald-50 text-emerald-700",
            ctaText: "Order Now",
            action: () => {
                if (onExploreCatalog) {
                    onExploreCatalog();
                } else {
                    setActiveModal("delivery");
                }
            },
        },
        {
            id: "stores",
            badge: "Fresh & Local",
            badgeColor: "bg-emerald-600 text-white",
            borderColor: "hover:border-emerald-500 hover:shadow-emerald-500/10",
            glowColor: "from-emerald-500/10 to-transparent",
            tagline: "Direct From Your Street",
            title: "Fresh Groceries, Nearby Stores",
            description: "Fresh produce, dairy & daily essentials from trusted stores down your street.",
            imageSrc: "/posters/fresh-groceries-nearby-stores.png",
            imageAlt: "Fresh Groceries From Your Nearby Stores Poster",
            icon: Store,
            accentBg: "bg-emerald-50 text-emerald-700",
            ctaText: "Explore Stores",
            action: () => setActiveModal("shops"),
        },
        {
            id: "mrp",
            badge: "Zero Extra Surge",
            badgeColor: "bg-teal-600 text-white",
            borderColor: "hover:border-teal-500 hover:shadow-teal-500/10",
            glowColor: "from-teal-500/10 to-transparent",
            tagline: "Zero Packaging Surge",
            title: "MRP Guarantee",
            description: "Real offline store prices with zero hidden packaging or surge markups.",
            imageSrc: "/posters/mrp-guarantee.jpg",
            imageAlt: "MRP Guarantee Zero Packaging Surge Poster",
            icon: ShieldCheck,
            accentBg: "bg-teal-50 text-teal-700",
            ctaText: "Price Promise",
            action: () => setActiveModal("mrp"),
        },
        {
            id: "payments",
            badge: "100% Secure",
            badgeColor: "bg-indigo-600 text-white",
            borderColor: "hover:border-indigo-500 hover:shadow-indigo-500/10",
            glowColor: "from-indigo-500/10 to-transparent",
            tagline: "100% Encrypted & Safe",
            title: "Instant UPI & Digital Pay",
            description: "Fast checkout via Google Pay, PhonePe, Paytm UPI QR, cards, and net banking.",
            imageSrc: "/posters/instant-digital-payments.jpg",
            imageAlt: "Instant UPI and Digital Payments Poster",
            icon: Zap,
            accentBg: "bg-indigo-50 text-indigo-700",
            ctaText: "Payment Modes",
            action: () => setActiveModal("payments"),
        },
    ];

    return (
        <section className="space-y-4">
            {/* Header info strip with spotlight link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>MarketNera Guarantees</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                        Our Promises To You
                    </h2>
                </div>

                <button
                    onClick={() => setActiveModal("megapromo")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer w-fit"
                >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Campaign Poster</span>
                </button>
            </div>

            {/* Featured Interactive Campaign Poster Banner */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveModal("megapromo")}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveModal("megapromo");
                    }
                }}
                className="group relative overflow-hidden rounded-3xl border border-emerald-300/80 bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 shadow-lg hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300 cursor-pointer p-4 sm:p-6"
            >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="space-y-3 z-10 max-w-xl text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Featured MarketNera Campaign</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                            Fresh Groceries From Your Nearby Stores
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                            Order fresh produce, milk, dairy, and daily essentials from trusted neighborhood kiranas with fast, reliable 15–30 min delivery.
                        </p>
                        <div className="pt-1 flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md group-hover:scale-105">
                                <span>View Full Poster &amp; Details</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-xs font-semibold text-emerald-300/80 hidden sm:inline">
                                Click to enlarge
                            </span>
                        </div>
                    </div>

                    <div className="relative w-full lg:w-[460px] h-48 sm:h-60 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group-hover:scale-[1.02] transition-transform duration-500 bg-slate-950">
                        <Image
                            src="/posters/fresh-groceries-nearby-stores.png"
                            alt="Fresh Groceries From Your Nearby Stores Poster"
                            fill
                            unoptimized
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>

            {/* 4 Clickable Posters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {posters.map((poster) => {
                    const Icon = poster.icon;
                    return (
                        <div
                            key={poster.id}
                            role="button"
                            tabIndex={0}
                            onClick={poster.action}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    poster.action();
                                }
                            }}
                            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 active:scale-[0.985] ${poster.borderColor}`}
                        >
                            {/* Top Poster Visual Container */}
                            <div 
                                className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 shrink-0"
                                style={{ aspectRatio: "4/3" }}
                            >
                                <Image
                                    src={poster.imageSrc}
                                    alt={poster.imageAlt}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />

                                {/* Subtle top-to-bottom shading overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                                {/* Top Floating Badge */}
                                <div className="absolute top-2.5 left-2.5 z-10">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-xs ${poster.badgeColor}`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        <span>{poster.badge}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Content & CTA */}
                            <div className="p-3.5 space-y-2.5 flex flex-col justify-between grow bg-white">
                                <div>
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                                            {poster.title}
                                        </h3>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium mb-1.5">
                                        {poster.tagline}
                                    </p>
                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        {poster.description}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-900 group-hover:text-emerald-700 transition-colors inline-flex items-center gap-1.5">
                                        <span className={`p-1 rounded-md ${poster.accentBg}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                        </span>
                                        <span>{poster.ctaText}</span>
                                    </span>

                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 transition-all duration-200">
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ─── MODALS ─── */}

            {/* 1. Mega Promo Campaign Poster Modal */}
            {activeModal === "megapromo" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActiveModal(null)}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div 
                            className="relative w-full h-72 sm:h-[460px] overflow-hidden bg-slate-950"
                            style={{ aspectRatio: "16/9" }}
                        >
                            <Image
                                src="/posters/fresh-groceries-nearby-stores.png"
                                alt="Fresh Groceries From Your Nearby Stores - MarketNera Campaign Poster"
                                fill
                                unoptimized
                                sizes="(max-width: 1024px) 100vw, 900px"
                                className="object-contain"
                            />
                        </div>

                        <div className="p-6 bg-white space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                                        MarketNera Quick Commerce
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900">
                                        Fresh Groceries From Your Nearby Stores
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Local Stores • Fresh Produce • Milk &amp; Dairy • Daily Essentials • Fast &amp; Reliable Delivery in 15–30 mins.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={ROUTES.CUSTOMER_SHOPS}
                                        className="px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs shrink-0 cursor-pointer transition-all inline-flex items-center gap-1.5"
                                        onClick={() => setActiveModal(null)}
                                    >
                                        <Store className="w-4 h-4" />
                                        <span>Nearby Stores</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setActiveModal(null);
                                            onExploreCatalog?.();
                                        }}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5 justify-center"
                                    >
                                        <span>Order Now</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. MRP Price Guarantee Modal */}
            {activeModal === "mrp" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-teal-50 text-teal-700">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                                        Fair Price Commitment
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900">
                                        100% Genuine MRP Guarantee
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div 
                            className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-teal-100 shrink-0"
                            style={{ aspectRatio: "16/9" }}
                        >
                            <Image
                                src="/posters/mrp-guarantee.jpg"
                                alt="MRP Guarantee Poster"
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, 512px"
                                className="object-cover"
                            />
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-700">
                            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-900">₹0 Packaging Surge</p>
                                    <p className="text-slate-500 text-[11px]">
                                        We never add arbitrary packaging fees or handling surcharge charges to your basket.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <BadgePercent className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-900">Exact Shelf &amp; MRP Rates</p>
                                    <p className="text-slate-500 text-[11px]">
                                        You pay the exact printed price set directly by the verified neighborhood store.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-900">Transparent Physical Bill</p>
                                    <p className="text-slate-500 text-[11px]">
                                        Every order arrives with transparent itemized bills straight from the merchant.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Dismiss
                            </button>

                            <button
                                onClick={() => {
                                    setActiveModal(null);
                                    onExploreCatalog?.();
                                }}
                                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95 inline-flex items-center gap-1.5"
                            >
                                <span>Shop Fair Prices</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Instant UPI & Digital Payments Modal */}
            {activeModal === "payments" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                                        Digital Payment Security
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900">
                                        Instant UPI &amp; Digital Payments
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div 
                            className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-indigo-100 shrink-0"
                            style={{ aspectRatio: "16/9" }}
                        >
                            <Image
                                src="/posters/instant-digital-payments.jpg"
                                alt="Instant UPI & Digital Payments Poster"
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, 512px"
                                className="object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                    <QrCode className="w-4 h-4 text-indigo-600" />
                                    <span>Instant UPI &amp; QR</span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    Fast 1-click checkout with Google Pay, PhonePe, Paytm, or any UPI app.
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>Cards &amp; NetBanking</span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    Bank-grade 256-bit encrypted Razorpay checkout with instant refund safety.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => {
                                    setActiveModal(null);
                                    onExploreCatalog?.();
                                }}
                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95 inline-flex items-center gap-1.5"
                            >
                                <span>Shop With Safe Pay</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Verified Stores Info Modal */}
            {activeModal === "shops" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                                        Neighborhood Community
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900">
                                        Fresh Groceries, Nearby Stores
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div 
                            className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-emerald-100 shrink-0 bg-slate-950"
                            style={{ aspectRatio: "16/9" }}
                        >
                            <Image
                                src="/posters/fresh-groceries-nearby-stores.png"
                                alt="Fresh Groceries From Your Nearby Stores Poster"
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, 600px"
                                className="object-contain"
                            />
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Support local neighborhood merchants in Meerut. When you order on MarketNera, local stores pack fresh groceries, produce, milk, dairy, and essentials for reliable doorstep delivery in 15–30 minutes.
                        </p>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Close
                            </button>

                            <Link
                                href={ROUTES.CUSTOMER_SHOPS}
                                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5"
                                onClick={() => setActiveModal(null)}
                            >
                                <span>View All Stores</span>
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
