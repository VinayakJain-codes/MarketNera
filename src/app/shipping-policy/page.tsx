import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalNav from "@/components/legal/LegalNav";
import legalConfig from "@/config/legal";
import { Truck, Clock, MapPin, Zap, AlertCircle, CheckCircle2, ShieldCheck, PhoneCall, Mail, Navigation } from "lucide-react";

export const metadata: Metadata = {
    title: "Shipping & Delivery Policy",
    description: "Marketnera's shipping and delivery policy — instant same-day local delivery target within 1 hour in Meerut, Uttar Pradesh.",
};

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Header Section */}
                <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md py-12 lg:py-16">
                    <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                            <span>Hyperlocal Logistics SLA</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Shipping & Delivery Policy
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                            How fast doorstep fulfillment works at Marketnera — neighborhood-first delivery powered by local shop networks and dedicated riders.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Valid from: September 2026
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                Service Area: Meerut, Uttar Pradesh, India
                            </span>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="mt-8 pt-4 border-t border-slate-100">
                            <LegalNav />
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="container mx-auto px-6 lg:px-20 max-w-5xl mt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Service Hero Banner */}
                            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 via-white to-blue-500/10 border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Same-Day Delivery within 1 Hour</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                            Target SLA for Meerut City
                                        </p>
                                    </div>
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Marketnera connects you with the shops right in your neighborhood. Eligible local orders are dispatched immediately after merchant preparation, with an average target doorstep delivery time of <strong>{legalConfig.deliveryTargetTime}</strong>.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        1
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Service Coverage Area</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        We currently fulfill and deliver orders exclusively within <strong>{legalConfig.deliveryCity}</strong> and designated municipal wards.
                                    </p>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                                        📍 <strong>Outside Service Boundary:</strong> Orders requesting delivery to locations outside our active service zone cannot be placed at checkout. We are actively expanding to neighboring cities including Agra and Kanpur.
                                    </div>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        2
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Delivery Timelines & Operating Hours</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Target 1-Hour SLA:</strong> Eligible orders are targeted for delivery within 1 hour once the seller accepts and packs the order.</li>
                                        <li><strong>Target vs. Guarantee:</strong> The 1-hour timeframe is an operational target, not an unconditional legal guarantee. Unforeseen traffic bottlenecks, extreme weather (e.g. monsoon rainfall), seller kitchen/inventory prep times, or peak holiday surges may cause extended transit times.</li>
                                        <li><strong>Live Tracking:</strong> Real-time delivery progress and estimated time of arrival (ETA) are clearly displayed on your order tracking dashboard.</li>
                                        <li><strong>Operating Hours:</strong> Orders are accepted and dispatched between <strong>{legalConfig.deliveryOperatingHours}</strong>. Orders placed outside operating hours will be scheduled and fulfilled the next morning when service resumes.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        3
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Delivery Charges & Thresholds</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        Any delivery fee is calculated transparently based on distance between the local merchant and your drop location, and is explicitly presented for your review before you make payment.
                                    </p>
                                    <p>
                                        Free delivery thresholds, merchant promo codes, or discounted distance tiers, when applicable, are dynamically calculated in the Cart Summary.
                                    </p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        4
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Customer Responsibilities</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>To ensure quick and successful delivery, customers must:</p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li>Provide a complete, accurate delivery address with flat/house number, street name, and recognizable local landmark.</li>
                                        <li>Keep the registered contact phone reachable during the fulfillment window for delivery partner calls.</li>
                                        <li>Be available at the premises to receive the order or authorize a household member to collect it.</li>
                                    </ul>
                                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900">
                                        ⚠️ <strong>Failed Contact / Inaccurate Address:</strong> If the delivery rider is unable to contact you after multiple attempts or cannot locate the premises due to incorrect details, the delivery may be aborted and the order cancelled without a refund.
                                    </div>
                                </div>
                            </section>

                            {/* Section 5 & 6 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        5 & 6
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Delays, Non-Delivery & Inspection on Arrival</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        <strong>Significant Delays & Non-Delivery:</strong> If your delivery is unusually delayed or cannot be completed due to logistics disruptions, please contact our dispatch team at <a href={`mailto:${legalConfig.supportEmail}`} className="text-primary font-bold hover:underline">{legalConfig.supportEmail}</a> or <a href={`tel:${legalConfig.supportPhone}`} className="text-primary font-bold hover:underline">{legalConfig.supportPhoneDisplay}</a>. Orders that we are unable to fulfill are refunded in full.
                                    </p>
                                    <p>
                                        <strong>Inspection on Delivery:</strong> Please promptly inspect the package upon receipt. In the rare event of damaged, defective, or incorrect items, document the issue and report it within <strong>{legalConfig.damageReportingHours}</strong> as stipulated in our <a href="/refund-policy" className="text-primary font-bold hover:underline">Refund & Exchange Policy</a>.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
                                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-primary" />
                                    Delivery Fast Facts
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Service Area:</span>
                                        <span className="font-bold text-slate-900">Meerut City, UP</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Target Speed:</span>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Within 1 Hour</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Operating Hours:</span>
                                        <span className="font-bold text-slate-900">7 AM – 11 PM IST</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Tracking:</span>
                                        <span className="font-bold text-slate-900">Live GPS Telemetry</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Unfulfilled Orders:</span>
                                        <span className="font-bold text-emerald-600">100% Refund</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-950 space-y-2">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <Navigation className="w-4 h-4 text-blue-600" />
                                        Track Active Order
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-blue-800">
                                        To check the real-time position of your rider, open your <a href="/customer/orders" className="font-bold underline">Customer Orders</a> screen.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
