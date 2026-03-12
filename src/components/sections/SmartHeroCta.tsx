"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";
import Button from "@/components/ui/Button";

export default function SmartHeroCta() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session?.user);
        });
    }, []);

    const handleShopNow = () => {
        if (isLoggedIn) {
            window.location.href = ROUTES.CUSTOMER_DASHBOARD;
        } else {
            window.location.href = ROUTES.LOGIN_CUSTOMER;
        }
    };

    const handleRegisterShop = () => {
        window.location.href = ROUTES.REGISTER;
    };

    return (
        <div className="flex flex-wrap gap-4">
            <button
                className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer bg-[#13ec5b] text-slate-950 shadow-lg shadow-[#13ec5b]/20 hover:scale-105 h-14 min-w-[180px] px-8 text-base"
                onClick={handleShopNow}
            >
                Shop Now
            </button>
            <button
                className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer border-2 border-[#13ec5b] text-[#13ec5b] hover:bg-[#13ec5b]/5 h-14 min-w-[180px] px-8 text-base"
                onClick={handleRegisterShop}
            >
                Register Your shop
            </button>
        </div>
    );
}
