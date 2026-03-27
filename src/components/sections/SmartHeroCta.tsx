"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";
import { LayoutDashboard, Store } from "lucide-react";

type UserRole = "shopkeeper" | "customer" | null;

export default function SmartHeroCta() {
    const [role, setRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const detectRole = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setRole(null);
                setIsLoading(false);
                return;
            }

            // Check if user has a shopkeeper profile
            try {
                const { data } = await supabase
                    .from("shopkeeper")
                    .select("user_id")
                    .eq("user_id", session.user.id)
                    .single();
                
                setRole(data ? "shopkeeper" : "customer");
            } catch {
                setRole("customer");
            }

            setIsLoading(false);
        };

        detectRole();
    }, []);

    const handleShopNow = () => {
        if (role === "shopkeeper") {
            window.location.href = ROUTES.CUSTOMER_DASHBOARD;
        } else if (role === "customer") {
            window.location.href = ROUTES.CUSTOMER_DASHBOARD;
        } else {
            window.location.href = ROUTES.LOGIN_CUSTOMER;
        }
    };

    const handleRegisterShop = () => {
        window.location.href = ROUTES.REGISTER;
    };

    const handleGoToDashboard = () => {
        if (role === "shopkeeper") {
            window.location.href = ROUTES.SHOPKEEPER_DASHBOARD;
        } else {
            window.location.href = ROUTES.CUSTOMER_DASHBOARD;
        }
    };

    // While detecting role, show skeleton placeholders
    if (isLoading) {
        return (
            <div className="flex flex-wrap gap-4">
                <div className="h-14 w-44 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-14 w-44 animate-pulse rounded-xl bg-slate-100" />
            </div>
        );
    }

    // Logged-in user: show "Go to Dashboard" + "Shop Now"
    if (role !== null) {
        return (
            <div className="flex flex-wrap gap-4">
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer bg-[#2D9E4B] text-white shadow-lg shadow-[#2D9E4B]/20 hover:scale-105 h-14 min-w-[180px] px-8 text-base"
                    onClick={handleGoToDashboard}
                >
                    <LayoutDashboard className="h-5 w-5" />
                    {role === "shopkeeper" ? "My Shop Dashboard" : "My Dashboard"}
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer border-2 border-[#2D9E4B] text-[#2D9E4B] hover:bg-[#2D9E4B]/5 h-14 min-w-[160px] px-8 text-base"
                    onClick={handleShopNow}
                >
                    Shop Now
                </motion.button>
            </div>
        );
    }

    // Logged-out: show original CTAs
    return (
        <div className="flex flex-wrap gap-4">
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer bg-[#2D9E4B] text-slate-950 shadow-lg shadow-[#2D9E4B]/20 hover:scale-105 h-14 min-w-[180px] px-8 text-base"
                onClick={handleShopNow}
            >
                Shop Now
            </motion.button>
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer border-2 border-[#2D9E4B] text-[#2D9E4B] hover:bg-[#2D9E4B]/5 h-14 min-w-[180px] px-8 text-base"
                onClick={handleRegisterShop}
            >
                <Store className="h-5 w-5" />
                Register Your Shop
            </motion.button>
        </div>
    );
}
