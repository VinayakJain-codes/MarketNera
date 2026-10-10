"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
    Search,
    ShoppingCart,
    MapPin,
    ChevronDown,
    Store,
    Menu,
    X,
    User as UserIcon,
    ArrowRight,
    Sparkles,
} from "lucide-react";

interface CustomerNavbarProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export default function CustomerNavbar({
    searchQuery = "",
    onSearchChange,
}: CustomerNavbarProps) {
    const [user, setUser] = useState<User | null>(null);
    const [cartCount, setCartCount] = useState<number>(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("Civil Lines, Meerut, UP");
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);

    // Fetch user and local/db cart count
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                // Fetch cart count from database
                supabase
                    .from("cart_items")
                    .select("id, quantity", { count: "exact" })
                    .eq("user_id", session.user.id)
                    .then(({ data }) => {
                        const total = data?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
                        setCartCount(total);
                    });
            } else {
                // Check localStorage for guest cart count
                try {
                    const localCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
                    const total = localCart.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 1), 0);
                    setCartCount(total);
                } catch {
                    setCartCount(0);
                }
            }
        });

        // Listen for custom cart-updated event from any ProductCard
        const handleCartUpdate = () => {
            try {
                const localCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
                const total = localCart.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 1), 0);
                setCartCount((prev) => (total > 0 ? total : prev + 1));
            } catch {
                setCartCount((prev) => prev + 1);
            }
        };

        window.addEventListener("marketnera_cart_updated", handleCartUpdate);
        return () => window.removeEventListener("marketnera_cart_updated", handleCartUpdate);
    }, []);

    const customerNavLinks = [
        { label: "Home", href: ROUTES.HOME, badge: null },
        { label: "Shops", href: ROUTES.CUSTOMER_SHOPS, badge: "Local" },
        { label: "Categories", href: ROUTES.CATEGORIES, badge: null },
        { label: "Cart", href: ROUTES.CUSTOMER_CART, badge: cartCount > 0 ? `${cartCount}` : null },
        { label: "Terms", href: ROUTES.TERMS, badge: null },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md">
            {/* Upper Blinkit-style Utility Bar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex h-20 items-center justify-between gap-3 sm:gap-6">
                    {/* Left: Brand Logo & Location Pill */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        <a href={ROUTES.HOME} aria-label="MarketNera Home" className="flex items-center">
                            <Logo />
                        </a>

                        {/* Location Selector (Blinkit delivery in 15 mins) */}
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
                                className="flex flex-col text-left group hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-transparent hover:border-slate-200 transition-all"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[13px] font-black tracking-tight text-slate-900 flex items-center gap-1">
                                        <span>Delivery in 15 minutes</span>
                                        <span className="text-emerald-600 animate-pulse">⚡</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500 text-xs">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate max-w-[170px] font-medium text-slate-600">
                                        {selectedAddress}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                                </div>
                            </button>

                            {/* Dropdown for location change */}
                            {isAddressDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-scale-in">
                                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
                                        Select Delivery Location
                                    </p>
                                    <div className="space-y-1 mt-1">
                                        {["Civil Lines, Meerut", "Shastri Nagar, Meerut", "Saket, Meerut", "Pallavpuram, Meerut"].map((loc) => (
                                            <button
                                                key={loc}
                                                onClick={() => {
                                                    setSelectedAddress(`${loc}, UP`);
                                                    setIsAddressDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                                                    selectedAddress.includes(loc)
                                                        ? "bg-emerald-50 text-emerald-800 font-bold"
                                                        : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                <span>{loc}</span>
                                                {selectedAddress.includes(loc) && (
                                                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                                        <a
                                            href={ROUTES.CUSTOMER_ADDRESSES}
                                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                                        >
                                            <span>Manage Saved Addresses</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex-1 max-w-2xl min-w-[180px]">
                        <div className="relative w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder='Search "milk, chips, eggs, tomatoes, colas..."'
                                className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-slate-800 text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Right: Auth & Cart Button */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {/* Auth link */}
                        {user ? (
                            <a
                                href={ROUTES.CUSTOMER_PROFILE}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <UserIcon className="w-4 h-4 text-slate-600" />
                                <span className="truncate max-w-[90px]">
                                    {user.user_metadata?.full_name?.split(" ")[0] || "Account"}
                                </span>
                            </a>
                        ) : (
                            <a
                                href={ROUTES.LOGIN_CUSTOMER}
                                className="hidden sm:inline-block px-4 py-2 text-sm font-bold text-slate-800 hover:text-emerald-700 transition-colors"
                            >
                                Login
                            </a>
                        )}

                        {/* Blinkit Green My Cart Pill Button */}
                        <a
                            href={ROUTES.CUSTOMER_CART}
                            className="flex items-center gap-2.5 px-4 sm:px-5 h-11 sm:h-12 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-700/25 hover:bg-emerald-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <div className="relative flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-sm animate-scale-in">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden xs:inline">My Cart</span>
                            {cartCount > 0 && (
                                <span className="bg-emerald-800/80 px-1.5 py-0.5 rounded text-[11px] font-black">
                                    {cartCount} items
                                </span>
                            )}
                        </a>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
                            aria-label="Toggle Navigation"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Lower Navigation Links Bar */}
            <div className="border-t border-slate-100 bg-slate-50/70 hidden lg:block">
                <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex h-11 items-center justify-between">
                        {/* Left: Customer Navigation Items */}
                        <nav className="flex items-center gap-8" aria-label="Customer categories navigation">
                            {customerNavLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="group relative flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors py-1"
                                >
                                    <span>{link.label}</span>
                                    {link.badge && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                            {link.badge}
                                        </span>
                                    )}
                                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-600 transition-all duration-200 group-hover:w-full" />
                                </a>
                            ))}
                        </nav>

                        {/* Right: Register as Shop Owner option */}
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] text-slate-400 font-semibold">Want to sell local?</span>
                            <a
                                href={ROUTES.SHOPS_HOME}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-xs hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all group"
                                title="Onboard and register your shop on MarketNera"
                            >
                                <Store className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white transition-colors" />
                                <span>Register as Shop Owner</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-4 shadow-xl animate-fade-in-down">
                    {/* Location selector on mobile */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="flex-1 truncate">Delivering to: <strong>{selectedAddress}</strong></span>
                    </div>

                    {/* Nav links */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        {customerNavLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50/80 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                                <span>{link.label}</span>
                                {link.badge && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                                        {link.badge}
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Merchant banner on mobile */}
                    <div className="pt-2 border-t border-slate-100">
                        <a
                            href={ROUTES.SHOPS_HOME}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-md"
                        >
                            <div className="flex items-center gap-2">
                                <Store className="w-4 h-4" />
                                <span>Register as Shop Owner</span>
                            </div>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Grow With Us →
                            </span>
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
