"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, LayoutGrid, ShoppingCart, User as UserIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { supabase } from "@/lib/supabase";

export default function CustomerBottomNav() {
    const pathname = usePathname();
    const [cartCount, setCartCount] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return;
            setIsLoggedIn(Boolean(session?.user));

            if (session?.user) {
                supabase
                    .from("cart_items")
                    .select("id, quantity")
                    .eq("user_id", session.user.id)
                    .then(({ data }) => {
                        if (!isMounted) return;
                        const total = data?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
                        setCartCount(total);
                    });
            } else {
                try {
                    const guestCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
                    const total = guestCart.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 1), 0);
                    if (isMounted) setCartCount(total);
                } catch {
                    if (isMounted) setCartCount(0);
                }
            }
        });

        const handleCartUpdate = () => {
            try {
                const guestCart = JSON.parse(localStorage.getItem("marketnera_guest_cart") || "[]");
                const total = guestCart.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 1), 0);
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

    const navItems = [
        {
            label: "Home",
            href: ROUTES.HOME,
            icon: Home,
            isActive: pathname === "/",
        },
        {
            label: "Shops",
            href: ROUTES.CUSTOMER_SHOPS,
            icon: Store,
            isActive: pathname.startsWith("/customer/shops"),
        },
        {
            label: "Categories",
            href: ROUTES.CATEGORIES,
            icon: LayoutGrid,
            isActive: pathname === "/categories",
        },
        {
            label: "Cart",
            href: ROUTES.CUSTOMER_CART,
            icon: ShoppingCart,
            badge: cartCount > 0 ? cartCount : null,
            isActive: pathname === "/customer/cart",
        },
        {
            label: "Account",
            href: isLoggedIn ? ROUTES.CUSTOMER_PROFILE : ROUTES.LOGIN_CUSTOMER,
            icon: UserIcon,
            isActive: pathname.startsWith("/customer/profile") || pathname.startsWith("/login"),
        },
    ];

    return (
        <nav
            aria-label="Mobile Bottom Navigation"
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-1.5"
        >
            <div className="grid grid-cols-5 h-14 max-w-md mx-auto items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center gap-1 transition-all active:scale-95 py-1 ${
                                item.isActive
                                    ? "text-emerald-700 font-extrabold"
                                    : "text-slate-500 hover:text-slate-900 font-medium"
                            }`}
                        >
                            <div className="relative">
                                <Icon className={`w-5 h-5 transition-transform ${item.isActive ? "stroke-[2.4] scale-110" : "stroke-[1.8]"}`} />
                                {item.badge && (
                                    <span className="absolute -top-1.5 -right-2.5 bg-emerald-700 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full leading-tight shadow-xs ring-2 ring-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] tracking-tight">{item.label}</span>
                            {item.isActive && (
                                <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-emerald-600" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
