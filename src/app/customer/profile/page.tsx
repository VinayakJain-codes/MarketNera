"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { getWishlistCount } from "@/lib/services/wishlist";
import { getAddressCount } from "@/lib/services/addresses";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import Footer from "@/components/layout/Footer";
import {
    User as UserIcon,
    ShoppingBag,
    MapPin,
    CreditCard,
    Bell,
    Heart,
    HelpCircle,
    LogOut,
    ShieldCheck,
    ChevronRight,
    ArrowLeft,
    Clock,
} from "lucide-react";

export default function CustomerProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderCount, setOrderCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [addressCount, setAddressCount] = useState(0);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
            if (!session?.user) {
                window.location.href = ROUTES.LOGIN_CUSTOMER;
            } else {
                supabase
                    .from("orders")
                    .select("id", { count: "exact", head: true })
                    .eq("customer_id", session.user.id)
                    .then(({ count }) => setOrderCount(count || 0));

                getWishlistCount(session.user.id).then(setWishlistCount);
                getAddressCount(session.user.id).then(setAddressCount);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = ROUTES.HOME;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
                    <p className="text-xs text-slate-500 font-bold">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user.email?.split("@")[0] || "User";
    const avatarUrl = metadata.avatar_url;
    const initial = fullName.charAt(0).toUpperCase();
    const email = user.email || "No email";
    const createdAt = new Date(user.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const menuItems = [
        {
            icon: ShoppingBag,
            title: "My Orders",
            subtitle: `${orderCount} order${orderCount !== 1 ? "s" : ""} placed`,
            color: "text-blue-600 bg-blue-50",
            href: ROUTES.CUSTOMER_ORDERS,
        },
        {
            icon: MapPin,
            title: "Saved Addresses",
            subtitle: `${addressCount} delivery address${addressCount !== 1 ? "es" : ""}`,
            color: "text-emerald-700 bg-emerald-50",
            href: ROUTES.CUSTOMER_ADDRESSES,
        },
        {
            icon: Heart,
            title: "Wishlist",
            subtitle: `${wishlistCount} saved item${wishlistCount !== 1 ? "s" : ""}`,
            color: "text-rose-600 bg-rose-50",
            href: ROUTES.CUSTOMER_WISHLIST,
        },
        {
            icon: CreditCard,
            title: "Payment Security",
            subtitle: "Instant UPI & digital payment options",
            color: "text-indigo-600 bg-indigo-50",
            href: ROUTES.CUSTOMER_CART,
        },
        {
            icon: HelpCircle,
            title: "Customer Support",
            subtitle: "Help center, order complaints & FAQ",
            color: "text-teal-600 bg-teal-50",
            href: ROUTES.HELP_CENTER,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between font-sans text-slate-900">
            {/* Top Navigation */}
            <CustomerNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6 flex-1">
                {/* Back Link */}
                <div className="flex items-center gap-3 pb-2">
                    <Link
                        href={ROUTES.CUSTOMER_DASHBOARD}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-xs"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Profile</h1>
                        <p className="text-xs text-slate-500 font-medium">Manage your personal details and quick shortcuts</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-3xl flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={fullName}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover rounded-3xl"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            initial
                        )}
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{fullName}</h2>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold w-fit mx-auto sm:mx-0">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Verified Customer</span>
                            </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-500 font-medium">{email}</p>

                        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-600">
                            <span className="flex items-center gap-1.5 text-slate-500">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <span>Member since {createdAt}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu Grid */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
                        Account Shortcuts
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/5 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Sign Out Card */}
                <div className="pt-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Marketnera</span>
                    </button>
                </div>
            </main>

            {/* Bottom Nav & Modern Footer */}
            <Footer />
            <CustomerBottomNav />
        </div>
    );
}
