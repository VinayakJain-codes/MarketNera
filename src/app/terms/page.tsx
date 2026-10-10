import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalNav from "@/components/legal/LegalNav";
import legalConfig from "@/config/legal";
import { Shield, Clock, FileText, AlertCircle, Scale, Building2, UserCheck, CreditCard, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description: "Terms and conditions governing the use of Marketnera's hyperlocal commerce platform in Meerut, Uttar Pradesh, India.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Header Section */}
                <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md py-12 lg:py-16">
                    <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
                            <FileText className="w-3.5 h-3.5 text-primary" />
                            <span>User Agreement</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Terms & Conditions
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                            Welcome to {legalConfig.brandName}. These terms set forth the terms and conditions for your use of our platform and hyperlocal services.
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
                                    Welcome to <strong>{legalConfig.brandName}</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), {legalConfig.fullAddress}. By accessing or using our website or services, you agree to these Terms.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        1
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Our Role as an Intermediary</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        Marketnera is an online platform connecting customers with local shops and sellers in Meerut, Uttar Pradesh. We act as an intermediary under the <strong>Information Technology Act, 2000</strong> and applicable intermediary guidelines.
                                    </p>
                                    <p>
                                        Products and services listed on the platform are sold and fulfilled by independent neighborhood sellers. The sellers are solely responsible for their listings, item descriptions, quality, packaging, and fulfillment.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        2
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Eligibility</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        You must be 18 years of age or older, or use the platform under the supervision and consent of a parent or legal guardian, and be legally competent to enter into a binding contract under the Indian Contract Act, 1872.
                                    </p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        3
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">User Accounts & Security</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        You are responsible for maintaining the accuracy of your account information, phone number, and delivery address, as well as for all activities that occur under your account.
                                    </p>
                                    <p>
                                        Keep your login credentials and one-time passwords (OTPs) confidential. You agree to notify us immediately of any unauthorized access or security breach.
                                    </p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        4
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Orders and Payments</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <ul className="list-disc list-inside space-y-2 pl-2">
                                        <li><strong>Pricing & Taxes:</strong> All prices are displayed in Indian Rupees (INR) and include applicable taxes (GST) unless stated otherwise.</li>
                                        <li><strong>Payment Processing:</strong> Online payments are processed through Razorpay and other RBI-authorized payment aggregators. Marketnera does not collect or store your debit/credit card numbers or sensitive banking credentials.</li>
                                        <li><strong>Order Acceptance:</strong> An order is officially confirmed only when the independent seller reviews and accepts it. Sellers reserve the right to cancel orders due to stock exhaustion or pricing errors, in which case a full refund is immediately initiated.</li>
                                        <li><strong>Finality:</strong> All sales are final once prepared and dispatched. Please read our <a href="/refund-policy" className="text-primary font-bold hover:underline">Refund & Exchange Policy</a> before placing an order.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        5
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Seller Responsibilities</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        Registered sellers must provide truthful product listings, maintain statutory trade and food safety licenses (such as FSSAI where applicable), comply with Indian laws and standards, and fulfill accepted customer orders promptly.
                                    </p>
                                </div>
                            </section>

                            {/* Section 6 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        6
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Prohibited Use</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
                                    <p>You agree not to:</p>
                                    <ul className="list-disc list-inside space-y-1.5 pl-2">
                                        <li>Post false, deceptive, or misleading content, reviews, or seller feedback.</li>
                                        <li>Use the platform for any illegal or unlawful purposes under Indian law.</li>
                                        <li>Attempt to hack, scrape, reverse-engineer, inject malicious code, or disrupt platform infrastructure.</li>
                                        <li>Impersonate any person, business, or government representative.</li>
                                        <li>Attempt to sell or purchase prohibited, hazardous, narcotics, or counterfeit items.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        7
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Intellectual Property</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        All brand logos, trademarks, visual styling, software, text, graphics, and interface code belong to Marketnera or its licensors. You may not reproduce, copy, distribute, or create derivative works without prior written consent.
                                    </p>
                                </div>
                            </section>

                            {/* Section 8 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        8
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Third-Party Services</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        We integrate third-party services for maps (OpenStreetMap/Leaflet), payment gateways (Razorpay), cloud infrastructure, and transactional SMS/WhatsApp alerts. We are not responsible for third-party practices or uptime beyond our direct service level control.
                                    </p>
                                </div>
                            </section>

                            {/* Section 9 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        9
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Disclaimer of Warranties</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Marketnera does not warrant that services will be uninterrupted or error-free. We are not liable for independent seller conduct, merchant product quality, or delays caused by severe weather or local road conditions beyond statutory requirements.
                                    </p>
                                </div>
                            </section>

                            {/* Section 10 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        10
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Limitation of Liability</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        To the maximum extent permitted by applicable Indian law, our total aggregate liability arising out of or related to any claim under these Terms is strictly limited to the amount paid by you for the specific order giving rise to such liability.
                                    </p>
                                </div>
                            </section>

                            {/* Section 11 & 12 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        11 & 12
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Suspension, Termination & Policy Changes</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                                    <p>
                                        We reserve the right to suspend or terminate accounts that breach these Terms, commit fraudulent activity, or violate applicable law.
                                    </p>
                                    <p>
                                        We may periodically update these Terms to reflect operational or regulatory changes. Continued use of the platform after updates indicates your acceptance of the revised Terms.
                                    </p>
                                </div>
                            </section>

                            {/* Section 13 */}
                            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-primary font-black text-sm">
                                        13
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">Governing Law & Jurisdiction</h2>
                                </div>
                                <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        These Terms are governed by and construed in accordance with the laws of the Republic of India. The courts situated at <strong>Meerut, Uttar Pradesh</strong> have exclusive jurisdiction over all disputes arising hereunder.
                                    </p>
                                </div>
                            </section>

                            {/* Section 14: Grievance Officer */}
                            <section className="rounded-3xl bg-gradient-to-br from-orange-500/5 via-white to-emerald-500/5 border-2 border-primary/20 p-6 sm:p-8 shadow-md">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-black text-sm shadow-sm">
                                        14
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Grievance Officer</h2>
                                        <p className="text-xs text-slate-500 font-semibold">
                                            In accordance with Consumer Protection (E-Commerce) Rules, 2020 & IT Rules, 2021
                                        </p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
                                    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Officer Name</span>
                                        <span className="text-base font-extrabold text-slate-900">{legalConfig.grievanceOfficer.name}</span>
                                        <span className="text-xs text-slate-500 block">{legalConfig.grievanceOfficer.title}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Contact</span>
                                        <a href={`mailto:${legalConfig.grievanceOfficer.email}`} className="text-base font-extrabold text-primary hover:underline block">
                                            {legalConfig.grievanceOfficer.email}
                                        </a>
                                        <span className="text-xs text-slate-500">Acknowledged within {legalConfig.grievanceOfficer.acknowledgementWindow}</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Telephone</span>
                                        <a href={`tel:${legalConfig.grievanceOfficer.phone}`} className="text-base font-extrabold text-slate-900 hover:text-primary block">
                                            {legalConfig.grievanceOfficer.phone}
                                        </a>
                                        <span className="text-xs text-slate-500">Mon–Sat, 9:00 AM – 8:00 PM IST</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Resolution Standard</span>
                                        <span className="text-base font-extrabold text-emerald-600 block">Within {legalConfig.grievanceOfficer.resolutionWindow}</span>
                                        <span className="text-xs text-slate-500">Statutory redressal timeline</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
                                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    Key Highlights
                                </h3>

                                <ul className="space-y-3.5 text-xs text-slate-600 font-medium leading-relaxed">
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <span>Operated in Meerut, UP as an intermediary connecting local shops.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <span>Sellers are responsible for inventory, pricing, and packaging.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <span>Secure payments with Razorpay; no card numbers stored.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <span>All sales are final upon delivery acceptance.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <span>Complaints acknowledged within 48 hours.</span>
                                    </li>
                                </ul>

                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-xs text-orange-900 space-y-2">
                                    <p className="font-bold flex items-center gap-1.5">
                                        <AlertCircle className="w-4 h-4 text-orange-600" />
                                        Need Clarification?
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-orange-800">
                                        Reach out to our customer operations team anytime at{" "}
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
