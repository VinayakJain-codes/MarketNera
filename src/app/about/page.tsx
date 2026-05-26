"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WaitlistSection from "@/components/sections/WaitlistSection";
import { MapPin, ShieldAlert, Sparkles, Store, Compass, CheckCircle } from "lucide-react";

export default function AboutPage() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  const content = {
    en: {
      eyebrow: "Our Story & Vision",
      title: "Empowering Local Commerce for Bharat",
      intro: "Marketnera is a hyperlocal commerce platform built for Tier 2 and Tier 3 India.",
      beliefTitle: "Our Core Belief",
      beliefText: "We believe every local business — your neighborhood kirana, your trusted electronics shop, your nearby pharmacy — deserves a powerful digital presence. Not a workaround. Not an afterthought. A real platform built specifically for them.",
      problemTitle: "The Metros-First Gap",
      problemText: "Today, most digital commerce infrastructure is designed for metros and large retailers. Local businesses in cities like Meerut, Agra, and Kanpur are left behind — either invisible online or forced onto platforms that don't understand their customers.",
      solutionTitle: "The Marketnera Disruption",
      solutionText: "Marketnera changes that. We're building the digital backbone for neighborhood commerce — making it easy for local shops to list products, accept orders, and connect with customers right in their area.",
      tagline: "Hyperlocal. Neighborhood-first. Built for Bharat.",
      ctaTitle: "Be a Part of the Future",
      ctaText: "We're currently in development and growing fast. If you're a local business owner or someone who believes in the potential of small-town India — this is for you."
    },
    hi: {
      eyebrow: "हमारी कहानी और दृष्टिकोण",
      title: "भारत के स्थानीय व्यापार को सशक्त बनाना",
      intro: "Marketnera एक hyperlocal commerce platform है, जो Tier 2 और Tier 3 भारत के लिए बनाया गया है।",
      beliefTitle: "हमारा मुख्य विश्वास",
      beliefText: "हमारा मानना है कि हर local business — आपकी पड़ोस की किराना दुकान, आपका भरोसेमंद electronics store, आपकी नज़दीकी pharmacy — एक मज़बूत digital presence की हकदार है। कोई जुगाड़ नहीं, कोई compromise नहीं — एक असली platform जो सिर्फ उनके लिए बना हो।",
      problemTitle: "महानगरों-केंद्रित प्रणाली की कमी",
      problemText: "आज ज़्यादातर digital commerce बड़े शहरों और बड़े retailers के लिए डिज़ाइन किया गया है। मेरठ, आगरा, कानपुर जैसे शहरों के local businesses या तो online दिखते ही नहीं, या ऐसे platforms पर हैं जो उनके customers को समझते ही नहीं।",
      solutionTitle: "Marketnera की नई पहल",
      solutionText: "Marketnera यही बदलने आया है। हम neighborhood commerce की digital नींव बना रहे हैं — ताकि local shops आसानी से products list कर सकें, orders ले सकें, और अपने आस-पास के customers से जुड़ सकें।",
      tagline: "Hyperlocal. Neighborhood-first. Built for Bharat.",
      ctaTitle: "भविष्य का हिस्सा बनें",
      ctaText: "हम अभी development में हैं और तेज़ी से आगे बढ़ रहे हैं। अगर आप एक local business owner हैं या छोटे शहरों की ताकत में यकीन रखते हैं — यह platform आपके लिए है।"
    }
  };

  const t = content[lang];

  return (
    <div className="bg-background-light font-display text-slate-900 antialiased min-h-screen">
      <Navbar />

      <main className="flex-1 pb-10">
        {/* Decorative Grid & Blobs */}
        <div className="relative overflow-hidden pt-12 pb-16 lg:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 -z-10" />
          <div className="absolute -top-40 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#f97316]/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-[#2D9E4B]/5 blur-3xl" />

          <div className="container mx-auto px-6 lg:px-20 text-center">
            {/* Language Switcher */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 p-1.5 shadow-md shadow-orange-500/5 ring-1 ring-slate-200/50 backdrop-blur-sm mb-8"
            >
              <button
                onClick={() => setLang("en")}
                className={`rounded-full px-5 py-2 text-xs font-black tracking-wider transition-all duration-300 ${
                  lang === "en"
                    ? "bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                ENGLISH
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`rounded-full px-5 py-2 text-xs font-black tracking-wider transition-all duration-300 ${
                  lang === "hi"
                    ? "bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                हिंदी (HI)
              </button>
            </motion.div>

            {/* Hero Heading */}
            <div className="max-w-4xl mx-auto space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#2D9E4B]">
                {t.eyebrow}
              </span>
              
              <AnimatePresence mode="wait">
                <motion.h1
                  key={lang + "-title"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent"
                >
                  {t.title}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Intro Visual Banner */}
            <div className="max-w-3xl mx-auto mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-intro"}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-100 shadow-xl shadow-orange-500/5 relative overflow-hidden group hover:border-[#f97316]/30 transition-all duration-300"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 bg-gradient-to-br from-orange-400/20 to-amber-400/20 blur-xl opacity-75 group-hover:scale-125 transition-transform duration-500" />
                  <p className="text-lg sm:text-xl font-bold leading-relaxed text-slate-700">
                    {t.intro}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Vision & Core Belief Card */}
        <section className="py-10 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6 lg:px-20 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={lang + "-belief"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#f97316]/5 via-white to-[#2D9E4B]/5 border border-slate-100 shadow-sm"
              >
                <div className="absolute -left-3 top-6 text-7xl font-serif text-[#f97316]/25 select-none pointer-events-none">“</div>
                <div className="space-y-4">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f97316]">
                    <Sparkles className="h-4 w-4 text-[#f97316] animate-pulse" />
                    {t.beliefTitle}
                  </span>
                  <p className="text-xl sm:text-2xl font-bold leading-relaxed text-slate-800 tracking-wide font-sans">
                    {t.beliefText}
                  </p>
                </div>
                <div className="absolute -right-3 bottom-0 text-7xl font-serif text-[#2D9E4B]/25 select-none pointer-events-none">”</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Problem vs. Solution Visual Grid */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              
              {/* Problem */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-problem"}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col h-full rounded-3xl bg-slate-50 border border-slate-200/60 p-8 sm:p-10 hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 bg-red-500/5 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform" />
                  
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100 shadow-sm mb-6">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    {t.problemTitle}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed text-base flex-grow">
                    {t.problemText}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Solution */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-solution"}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col h-full rounded-3xl bg-gradient-to-br from-white to-[#2D9E4B]/5 border border-[#2D9E4B]/20 p-8 sm:p-10 shadow-lg shadow-emerald-500/5 hover:border-[#2D9E4B]/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden group"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 bg-[#2D9E4B]/10 rounded-bl-full opacity-60 -z-10 group-hover:scale-110 transition-transform" />
                  
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D9E4B]/10 text-[#2D9E4B] border border-[#2D9E4B]/20 shadow-sm mb-6">
                    <Store className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-slate-950 mb-4">
                    {t.solutionTitle}
                  </h3>
                  
                  <p className="text-slate-800 leading-relaxed text-base font-medium flex-grow">
                    {t.solutionText}
                  </p>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </section>

        {/* Focus Cities & Tagline Showcase */}
        <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.15),transparent_40%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,158,75,0.15),transparent_40%)] pointer-events-none" />
          
          <div className="container mx-auto px-6 lg:px-20 text-center relative z-10 max-w-4xl">
            {/* Visual City Pins */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { name: "Meerut (मेरठ)", delay: 0.1 },
                { name: "Agra (आगरा)", delay: 0.2 },
                { name: "Kanpur (कानपुर)", delay: 0.3 }
              ].map((city) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: city.delay }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-5 py-2.5 shadow-md shadow-black/10 hover:bg-white/15 transition-all"
                >
                  <MapPin className="h-4 w-4 text-[#f97316]" />
                  <span className="text-sm font-black tracking-wide text-white/95">{city.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h4 className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#f97316]">
                {lang === "en" ? "Our Identity" : "हमारी पहचान"}
              </h4>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent px-4">
                {t.tagline}
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA section with integrated Waitlist Form */}
        <section className="pt-20">
          <div className="container mx-auto px-6 lg:px-20 max-w-3xl text-center mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={lang + "-cta"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#f97316] shadow-inner mb-2">
                  <Compass className="h-6 w-6 animate-spin-slow" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                  {t.ctaTitle}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto">
                  {t.ctaText}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <WaitlistSection dark={false} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
