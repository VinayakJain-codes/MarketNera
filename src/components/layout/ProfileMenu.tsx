"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ROUTES } from "@/constants/routes";

export default function ProfileMenu() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!user) {
        return (
            <a href={ROUTES.REGISTER}>
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-slate-950 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95">
                    Sign Up
                </button>
            </a>
        );
    }

    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || metadata.name || user.email?.split("@")[0] || "User";
    const avatarUrl = metadata.avatar_url;
    const initial = fullName.charAt(0).toUpperCase();

    return (
        <a
            href={ROUTES.CUSTOMER_PROFILE}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-1.5 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 group"
        >
            <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800 leading-none group-hover:text-primary transition-colors">
                    {fullName}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                    {metadata.role === "shopkeeper" ? "Shopkeeper" : "Customer"}
                </span>
            </div>

            {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary transition-all duration-300"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-slate-950 ring-2 ring-primary/20 group-hover:ring-primary transition-all duration-300">
                    {initial}
                </div>
            )}
        </a>
    );
}
