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
        <div className="w-full max-w-[480px] md:max-w-3xl mx-auto bg-slate-50 min-h-screen shadow-xl relative">
            {/* ─── Header with gradient ─── */}
            <div className="relative overflow-hidden animate-slide-down rounded-b-[40px] shadow-sm">
                <div className="bg-gradient-to-br from-primary via-[#F97316] to-[#FBBF24] px-6 pt-12 pb-28">
                    {/* Back button */}
                    <a
                        href={ROUTES.CUSTOMER_DASHBOARD}
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-bold transition-colors mb-6 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Dashboard
                    </a>
                    <h1 className="text-white text-3xl font-black tracking-tight drop-shadow-sm">My Profile</h1>
                    <p className="text-white/90 text-sm font-medium mt-1">Manage your account information</p>
                </div>

                {/* Decorative shapes */}
                <div className="absolute top-8 right-0 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl animate-float" />
            </div>

            {/* ─── Avatar Card (overlapping the header) ─── */}
            <div className="px-6 -mt-16 relative z-10 animate-scale-in">
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-slate-100">
                    <div className="flex flex-col items-center gap-4 text-center">
                        {/* Avatar with pulse ring */}
                        <div className="relative shrink-0 -mt-12">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatarUrl}
                                    alt={fullName}
                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-xl animate-pulse-ring"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-white ring-4 ring-white shadow-xl animate-pulse-ring">
                                    {initial}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#22c55e] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                            </div>
                        </div>

                        <div className="min-w-0 w-full">
                            <h2 className="text-2xl font-black text-slate-900 truncate tracking-tight">{fullName}</h2>
                            <p className="text-sm font-medium text-slate-500 truncate mt-0.5">{email}</p>
                            <div className="mt-3 flex items-center justify-center gap-3">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[11px] font-bold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[14px] fill-1">verified</span>
                                    Customer
                                </span>
                                <span className="text-[11px] font-medium text-slate-400">
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
                        { label: "Orders", value: "0", icon: "receipt_long", color: "text-blue-500" },
                        { label: "Wishlist", value: "0", icon: "favorite", color: "text-rose-500" },
                        { label: "Addresses", value: "0", icon: "location_on", color: "text-emerald-500" },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-3xl p-4 text-center shadow-sm border border-slate-100/80 premium-hover"
                            style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                        >
                            <span className={`material-symbols-outlined ${stat.color} text-[28px] drop-shadow-sm`}>{stat.icon}</span>
                            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Menu Cards ─── */}
            <div className="px-6 mt-6 space-y-3">
                {menuItems.map((item, i) => (
                    <a
                        key={item.title}
                        href={item.title === "My Orders" ? ROUTES.CUSTOMER_ORDERS : "#"}
                        className={`group flex items-center gap-4 bg-white rounded-3xl p-4 shadow-sm border border-slate-100/80 premium-hover animate-fade-in-up`}
                        style={{ animationDelay: `${0.3 + i * 0.07}s` }}
                    >
                        <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">{item.title}</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">{item.subtitle}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-slate-400 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">
                                chevron_right
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            {/* ─── Sign Out Button ─── */}
            <div className="px-6 mt-8 pb-12 animate-fade-in delay-500">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-100 bg-white text-red-500 font-black text-sm shadow-sm hover:bg-red-50 hover:border-red-200 transition-all duration-300 premium-active"
                >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
