"use client";

import { LiveShopSummary } from "@/lib/services/customerCatalog";
import Link from "next/link";
import { Store, MapPin, Clock, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface NeighborhoodShopsProps {
    shops: LiveShopSummary[];
    loading?: boolean;
}

export default function NeighborhoodShops({ shops, loading = false }: NeighborhoodShopsProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                <div className="h-5 w-40 bg-slate-200/80 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-28 rounded-2xl bg-white border border-slate-200/70 p-4 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!shops || shops.length === 0) {
        return null;
    }

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-700" />
                        <span>Neighborhood Stores Near You</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                        Order directly from verified local merchants in Meerut
                    </p>
                </div>

                <Link
                    href={ROUTES.CUSTOMER_SHOPS}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
                >
                    <span>View All Shops</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {shops.map((shop) => (
                    <Link
                        key={shop.id}
                        href={`/shop/${shop.id}`}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                    >
                        <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    {shop.name}
                                </h3>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                                    {shop.category}
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{shop.address}</span>
                            </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{shop.delivery_time_minutes}m delivery</span>
                            </span>
                            <span className="font-semibold text-slate-700">
                                {shop.product_count} {shop.product_count === 1 ? "item" : "items"}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
