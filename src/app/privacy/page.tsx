import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalNav from "@/components/legal/LegalNav";
import legalConfig from "@/config/legal";
import { ShieldCheck, Clock, Building2, Lock, Eye, Database, Cookie, UserX, UserCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Marketnera's privacy policy outlining data collection, usage, and protection under the Digital Personal Data Protection Act, 2023 and IT Act, 2000.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Header Section */}
                <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md py-12 lg:py-16">
                    <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>DPDP Act 2023 & IT Act 2000 Compliant</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                            This policy explains how {legalConfig.brandName} collects, uses, protects, and handles your personal data when you interact with our hyperlocal marketplace.
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
                            {/* Preamble Card */}
                            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm leading-relaxed text-slate-700 text-sm sm:text-base">
                                <p>
                                    This policy explains how <strong>{legalConfig.brandName}</strong> collects, uses, and protects your personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and the <strong>Information Technology Act, 2000</strong>. We are committed to transparency, security, and giving you full control over your personal information.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        1
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Data We Collect</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>We collect only the minimum necessary information to deliver our services:</p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Identity & Contact:</strong> Full name, verified mobile phone number, email address, and doorstep delivery addresses with landmark.</li>
                                        <li><strong>Account Data:</strong> Encrypted authentication credentials, saved preferences, and past order history.</li>
                                        <li><strong>Location Telemetry:</strong> Approximate or precision GPS coordinates (strictly with your explicit browser/device permission) to identify nearby neighborhood merchants, compute accurate delivery fees, and power 1-hour fast dispatch.</li>
                                        <li><strong>Payment Status:</strong> Transactions are handled directly by Razorpay and authorized gateways. We receive only transaction status tokens and reference IDs; we never store your debit/credit card CVV or net-banking passwords.</li>
                                        <li><strong>Technical & Analytical Data:</strong> IP address, device model, operating system, browser type, cookies, and crash reports.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        2
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">How We Use Your Data</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>We use your information strictly for the following purposes:</p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li>To establish your account and authenticate access.</li>
                                        <li>To relay your order to the chosen local merchant for preparation and packaging.</li>
                                        <li>To direct delivery riders to your doorstep within our 1-hour target SLA.</li>
                                        <li>To send critical order confirmations and status updates via SMS, WhatsApp, and email.</li>
                                        <li>To detect fraud, prevent duplicate claims, and comply with Indian statutory requirements.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        3
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Consent & Legitimate Uses</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        We process your data primarily on the basis of your explicit consent or for legitimate uses recognized under the Digital Personal Data Protection Act, 2023 (such as fulfilling an order placed voluntarily by you).
                                    </p>
                                    <p>
                                        You may withdraw your consent at any time by contacting our Privacy Team at{" "}
                                        <a href={`mailto:${legalConfig.privacyEmail}`} className="text-primary font-bold hover:underline">
                                            {legalConfig.privacyEmail}
                                        </a>. Please note that withdrawing consent may limit or disable your ability to place orders.
                                    </p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        4
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Data Sharing & Disclosure</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 font-semibold text-xs sm:text-sm">
                                        🛡️ Zero Data Resale: We never sell, rent, or trade your personal data to third-party marketing companies.
                                    </div>
                                    <p>We share information strictly with verified partners essential for service execution:</p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Local Sellers:</strong> Customer name, delivery address, and ordered items to allow preparation.</li>
                                        <li><strong>Delivery Fleet Partners:</strong> Address and contact phone number to complete doorstep drop-off.</li>
                                        <li><strong>Payment Gateways (Razorpay):</strong> Transaction tokens and invoice values to facilitate secure payments.</li>
                                        <li><strong>Transactional Messaging Providers:</strong> Phone number and email for transactional OTPs and order status updates.</li>
                                        <li><strong>Law Enforcement & Regulators:</strong> When legally compelled under statutory order or court decree.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5 & 6 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        5 & 6
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Storage, Security & Data Retention</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        Your data is stored securely in encrypted cloud databases protected by row-level security (RLS), role-based access controls, and TLS/HTTPS transport encryption.
                                    </p>
                                    <p>
                                        We retain personal information only for as long as required to fulfill the purposes set out in this policy or as mandated by applicable Indian financial and tax laws (e.g. maintaining invoices for statutory audit).
                                    </p>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        7
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Your Rights as a Data Principal</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>Under the DPDP Act 2023, you hold the following rights:</p>
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Right of Access & Summary:</strong> Request a summary of personal data being processed.</li>
                                        <li><strong>Right to Correction & Erasure:</strong> Correct outdated data or request permanent deletion of your account.</li>
                                        <li><strong>Right of Grievance Redressal:</strong> Register complaints with our Grievance Officer.</li>
                                        <li><strong>Right to Nominate:</strong> Nominate an individual who can exercise your rights in the event of incapacity.</li>
                                    </ul>
                                    <p>
                                        To exercise any of these rights, email us at{" "}
                                        <a href={`mailto:${legalConfig.privacyEmail}`} className="text-primary font-bold hover:underline">
                                            {legalConfig.privacyEmail}
                                        </a>. We respond to all verified requests within a reasonable time.
                                    </p>
                                </div>
                            </section>

                            {/* Section 8 & 9 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        8 & 9
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Cookies & Children&apos;s Privacy</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        <strong>Cookies:</strong> We use essential cookies to maintain your login session, cart state, and analytics. You can adjust your browser settings to refuse cookies, though doing so may disable cart and checkout features.
                                    </p>
                                    <p>
                                        <strong>Children&apos;s Privacy:</strong> Our platform is intended for users who are 18 years or older. We do not knowingly collect personal data from children under 18 without verifiable parental consent.
                                    </p>
                                </div>
                            </section>

                            {/* Section 10 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                                        10
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Policy Updates & Privacy Contact</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        We may update this policy periodically to reflect evolving legal requirements. The updated date will always be displayed at the top of this document.
                                    </p>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1 mt-4">
                                        <p className="font-bold text-slate-900">Privacy Inquiries & Data Requests:</p>
                                        <p className="text-slate-600">Email: <a href={`mailto:${legalConfig.privacyEmail}`} className="text-primary font-bold hover:underline">{legalConfig.privacyEmail}</a></p>
                                        <p className="text-slate-600">Postal Address: {legalConfig.fullAddress}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
                                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-emerald-600" />
                                    Privacy Commitments
                                </h3>

                                <ul className="space-y-3.5 text-xs text-slate-600 font-medium leading-relaxed">
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>No selling of personal customer data.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Location captured only with user permission for delivery.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Razorpay tokenized payments; no stored CVV or passwords.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>Complete right to request data erasure or export.</span>
                                    </li>
                                </ul>

                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 space-y-2">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-emerald-700" />
                                        Data Protection Office
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-emerald-800">
                                        Questions regarding personal data or privacy rights? Write to us at{" "}
                                        <a href={`mailto:${legalConfig.privacyEmail}`} className="font-bold underline">
                                            {legalConfig.privacyEmail}
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
