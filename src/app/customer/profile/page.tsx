"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";

export default function CustomerProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
            if (!session?.user) {
                window.location.href = ROUTES.LOGIN_CUSTOMER;
            }
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = ROUTES.HOME;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading your profile...</p>
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
        month: "long",
        day: "numeric",
    });

    const menuItems = [
        { icon: "shopping_bag",    title: "My Orders",         subtitle: "View your order history",        color: "bg-blue-50 text-blue-500",   borderColor: "hover:border-blue-300" },
        { icon: "location_on",     title: "Saved Addresses",   subtitle: "Manage delivery locations",      color: "bg-emerald-50 text-emerald-500", borderColor: "hover:border-emerald-300" },
        { icon: "credit_card",     title: "Payment Methods",   subtitle: "Manage cards & UPI",             color: "bg-purple-50 text-purple-500", borderColor: "hover:border-purple-300" },
        { icon: "notifications",   title: "Notifications",     subtitle: "Manage your preferences",        color: "bg-amber-50 text-amber-500", borderColor: "hover:border-amber-300" },
        { icon: "favorite",        title: "Wishlist",          subtitle: "Items you've saved for later",   color: "bg-rose-50 text-rose-500",   borderColor: "hover:border-rose-300" },
        { icon: "help",            title: "Help & Support",    subtitle: "FAQs, contact us, report issue", color: "bg-sky-50 text-sky-500",     borderColor: "hover:border-sky-300" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ─── Header with gradient ─── */}
            <div className="relative overflow-hidden animate-slide-down">
                <div className="bg-gradient-to-br from-primary via-orange-400 to-amber-500 px-6 pt-12 pb-24">
                    {/* Back button */}
                    <a
                        href={ROUTES.CUSTOMER_DASHBOARD}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors mb-6"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Dashboard
                    </a>
                    <h1 className="text-white text-2xl font-bold">My Profile</h1>
                    <p className="text-white/70 text-sm mt-1">Manage your account information</p>
                </div>

                {/* Decorative shapes */}
                <div className="absolute top-8 right-0 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-xl animate-float" />
            </div>

            {/* ─── Avatar Card (overlapping the header) ─── */}
            <div className="px-6 -mt-16 relative z-10 animate-scale-in">
                <div className="bg-white rounded-3xl p-6 shadow-xl ring-1 ring-slate-900/5">
                    <div className="flex items-center gap-5">
                        {/* Avatar with pulse ring */}
                        <div className="relative shrink-0">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatarUrl}
                                    alt={fullName}
                                    className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/20 animate-pulse-ring"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-slate-950 ring-4 ring-primary/20 animate-pulse-ring">
                                    {initial}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2D9E4B] rounded-full flex items-center justify-center border-2 border-white">
                                <span className="material-symbols-outlined text-xs text-slate-950">check</span>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-bold text-slate-900 truncate">{fullName}</h2>
                            <p className="text-sm text-slate-500 truncate">{email}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2D9E4B]/10 text-[#2D9E4B] text-[11px] font-bold">
                                    <span className="material-symbols-outlined text-[12px] fill-1">verified</span>
                                    Customer
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    Since {createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Quick Stats ─── */}
            <div className="px-6 mt-6">
                <div className="grid grid-cols-3 gap-3 animate-fade-in-up delay-200">
                    {[
                        { label: "Orders", value: "0", icon: "receipt_long" },
                        { label: "Wishlist", value: "0", icon: "favorite" },
                        { label: "Addresses", value: "0", icon: "location_on" },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                        >
                            <span className="material-symbols-outlined text-primary text-2xl">{stat.icon}</span>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Menu Cards ─── */}
            <div className="px-6 mt-6 space-y-3">
                {menuItems.map((item, i) => (
                    <a
                        key={item.title}
                        href="#"
                        className={`group flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ${item.borderColor} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up`}
                        style={{ animationDelay: `${0.3 + i * 0.07}s` }}
                    >
                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
                            chevron_right
                        </span>
                    </a>
                ))}
            </div>

            {/* ─── Sign Out Button ─── */}
            <div className="px-6 mt-8 pb-12 animate-fade-in delay-500">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 hover:border-red-300 hover:shadow-lg hover:shadow-red-100 transition-all duration-300 active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
