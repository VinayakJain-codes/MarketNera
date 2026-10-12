import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalNav from "@/components/legal/LegalNav";
import legalConfig from "@/config/legal";
import { Store, Clock, Building2, Coins, ShieldCheck, AlertCircle, Ban, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Seller Terms & Merchant Agreement",
    description: "Terms and conditions for neighborhood shopkeepers and local merchant partners on the Marketnera platform in Meerut.",
};

export default function SellerTermsPage() {
    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Header Section */}
                <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md py-12 lg:py-16">
                    <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                            <Store className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Merchant Operating Agreement</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Seller Agreement & Terms
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                            These terms govern shopkeeper onboarding, product listing standards, commissions, settlement schedules, and merchant fulfillment obligations on {legalConfig.brandName}.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Valid from: September 2026
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                Meerut Merchant Network
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
                            {/* Preamble */}
                            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm leading-relaxed text-slate-700 text-sm sm:text-base">
                                <p>
                                    This <strong>Seller Agreement</strong> constitutes a binding agreement between <strong>{legalConfig.brandName}</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) and the registered shopkeeper or commercial establishment (&quot;Seller&quot;, &quot;Merchant&quot;). By creating a merchant account or listing products, you agree to abide by these operating standards.
                                </p>
                            </div>

                            {/* Section 1: Commissions & Platform Fee */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        1
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Commission & Transparent Pricing</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        Marketnera operates on a merchant-friendly model designed to empower local businesses in Meerut:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Zero Onboarding Fee:</strong> No hidden onboarding, registration, or catalog upload charges.</li>
                                        <li><strong>Commission Rates:</strong> Platform commissions are category-specific and agreed upon during digital store onboarding (typically between 0% to 5% based on item class).</li>
                                        <li><strong>Taxes:</strong> All merchant payouts are net of statutory GST and Tax Deducted at Source (TDS) under Section 194-O of the Indian Income Tax Act where applicable.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2: Payout Schedule */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        2
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Payout Schedule & Settlements</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        Timely cash flow is critical for neighborhood retail. Marketnera executes rapid merchant payouts:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Same-Day / T+1 Settlement:</strong> Verified order earnings are directly settled into your registered Indian bank account via Razorpay automated node settlements on a daily (T+1) basis.</li>
                                        <li><strong>100% Digital Prepaid Orders:</strong> All orders on Marketnera are securely paid online (UPI, Cards, NetBanking), eliminating cash handling risks, payment discrepancies, and unpaid returns for merchants.</li>
                                        <li><strong>Bank Verification:</strong> Merchants must provide a valid GSTIN (or Trade License), PAN card, and verified cancelled cheque/bank account details before receiving settlements.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Listing Rules & Quality Standards */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        3
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Product Listing & Quality Rules</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>MRP Integrity:</strong> Listed prices must never exceed the Maximum Retail Price (MRP) printed on the product. Selling above MRP is strictly illegal under the Legal Metrology Act and leads to immediate suspension.</li>
                                        <li><strong>Freshness & Expiry:</strong> All perishable food items, groceries, and packaged consumables must be fresh and well within their expiry / best-before date.</li>
                                        <li><strong>FSSAI Registration:</strong> Food, snack, and grocery merchants must display and upload a valid FSSAI registration certificate on their profile.</li>
                                        <li><strong>Accurate Stock Levels:</strong> Sellers must keep stock levels updated on their Shopkeeper Dashboard to avoid customer cancellations.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Prohibited Items */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-600 font-black text-sm">
                                        4
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Prohibited Items & Activities</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
                                    <p>Sellers must strictly NOT list or supply:</p>
                                    <ul className="list-disc list-inside space-y-1.5 pl-2">
                                        <li>Counterfeit, replica, or pirated merchandise.</li>
                                        <li>Tobacco, cigarettes, e-cigarettes, and illegal narcotics.</li>
                                        <li>Alcoholic beverages without state excise e-commerce authorization.</li>
                                        <li>Hazardous chemicals, unauthorized fireworks, or explosive materials.</li>
                                        <li>Prescription drugs (Schedule H/X) without authenticated verified pharmacist credentials.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5: Fulfillment SLA & Merchant Liability */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        5
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Fulfillment SLA & Liability</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        To maintain our 1-hour delivery target in Meerut:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Acceptance:</strong> Incoming customer orders must be accepted or rejected within 5 minutes.</li>
                                        <li><strong>Packaging:</strong> Items must be securely packed and marked &quot;Ready for Pickup&quot; within 15 minutes of acceptance.</li>
                                        <li><strong>Damage Liability:</strong> If an item is delivered damaged or incorrect due to seller packaging negligence, the merchant bears the cost of refund or replacement.</li>
                                        <li><strong>Termination:</strong> Repeated cancellations, expired items, or consumer complaints will result in permanent removal from Marketnera.</li>
                                    </ul>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
                                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-emerald-600" />
                                    Seller Benefits
                                </h3>

                                <ul className="space-y-3.5 text-xs text-slate-600 font-medium leading-relaxed">
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Direct access to thousands of nearby Meerut customers.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Dedicated delivery riders pick up from your counter.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Automated daily bank settlements via Razorpay.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Real-time POS, barcode scanner, and inventory analytics.</span>
                                    </li>
                                </ul>

                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 space-y-2">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <Store className="w-4 h-4 text-emerald-700" />
                                        Ready to Join?
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-emerald-800">
                                        Register your store in under 2 minutes at{" "}
                                        <a href="/register" className="font-bold underline">
                                            marketnera.com/register
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
