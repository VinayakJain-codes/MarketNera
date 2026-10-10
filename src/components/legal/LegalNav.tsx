"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { FileText, ShieldCheck, RefreshCw, Truck, Mail, Store } from "lucide-react";

interface NavTab {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const LEGAL_TABS: NavTab[] = [
    { label: "Terms & Conditions", href: ROUTES.TERMS, icon: FileText },
    { label: "Privacy Policy", href: ROUTES.PRIVACY, icon: ShieldCheck },
    { label: "Refund & Exchange", href: ROUTES.REFUND_POLICY, icon: RefreshCw },
    { label: "Shipping & Delivery", href: ROUTES.SHIPPING_POLICY, icon: Truck },
    { label: "Contact Us", href: ROUTES.CONTACT, icon: Mail },
    { label: "Seller Terms", href: ROUTES.SELLER_TERMS, icon: Store },
];

export default function LegalNav() {
    const pathname = usePathname();

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2">
            <nav className="inline-flex min-w-full sm:min-w-0 items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 backdrop-blur-sm shadow-sm" aria-label="Legal document navigation">
                {LEGAL_TABS.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                isActive
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                            }`}
                        >
                            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                            <span>{tab.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
