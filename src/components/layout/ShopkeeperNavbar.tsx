"use client";

import { useState } from "react";
import Logo from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import ProfileMenu from "@/components/layout/ProfileMenu";
import { Store, ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";

export default function ShopkeeperNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const merchantNavItems = [
        { label: "Overview", href: ROUTES.SHOPS_HOME },
        { label: "Features", href: ROUTES.SHOPS_FEATURES },
        { label: "Categories", href: ROUTES.SHOPS_CATEGORIES },
        { label: "Seller Terms", href: ROUTES.SELLER_TERMS },
        { label: "About", href: ROUTES.ABOUT },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-12">
                {/* Brand & Badge */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <a href={ROUTES.SHOPS_HOME} aria-label="Go to merchant portal" className="flex-shrink-0">
                        <Logo />
                    </a>

                    {/* Merchant Hub Badge */}
                    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                            Merchant Partner Hub
                        </span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-6 lg:flex" aria-label="Merchant navigation">
                    {merchantNavItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 sm:flex">
                    {/* Switch to customer store */}
                    <a
                        href={ROUTES.HOME}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Go to customer shopping store"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
                        <span>Customer Store</span>
                        <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>

                    <a
                        href={ROUTES.LOGIN_SHOPKEEPER}
                        className="text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Seller Login
                    </a>

                    <a
                        href={ROUTES.SIGNUP_SHOPKEEPER}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Store className="w-3.5 h-3.5" />
                        <span>Register Your Shop</span>
                    </a>

                    <ProfileMenu />
                </div>

                {/* Mobile Hamburger Button */}
                <div className="flex items-center gap-2 sm:hidden">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg animate-fade-in-down">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold w-fit">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Merchant Partner Hub</span>
                    </div>

                    <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100">
                        {merchantNavItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <a
                            href={ROUTES.HOME}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-orange-50 text-orange-800 text-xs font-bold"
                        >
                            <span className="flex items-center gap-1.5">
                                <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
                                Browse Customer Store
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>

                        <div className="flex gap-2 pt-1">
                            <a
                                href={ROUTES.LOGIN_SHOPKEEPER}
                                className="flex-1 py-2.5 text-center text-xs font-bold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                            >
                                Login
                            </a>
                            <a
                                href={ROUTES.SIGNUP_SHOPKEEPER}
                                className="flex-1 py-2.5 text-center text-xs font-bold bg-emerald-600 text-white rounded-xl shadow-sm hover:bg-emerald-700"
                            >
                                Register Shop
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
