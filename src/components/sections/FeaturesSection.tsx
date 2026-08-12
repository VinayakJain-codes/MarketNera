"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Store,
    Zap,
    TrendingUp,
    CreditCard,
    Smartphone,
    MessageSquare,
    Navigation,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Clock,
    ShoppingBag,
    Bike,
    Layers,
    QrCode,
    Check,
} from "lucide-react";
import { features, whyTitle, whySubtext } from "@/content/home";
import { FeatureCategory } from "@/types";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

interface FilterTab {
    id: FeatureCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    countLabel: string;
}

const FILTER_TABS: FilterTab[] = [
    { id: "all", label: "All Features", icon: Layers, countLabel: "8 Core Modules" },
    { id: "shopkeeper", label: "For Shopkeepers", icon: Store, countLabel: "POS & Inventory" },
    { id: "customer", label: "For Shoppers", icon: ShoppingBag, countLabel: "30-Min Delivery" },
    { id: "delivery", label: "Delivery Fleet", icon: Bike, countLabel: "Smart GPS" },
    { id: "tech", label: "Security & Tech", icon: ShieldCheck, countLabel: "PWA & Escrow" },
];

export default function FeaturesSection() {
    const [activeTab, setActiveTab] = useState<FeatureCategory>("all");
    const [activeOrderStage, setActiveOrderStage] = useState(2); // for interactive delivery mock (0=Placed, 1=Packed, 2=On the Way, 3=Delivered)
    const [scannedBarcode, setScannedBarcode] = useState(false);

    const filteredFeatures = activeTab === "all"
        ? features
        : features.filter((f) => f.category === activeTab);

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#fdfaf6] via-white to-[#f5f9f6] py-20 lg:py-28" id="features">
            {/* Ambient Background Lights */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
                <div className="absolute -right-40 top-80 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px]" />
                <div className="absolute left-1/2 bottom-10 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#2D9E4B]/5 blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-20">
                {/* ─── Header ─── */}
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                        Complete Commerce Ecosystem
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
                    >
                        {whyTitle}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base text-slate-600 sm:text-lg leading-relaxed"
                    >
                        {whySubtext}
                    </motion.p>
                </div>

                {/* ─── Persona / Role Filter Tabs ─── */}
                <div className="mb-14 flex justify-center">
                    <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-md backdrop-blur-md">
                        {FILTER_TABS.map((tab) => {
                            const IconComponent = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm cursor-pointer ${
                                        isActive
                                            ? "bg-[#2D9E4B] text-slate-950 shadow-md shadow-[#2D9E4B]/20"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    <IconComponent className={`h-4 w-4 ${isActive ? "text-slate-950" : "text-slate-500"}`} />
                                    <span>{tab.label}</span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeFilterIndicator"
                                            className="hidden sm:inline-block rounded-full bg-slate-950/10 px-2 py-0.5 text-[10px] font-semibold text-slate-950"
                                        >
                                            {tab.countLabel}
                                        </motion.span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Bento Grid Showcase ─── */}
                <div className="space-y-8">
                    {/* Primary Hero Bento Row (Shown on 'all', 'shopkeeper', or 'customer') */}
                    {(activeTab === "all" || activeTab === "shopkeeper" || activeTab === "customer") && (
                        <div className="grid gap-8 lg:grid-cols-12">
                            {/* Hero Card 1: Shopkeeper Digital Storefront & Smart POS */}
                            {(activeTab === "all" || activeTab === "shopkeeper") && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className={`relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-white via-emerald-50/30 to-white p-7 lg:p-9 shadow-lg transition-all hover:shadow-2xl ${
                                        activeTab === "shopkeeper" ? "lg:col-span-12" : "lg:col-span-7"
                                    }`}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D9E4B]/15 text-[#2D9E4B] shadow-inner">
                                                <Store className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                                                    For Local Shop Owners
                                                </span>
                                                <h3 className="text-2xl font-black text-slate-900">
                                                    Instant Digital Storefront & Smart POS
                                                </h3>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                                            ⚡ &lt; 2 Mins Setup
                                        </span>
                                    </div>

                                    <p className="mb-7 text-sm leading-relaxed text-slate-600 sm:text-base">
                                        Transform your brick-and-mortar storefront into a 24/7 digital supermarket.
                                        Accept customer orders, print barcode invoices, update live stocks in real-time,
                                        and share your dedicated store link via WhatsApp or QR code.
                                    </p>

                                    {/* Interactive Mini POS Mockup Widget */}
                                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                                                <span className="text-xs font-bold text-slate-800">Gupta General Store</span>
                                                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                                    Live Store
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setScannedBarcode(!scannedBarcode)}
                                                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                                            >
                                                <QrCode className="h-3.5 w-3.5 text-[#2D9E4B]" />
                                                <span>{scannedBarcode ? "✓ Item Scanned" : "Scan Barcode"}</span>
                                            </button>
                                        </div>

                                        <div className="grid gap-2.5 sm:grid-cols-2">
                                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                                                <span className="font-semibold text-slate-700">Fresh Aashirvaad Atta 5kg</span>
                                                <span className="font-black text-slate-900">₹245</span>
                                            </div>
                                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                                                <span className="font-semibold text-slate-700">Amul Taaza Milk 500ml</span>
                                                <span className="font-black text-slate-900">₹28</span>
                                            </div>
                                        </div>

                                        {scannedBarcode && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="mt-2.5 flex items-center justify-between rounded-xl bg-emerald-50 p-2.5 text-xs border border-emerald-200 text-emerald-800 font-semibold"
                                            >
                                                <span>✨ Added: Fortune Mustard Oil 1L (Stock: 24 units)</span>
                                                <span className="font-black">₹160</span>
                                            </motion.div>
                                        )}

                                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                            <span className="text-slate-500">Live Today: <strong className="text-slate-800">42 Orders</strong></span>
                                            <span className="text-emerald-700 font-extrabold">Gross Revenue: ₹18,420</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                            <CheckCircle2 className="h-4 w-4 text-[#2D9E4B]" />
                                            <span>No commission on first 50 orders</span>
                                        </div>
                                        <Link
                                            href={ROUTES.SIGNUP_SHOPKEEPER}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#2D9E4B] px-5 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-[#268840] hover:shadow-md"
                                        >
                                            <span>Claim Your Shop Link</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* Hero Card 2: Lightning 30-Minute Hyperlocal Delivery */}
                            {(activeTab === "all" || activeTab === "customer") && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className={`relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-white via-orange-50/30 to-white p-7 lg:p-9 shadow-lg transition-all hover:shadow-2xl ${
                                        activeTab === "customer" ? "lg:col-span-12" : "lg:col-span-5"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-600 shadow-inner">
                                                <Zap className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                                                    For Hyperlocal Shoppers
                                                </span>
                                                <h3 className="text-xl font-black text-slate-900">
                                                    30-Min Local Delivery
                                                </h3>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                                            ⚡ Ultra Fast
                                        </span>
                                    </div>

                                    <p className="mb-6 text-sm leading-relaxed text-slate-600">
                                        Why wait days for packages when your neighborhood stores have everything in stock right now?
                                        Real-time rider dispatch directly from your favorite local shops.
                                    </p>

                                    {/* Interactive Live Delivery Stage Indicator */}
                                    <div className="rounded-2xl border border-orange-200/80 bg-white p-4 shadow-sm">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
                                            <span className="flex items-center gap-1.5 text-orange-600">
                                                <Bike className="h-4 w-4" /> Live Tracking
                                            </span>
                                            <span className="rounded bg-orange-50 px-2 py-0.5 text-orange-700 font-extrabold">
                                                ETA: 14 Mins
                                            </span>
                                        </div>

                                        {/* Progress Timeline */}
                                        <div className="relative mb-3 flex items-center justify-between">
                                            <div className="absolute left-3 right-3 top-3 h-0.5 bg-slate-200 -z-0" />
                                            <div
                                                className="absolute left-3 top-3 h-0.5 bg-orange-500 transition-all duration-500 -z-0"
                                                style={{ width: `${(activeOrderStage / 3) * 100}%` }}
                                            />
                                            {["Placed", "Packed", "On Way", "Delivered"].map((stage, idx) => (
                                                <button
                                                    key={stage}
                                                    onClick={() => setActiveOrderStage(idx)}
                                                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                                                    title={`Click to preview ${stage} status`}
                                                >
                                                    <div
                                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                                                            idx <= activeOrderStage
                                                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-110"
                                                                : "bg-slate-200 text-slate-500"
                                                        }`}
                                                    >
                                                        {idx <= activeOrderStage ? <Check className="h-3 w-3" /> : idx + 1}
                                                    </div>
                                                    <span className="mt-1 text-[10px] font-bold text-slate-600">{stage}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="rounded-xl bg-orange-50/70 p-2.5 text-center text-xs text-orange-950 font-medium">
                                            {activeOrderStage === 0 && "🛒 Order received by Sharma Kirana Store."}
                                            {activeOrderStage === 1 && "📦 Items packed & verified fresh by merchant."}
                                            {activeOrderStage === 2 && "🛵 Rider Vikram is 1.2km away with your bag!"}
                                            {activeOrderStage === 3 && "🎉 Order handed over safely with OTP verification."}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500">Live in your neighborhood</span>
                                        <Link
                                            href={ROUTES.MARKETPLACE}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                                        >
                                            <span>Browse Nearby Stores</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* ─── Grid of Core Capabilities ─── */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredFeatures.map((feature) => {
                                // Resolve Lucide Icon
                                const IconComp = getFeatureIcon(feature.icon);

                                return (
                                    <div
                                        key={feature.title}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/30 hover:shadow-xl"
                                    >
                                        {/* Subtle top accent bar */}
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#2D9E4B]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div>
                                            {/* Icon & Badge Row */}
                                            <div className="mb-5 flex items-center justify-between">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 transition-colors duration-300 group-hover:bg-[#2D9E4B]/15 group-hover:text-[#2D9E4B]">
                                                    <IconComp className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                                                </div>
                                                {feature.badge && (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
                                                        {feature.badge}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title & Description */}
                                            <h4 className="mb-2 text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#2D9E4B] transition-colors">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm leading-relaxed text-slate-600">
                                                {feature.description}
                                            </p>
                                        </div>

                                        {/* Feature Stat & Action Footer */}
                                        <div className="mt-6 border-t border-slate-100 pt-4">
                                            {feature.stat && (
                                                <div className="mb-3 flex items-baseline justify-between text-xs">
                                                    <span className="text-slate-500">{feature.stat.label}</span>
                                                    <span className="font-extrabold text-[#2D9E4B] text-sm">
                                                        {feature.stat.value}
                                                    </span>
                                                </div>
                                            )}

                                            {feature.highlight && (
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2D9E4B]" />
                                                    <span>{feature.highlight}</span>
                                                </div>
                                            )}

                                            {feature.action && (
                                                <div className="mt-4">
                                                    <Link
                                                        href={feature.action.href}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-[#2D9E4B] transition-colors"
                                                    >
                                                        <span>{feature.action.label}</span>
                                                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ─── Platform Impact & Performance Counters Strip ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 rounded-3xl border border-slate-200/90 bg-slate-900 p-8 lg:p-12 text-white shadow-xl"
                >
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-[#2D9E4B]">
                                <Clock className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">&lt; 30 Mins</p>
                                <p className="text-xs font-medium text-slate-400">Average Local Delivery Time</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
                                <Store className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">5,000+</p>
                                <p className="text-xs font-medium text-slate-400">Onboarded Neighborhood Shops</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">3.2x</p>
                                <p className="text-xs font-medium text-slate-400">Average Daily Revenue Boost</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">99.9%</p>
                                <p className="text-xs font-medium text-slate-400">Escrow Security & SLA Uptime</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA bar inside stats */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                        <p className="text-sm text-slate-300 text-center sm:text-left">
                            Ready to grow your shop or shop from local neighborhood businesses today?
                        </p>
                        <div className="flex items-center gap-3">
                            <Link
                                href={ROUTES.SIGNUP_SHOPKEEPER}
                                className="rounded-xl bg-[#2D9E4B] px-5 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-[#268840] hover:scale-105"
                            >
                                Register Your Store
                            </Link>
                            <Link
                                href={ROUTES.MARKETPLACE}
                                className="rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20"
                            >
                                Shop Near You
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/** Helper icon matcher */
function getFeatureIcon(iconName: string): React.ComponentType<{ className?: string }> {
    switch (iconName?.toLowerCase()) {
        case "store":
        case "storefront":
            return Store;
        case "zap":
        case "bolt":
            return Zap;
        case "trendingup":
        case "trending_up":
        case "insights":
            return TrendingUp;
        case "creditcard":
        case "payments":
            return CreditCard;
        case "smartphone":
        case "phonelink_ring":
            return Smartphone;
        case "messagesquare":
        case "chat":
            return MessageSquare;
        case "navigation":
        case "near_me":
            return Navigation;
        case "shieldcheck":
        case "verified_user":
            return ShieldCheck;
        default:
            return Sparkles;
    }
}
