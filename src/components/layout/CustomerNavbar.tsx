"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/layout/Logo";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { getAddresses, CustomerAddress } from "@/lib/services/addresses";
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
    Plus,
} from "lucide-react";
import Link from "next/link";

interface CustomerNavbarProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export default function CustomerNavbar({
    searchQuery = "",
    onSearchChange,
}: CustomerNavbarProps) {
    const [user, setUser] = useState<User | null>(null);
    const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>("Civil Lines, Meerut");
    const [cartCount, setCartCount] = useState<number>(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);

    // Fetch user, addresses from database, and cart count
    useEffect(() => {
        let isMounted = true;

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!isMounted) return;
            setUser(session?.user ?? null);

            if (session?.user) {
                // Fetch saved addresses from database
                try {
                    const addrs = await getAddresses(session.user.id);
                    if (isMounted && addrs.length > 0) {
                        setSavedAddresses(addrs);
                        const def = addrs.find((a) => a.is_default) || addrs[0];
                        setSelectedAddress(
                            `${def.address_line}${def.city ? `, ${def.city}` : ""}`
                        );
                    }
                } catch (e) {
                    console.error("Address fetch error:", e);
                }

                // Fetch cart count from database
                try {
                    const { data } = await supabase
                        .from("cart_items")
                        .select("id, quantity")
                        .eq("user_id", session.user.id);

                    if (isMounted) {
                        const total = data?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
                        setCartCount(total);
                    }
                } catch {
                    // ignore
                }
            } else {
                // Check localStorage for guest cart count
                try {
                    const localCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
                    const total = localCart.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 1), 0);
                    if (isMounted) setCartCount(total);
                } catch {
                    if (isMounted) setCartCount(0);
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
        return () => {
            isMounted = false;
            window.removeEventListener("marketnera_cart_updated", handleCartUpdate);
        };
    }, []);

    const customerNavLinks = [
        { label: "Home", href: ROUTES.HOME, badge: null },
        { label: "Shops", href: ROUTES.CUSTOMER_SHOPS, badge: null },
        { label: "Categories", href: ROUTES.CATEGORIES, badge: null },
        { label: "Cart", href: ROUTES.CUSTOMER_CART, badge: cartCount > 0 ? `${cartCount}` : null },
        { label: "Terms", href: ROUTES.TERMS, badge: null },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
            {/* Upper Quick-Commerce Utility Bar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex h-18 sm:h-20 items-center justify-between gap-3 sm:gap-6">
                    {/* Left: Brand Logo & Location Pill */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        <Link href={ROUTES.HOME} aria-label="MarketNera Home" className="flex items-center">
                            <Logo />
                        </Link>

                        {/* Location Selector */}
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
                                className="flex flex-col text-left group hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                            >
                                <span className="text-xs font-bold tracking-tight text-slate-900 flex items-center gap-1">
                                    <span>Delivery in 15–30 mins</span>
                                </span>
                                <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                    <span className="truncate max-w-[170px] font-medium text-slate-700">
                                        {selectedAddress}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                                </div>
                            </button>

                            {/* Dropdown for location change */}
                            {isAddressDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-scale-in">
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            {savedAddresses.length > 0 ? "Your Saved Addresses" : "Delivery Neighborhood"}
                                        </p>
                                    </div>

                                    <div className="space-y-1 mt-1 max-h-56 overflow-y-auto">
                                        {savedAddresses.length > 0 ? (
                                            savedAddresses.map((addr) => {
                                                const full = `${addr.address_line}${addr.city ? `, ${addr.city}` : ""}`;
                                                const isSelected = selectedAddress === full;
                                                return (
                                                    <button
                                                        key={addr.id}
                                                        onClick={() => {
                                                            setSelectedAddress(full);
                                                            setIsAddressDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                                            isSelected
                                                                ? "bg-emerald-50 text-emerald-800 font-bold"
                                                                : "text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{addr.label}</p>
                                                            <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                                                                {full}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                                        )}
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            ["Civil Lines, Meerut", "Shastri Nagar, Meerut", "Saket, Meerut", "Baghpat Road, Meerut"].map((loc) => (
                                                <button
                                                    key={loc}
                                                    onClick={() => {
                                                        setSelectedAddress(loc);
                                                        setIsAddressDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
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
                                            ))
                                        )}
                                    </div>

                                    <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                                        <Link
                                            href={ROUTES.CUSTOMER_ADDRESSES}
                                            onClick={() => setIsAddressDropdownOpen(false)}
                                            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Add New Address</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex-1 max-w-2xl min-w-[170px]">
                        <div className="relative w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder="Search products, groceries, or local stores..."
                                className="w-full h-10 sm:h-11 pl-10 pr-4 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-900 text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Right: Auth & Cart Button */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {user ? (
                            <Link
                                href={ROUTES.CUSTOMER_PROFILE}
                                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <UserIcon className="w-4 h-4 text-slate-500" />
                                <span className="truncate max-w-[100px]">
                                    {user.user_metadata?.full_name?.split(" ")[0] || "Account"}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={ROUTES.LOGIN_CUSTOMER}
                                className="hidden sm:inline-block px-3.5 py-2 text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}

                        {/* Cart Button */}
                        <Link
                            href={ROUTES.CUSTOMER_CART}
                            className="flex items-center gap-2 px-3.5 sm:px-4 h-10 sm:h-11 rounded-xl bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-emerald-800 active:scale-95 transition-all"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden xs:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="bg-emerald-900 text-emerald-100 px-1.5 py-0.5 rounded text-[11px] font-extrabold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
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
            <div className="border-t border-slate-100 bg-slate-50/80 hidden lg:block">
                <div className="container mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex h-10 items-center justify-between">
                        {/* Left: Customer Navigation Items */}
                        <nav className="flex items-center gap-7" aria-label="Customer categories navigation">
                            {customerNavLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <span>{link.label}</span>
                                    {link.badge && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right: Register as Shop Owner option */}
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">Are you a shop owner?</span>
                            <Link
                                href={ROUTES.SHOPS_HOME}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-emerald-700 hover:text-emerald-800 text-xs font-bold transition-colors"
                                title="Merchant onboarding"
                            >
                                <Store className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Register as Shop Owner</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3 shadow-lg">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">Delivering to: <strong>{selectedAddress}</strong></span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {customerNavLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <span>{link.label}</span>
                                {link.badge && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                        <Link
                            href={ROUTES.SHOPS_HOME}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                        >
                            <div className="flex items-center gap-2">
                                <Store className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Register as Shop Owner</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Portal →</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
