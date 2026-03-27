'use client';

import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { heroContent } from '@/content/home';
import SmartHeroCta from '@/components/sections/SmartHeroCta';

export default function HeroSection() {
    const { eyebrow, heading, subtext, heroImageUrl, heroImageAlt } = heroContent;

    return (
        <section className="relative overflow-hidden py-16 lg:py-24" id="hero">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="flex flex-col space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#2D9E4B]">
                                {eyebrow}
                            </span>
                            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 lg:text-7xl">
                                {heading}
                            </h1>
                            <p className="max-w-xl text-lg leading-relaxed text-slate-600 lg:text-xl">
                                {subtext}
                            </p>
                        </div>
                        <SmartHeroCta />
                    </motion.div>

                    {/* Hero image & Working Elements */}
                    <div className="relative">
                        {/* Main Image Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-900/5 group"
                        >
                            {heroImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    src={heroImageUrl}
                                    alt={heroImageAlt}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2D9E4B]/20 to-[#FF9933]/20">
                                    <span className="text-lg font-semibold text-slate-400">MarketNera</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Animated Floating Element 1 - Sales Spike */}
                        <motion.div
                            initial={{ opacity: 0, x: 20, y: 20 }}
                            animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
                            transition={{
                                opacity: { duration: 0.6, delay: 0.8 },
                                x: { duration: 0.6, delay: 0.8 },
                                y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }
                            }}
                            className="absolute -right-6 bottom-12 z-10 hidden sm:flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-900/5 lg:-right-10"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D9E4B]/10 text-[#2D9E4B]">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">+24% Sales</p>
                                <p className="text-xs text-slate-500">This week</p>
                            </div>
                        </motion.div>

                        {/* Animated Floating Element 2 - New Order */}
                        <motion.div
                            initial={{ opacity: 0, x: -20, y: -20 }}
                            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                            transition={{
                                opacity: { duration: 0.6, delay: 0.6 },
                                x: { duration: 0.6, delay: 0.6 },
                                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }
                            }}
                            className="absolute -left-6 top-12 z-10 hidden sm:flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-900/5 lg:-left-12"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9933]/10 text-[#FF9933]">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">New Order</p>
                                <p className="text-xs text-slate-500">Just now</p>
                            </div>
                        </motion.div>

                        {/* Decorative blobs */}
                        <div className="absolute -bottom-6 -left-6 -z-10 hidden h-24 w-24 rounded-2xl bg-[#2D9E4B]/20 blur-2xl lg:block" />
                        <div className="absolute -right-6 -top-6 -z-10 hidden h-32 w-32 rounded-full bg-[#2D9E4B]/10 blur-3xl lg:block" />
                    </div>
                </div>
            </div>
        </section>
    );
}
