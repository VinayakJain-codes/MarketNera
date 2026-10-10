"use client";

import Logo from "@/components/layout/Logo";
import { footerColumns, socialLinks, footerTagline } from "@/content/home";
import siteConfig from "@/config/site";
import { LIMITS } from "@/constants/limits";

export default function Footer() {
    return (
        <footer className="border-t border-primary/10 bg-background-light py-16">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="space-y-6 lg:col-span-1">
                        <Logo />
                        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                            {footerTagline}
                        </p>
                    </div>

                    {/* Link columns */}
                    {footerColumns.map((col) => (
                        <div key={col.heading} className="space-y-4">
                            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                                {col.heading}
                            </h5>
                            <nav className="flex flex-col space-y-2.5" aria-label={`${col.heading} links`}>
                                {col.links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-xs text-slate-500 transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 border-t border-primary/10 pt-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <p className="text-xs tracking-wide text-slate-500 order-2 md:order-1">
                            © {LIMITS.FOUNDING_YEAR} {siteConfig.name} Inc. All rights reserved.
                        </p>

                        {/* Quick Legal Links on every page */}
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 order-1 md:order-2 font-medium">
                            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
                            <span className="text-slate-300">·</span>
                            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
                            <span className="text-slate-300">·</span>
                            <a href="/refund-policy" className="hover:text-primary transition-colors">Refund</a>
                            <span className="text-slate-300">·</span>
                            <a href="/shipping-policy" className="hover:text-primary transition-colors">Shipping</a>
                            <span className="text-slate-300">·</span>
                            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
                        </div>

                        <div className="flex gap-6 order-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.platform}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-primary"
                                >
                                    {social.platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
