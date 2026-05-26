"use client";

import { useState } from "react";
import Logo from "@/components/layout/Logo";
import { footerColumns, socialLinks, footerTagline } from "@/content/home";
import siteConfig from "@/config/site";
import { LIMITS } from "@/constants/limits";
import { supabase } from "@/lib/supabase";

export default function Footer() {
    return (
        <footer className="border-t border-primary/10 bg-background-light py-16">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand column */}
                    <div className="space-y-6">
                        <Logo />
                        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                            {footerTagline}
                        </p>
                    </div>

                    {/* Link columns */}
                    {footerColumns.map((col) => (
                        <div key={col.heading} className="space-y-6">
                            <h5 className="text-sm font-bold uppercase tracking-widest">
                                {col.heading}
                            </h5>
                            <nav className="flex flex-col space-y-3" aria-label={`${col.heading} links`}>
                                {col.links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-sm text-slate-500 transition-colors hover:text-primary"
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
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <p className="text-xs tracking-wide text-slate-500">
                            © {LIMITS.FOUNDING_YEAR} {siteConfig.name} Inc. All rights reserved.
                        </p>
                        <div className="flex flex-col gap-4 items-end">
                            <div className="flex gap-8">
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
                            
                            {/* Dev Testing Secret Input (Red Dot Toggle) */}
                            <DevTestingDot />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Dev testing sub-component to handle state
function DevTestingDot() {
    const [isOpen, setIsOpen] = useState(false);

    if (isOpen) {
        return (
            <input 
                autoFocus
                type="text" 
                placeholder="Enter secret code..." 
                aria-label="Dev secret code"
                onBlur={() => setIsOpen(false)}
                onChange={async (e) => {
                    const val = e.target.value;
                    if (val === "shopkeeper@2110") {
                        document.cookie = "dev_bypass_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        e.target.value = "Logging in...";
                        e.target.disabled = true;
                        await supabase.auth.signInWithPassword({ email: "saksham@gmail.com", password: "12345678" });
                        window.location.href = "/shopkeeper/dashboard";
                    } else if (val === "customer@2110") {
                        document.cookie = "dev_bypass_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        e.target.value = "Logging in...";
                        e.target.disabled = true;
                        await supabase.auth.signInWithPassword({ email: "test@gmail.com", password: "12345678" });
                        window.location.href = "/customer/dashboard";
                    }
                }}
                className="w-44 py-1.5 px-3 rounded-lg bg-white shadow-md border border-red-300 text-red-600 font-bold tracking-wider outline-none placeholder-red-300 text-xs transition-all duration-300"
            />
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-2.5 h-2.5 p-0 rounded-full bg-red-500/40 hover:bg-red-500 transition-colors duration-300 cursor-pointer outline-none"
            aria-label="Developer Secret"
        />
    );
}
