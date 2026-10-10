import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalNav from "@/components/legal/LegalNav";
import legalConfig from "@/config/legal";
import { RefreshCw, Clock, Building2, AlertTriangle, CheckCircle2, XCircle, PhoneCall, Mail, PackageX, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Refund & Exchange Policy",
    description: "Marketnera's refund, return, exchange, and cancellation policy for hyperlocal orders in Meerut.",
};

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Header Section */}
                <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md py-12 lg:py-16">
                    <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                            <span>Transparent Customer Safeguards</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Refund & Exchange Policy
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                            Clear, upfront guidelines on returns, replacements, failed payments, and order cancellations for Marketnera orders.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Valid from: September 2026
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                Meerut, Uttar Pradesh, India
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
                            {/* Policy Warning Banner */}
                            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h3 className="font-black text-amber-900 text-sm uppercase tracking-wide">
                                        All Purchases Are Final
                                    </h3>
                                    <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                                        Because Marketnera delivers freshly sourced local goods, perishable items, and on-demand merchant inventory within 1 hour in Meerut, purchases are final once prepared. Exceptions are strictly limited to damaged items, failed payments, or non-delivery.
                                    </p>
                                </div>
                            </div>

                            {/* Section 1 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        1
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">No Refunds or Exchanges for Change of Mind</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        All purchases made on Marketnera are final. We do not offer returns, refunds, or product exchanges for:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li>Change of mind after order confirmation.</li>
                                        <li>Ordering the wrong size, color, flavor, variant, or quantity by mistake.</li>
                                        <li>Dissatisfaction with personal taste or preference when the product accurately matches its listing description and photos.</li>
                                        <li>Perishable food items, fresh produce, opened personal hygiene goods, and medicines once delivered intact.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        2
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Valid Exceptions for Refunds or Replacements</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                                    <p>
                                        Refunds, store credits, or free replacements apply exclusively in the following verified circumstances:
                                    </p>

                                    <div className="grid gap-3">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span>Failed or Duplicate Payment</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                                                Money was deducted from your bank/UPI account but the order failed to generate, or you were debited multiple times. The excess amount will automatically reverse to your original payment method in <strong>{legalConfig.refundWindowDays} business days</strong> via Razorpay.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span>Order Cancelled by Merchant or Platform</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                                                If the local merchant runs out of stock, detects a pricing mistake, or cannot fulfill the order, a 100% full refund is initiated instantly.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span>Non-Delivery</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                                                The order was accepted but could not be delivered to you due to partner fleet failure or insurmountable logistical disruption. Full 100% refund guaranteed.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span>Damaged, Defective, or Wrong Item Delivered</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                                                Report the issue within <strong>{legalConfig.damageReportingHours}</strong> of doorstep receipt along with unboxing photos or video and your Order ID. We will promptly dispatch a replacement or issue a full refund upon verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        3
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Order Cancellation Window</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        Orders may only be cancelled <strong>prior to seller acceptance and dispatch</strong>. Because neighborhood merchants in Meerut prepare and dispatch items within minutes to maintain our 1-hour target delivery speed, cancellations are strictly not permitted once the shopkeeper begins packing or hands over the package to the delivery rider.
                                    </p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        4
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">How to Report an Issue</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
                                    <p>To lodge a damage or refund claim, please provide:</p>
                                    <ol className="list-decimal list-inside space-y-1.5 pl-2 text-sm">
                                        <li>Your Order ID (found in Customer Orders dashboard or invoice SMS).</li>
                                        <li>High-clarity photographs or video displaying the defective or damaged package/product.</li>
                                        <li>A brief description of the discrepancy.</li>
                                    </ol>

                                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                        <a
                                            href={`mailto:${legalConfig.supportEmail}`}
                                            className="p-4 rounded-xl border border-slate-200 hover:border-primary bg-slate-50/50 hover:bg-white transition-all flex items-center gap-3 group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Email Us</span>
                                                <span className="text-sm font-black text-slate-800">{legalConfig.supportEmail}</span>
                                            </div>
                                        </a>

                                        <a
                                            href={`tel:${legalConfig.supportPhone}`}
                                            className="p-4 rounded-xl border border-slate-200 hover:border-primary bg-slate-50/50 hover:bg-white transition-all flex items-center gap-3 group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                                                <PhoneCall className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Support Helpline</span>
                                                <span className="text-sm font-black text-slate-800">{legalConfig.supportPhoneDisplay}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <p className="text-xs text-slate-500 italic">
                                        * Note: Claims submitted after the {legalConfig.damageReportingHours} window will be ineligible for review.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
                                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-primary" />
                                    Refund Snapshot
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Change of mind:</span>
                                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Not Eligible</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Damaged items:</span>
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Refund or Replace</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Damage reporting:</span>
                                        <span className="font-bold text-slate-800">Within {legalConfig.damageReportingHours}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Refund processing:</span>
                                        <span className="font-bold text-slate-800">{legalConfig.refundWindowDays} business days</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Merchant cancellation:</span>
                                        <span className="font-bold text-emerald-600">100% Full Refund</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-xs text-orange-950 space-y-2">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <HelpCircle className="w-4 h-4 text-orange-600" />
                                        Order Issue?
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-orange-800">
                                        Have your Order ID ready and write to{" "}
                                        <a href={`mailto:${legalConfig.supportEmail}`} className="font-bold underline">
                                            {legalConfig.supportEmail}
                                        </a>.
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
