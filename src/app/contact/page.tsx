"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalNav from "@/components/legal/LegalNav";
import legalConfig from "@/config/legal";
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock, 
    Shield, 
    Send, 
    CheckCircle2, 
    Building2, 
    MessageSquare, 
    Store, 
    Truck, 
    HelpCircle 
} from "lucide-react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("general");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate response time
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Header Section */}
                <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md py-12 lg:py-16">
                    <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
                            <MessageSquare className="w-3.5 h-3.5 text-primary" />
                            <span>We Are Here For You</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Contact Us
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                            Have questions, need order assistance, or want to partner with {legalConfig.brandName}? Reach our team via email, telephone, or the contact form below.
                        </p>

                        <div className="mt-8 pt-4 border-t border-slate-100">
                            <LegalNav />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 lg:px-20 max-w-5xl mt-12">
                    {/* Primary Contact Cards Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {/* Address Card */}
                        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900">Office Location</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                {legalConfig.brandName}
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {legalConfig.fullAddress}
                            </p>
                            <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-2">
                                Meerut, Uttar Pradesh, India
                            </span>
                        </div>

                        {/* Customer Support Card */}
                        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900">Support & Inquiries</h3>
                            <div className="space-y-1.5 text-sm">
                                <div>
                                    <span className="text-xs text-slate-400 block font-semibold">General & Orders:</span>
                                    <a href={`mailto:${legalConfig.supportEmail}`} className="font-bold text-primary hover:underline">
                                        {legalConfig.supportEmail}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block font-semibold">Privacy & Data:</span>
                                    <a href={`mailto:${legalConfig.privacyEmail}`} className="font-bold text-slate-800 hover:underline">
                                        {legalConfig.privacyEmail}
                                    </a>
                                </div>
                            </div>
                            <div className="pt-1 text-xs text-slate-500">
                                Response time: usually under 4 business hours
                            </div>
                        </div>

                        {/* Phone & Timings Card */}
                        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 sm:col-span-2 lg:col-span-1">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900">Helpline & Hours</h3>
                            <div className="space-y-1 text-sm">
                                <a href={`tel:${legalConfig.supportPhone}`} className="text-base font-black text-slate-900 hover:text-primary block">
                                    {legalConfig.supportPhoneDisplay}
                                </a>
                                <p className="text-xs text-slate-600 font-medium">
                                    {legalConfig.supportTimings}
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600">
                                🛵 <strong>Delivery Ops:</strong> {legalConfig.deliveryOperatingHours}
                            </div>
                        </div>
                    </div>

                    {/* Grievance Officer Card (Statutory E-Commerce Compliance) */}
                    <div className="mb-12 rounded-3xl bg-gradient-to-br from-orange-500/5 via-white to-emerald-500/5 border-2 border-primary/20 p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Statutory Grievance Redressal</h3>
                                    <p className="text-xs text-slate-500">
                                        Designated in compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-full self-start sm:self-auto">
                                48-Hour Response SLA
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-6 pt-6 text-sm">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Grievance Officer</span>
                                <span className="font-extrabold text-slate-900 text-base block">{legalConfig.grievanceOfficer.name}</span>
                                <span className="text-xs text-slate-500">{legalConfig.grievanceOfficer.title}</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Direct Email</span>
                                <a href={`mailto:${legalConfig.grievanceOfficer.email}`} className="font-extrabold text-primary hover:underline text-base block">
                                    {legalConfig.grievanceOfficer.email}
                                </a>
                                <span className="text-xs text-slate-500">Acknowledged within {legalConfig.grievanceOfficer.acknowledgementWindow}</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Resolution Standard</span>
                                <span className="font-extrabold text-emerald-600 text-base block">Within {legalConfig.grievanceOfficer.resolutionWindow}</span>
                                <span className="text-xs text-slate-500">Official written resolution</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Contact Form & FAQ */}
                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                                <h2 className="text-xl font-black text-slate-900 mb-2">Send Us a Direct Message</h2>
                                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                                    Whether you are a customer, a local shop owner wanting to join, or have general feedback.
                                </p>

                                {submitted ? (
                                    <div className="p-8 text-center space-y-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-black text-emerald-950">Message Sent Successfully!</h3>
                                        <p className="text-xs sm:text-sm text-emerald-800 max-w-sm mx-auto">
                                            Thank you for reaching out, {name}. A member of our Meerut operations team will reply to <strong>{email}</strong> shortly.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSubmitted(false);
                                                setMessage("");
                                            }}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="name">
                                                    Full Name *
                                                </label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. Ramesh Kumar"
                                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="phone">
                                                    Mobile Number *
                                                </label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    required
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="email">
                                                    Email Address *
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="subject">
                                                    Inquiry Type
                                                </label>
                                                <select
                                                    id="subject"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all font-medium text-slate-700"
                                                >
                                                    <option value="general">💬 General Question</option>
                                                    <option value="order">📦 Order Assistance / Delivery Issue</option>
                                                    <option value="shopkeeper">🏪 Register Shop / Merchant Partnership</option>
                                                    <option value="delivery">🛵 Delivery Partner Inquiry</option>
                                                    <option value="grievance">⚖️ Formal Grievance Redressal</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="message">
                                                Your Message *
                                            </label>
                                            <textarea
                                                id="message"
                                                required
                                                rows={4}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Provide details about your query, Order ID if applicable, or shop address..."
                                                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            {submitting ? (
                                                <span>Sending...</span>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    <span>Submit Inquiry</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Quick Help & FAQs */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-primary" />
                                    Frequently Asked
                                </h3>

                                <div className="space-y-4 text-xs sm:text-sm">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-900">How do I report a missing or damaged order?</h4>
                                        <p className="text-slate-500 leading-relaxed">
                                            Email {legalConfig.supportEmail} with your Order ID and photo proof within 48 hours as detailed in our <a href="/refund-policy" className="text-primary font-bold hover:underline">Refund Policy</a>.
                                        </p>
                                    </div>

                                    <div className="space-y-1 pt-3 border-t border-slate-100">
                                        <h4 className="font-bold text-slate-900">I am a local shopkeeper. How do I list on Marketnera?</h4>
                                        <p className="text-slate-500 leading-relaxed">
                                            Visit our <a href="/register" className="text-primary font-bold hover:underline">Register page</a> or choose &quot;Merchant Partnership&quot; in the form to get onboarded in under 2 minutes.
                                        </p>
                                    </div>

                                    <div className="space-y-1 pt-3 border-t border-slate-100">
                                        <h4 className="font-bold text-slate-900">What areas in Meerut do you cover?</h4>
                                        <p className="text-slate-500 leading-relaxed">
                                            All major municipal areas in Meerut including Civil Lines, Shastri Nagar, Saket, Begum Bridge, and surrounding neighborhoods.
                                        </p>
                                    </div>
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
