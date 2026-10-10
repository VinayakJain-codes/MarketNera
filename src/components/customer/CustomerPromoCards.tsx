"use client";

import Image from "next/image";
import { ROUTES } from "@/constants/routes";

interface PromoCardData {
    id: string;
    title: string;
    subtitle: string;
    ctaText: string;
    bgGradient: string;
    badgeText: string;
    imageUrl: string;
    imageAlt: string;
    filterSlug: string;
}

const PROMO_CARDS: PromoCardData[] = [
    {
        id: "promo-pharmacy",
        title: "Pharmacy at your doorstep!",
        subtitle: "Cough syrups, pain relief sprays, vitamins & more",
        ctaText: "Order Now",
        bgGradient: "from-[#00989e] to-[#007077]",
        badgeText: "24x7 Available",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
        imageAlt: "Medicines, syrups and pharmacy essentials",
        filterSlug: "pharmacy",
    },
    {
        id: "promo-pet",
        title: "Pet care supplies at your door",
        subtitle: "Food, treats, toys, grooming & health care",
        ctaText: "Order Now",
        bgGradient: "from-[#f29f05] to-[#d67b00]",
        badgeText: "Pet Lovers",
        imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80",
        imageAlt: "Cute dog and pet care products",
        filterSlug: "pet-care",
    },
    {
        id: "promo-baby",
        title: "No time for a diaper run?",
        subtitle: "Get baby care essentials & wipes in 15 mins",
        ctaText: "Order Now",
        bgGradient: "from-[#6392b4] to-[#406e91]",
        badgeText: "Baby Care",
        imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80",
        imageAlt: "Mother and baby essentials",
        filterSlug: "baby-care",
    },
];

interface CustomerPromoCardsProps {
    onSelectFilter?: (slug: string) => void;
}

export default function CustomerPromoCards({ onSelectFilter }: CustomerPromoCardsProps) {
    return (
        <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {PROMO_CARDS.map((card) => (
                    <div
                        key={card.id}
                        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgGradient} text-white p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group min-h-[200px] sm:min-h-[220px]`}
                    >
                        {/* Decorative circle glow */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Top Text */}
                        <div className="z-10 max-w-[65%] space-y-2">
                            <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                {card.badgeText}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-xs">
                                {card.title}
                            </h3>
                            <p className="text-white/90 text-xs sm:text-sm font-medium line-clamp-2">
                                {card.subtitle}
                            </p>
                        </div>

                        {/* Action CTA */}
                        <div className="z-10 pt-4">
                            <button
                                onClick={() => onSelectFilter?.(card.filterSlug)}
                                className="px-5 py-2.5 rounded-xl bg-slate-950/90 text-white hover:bg-slate-900 font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                            >
                                {card.ctaText}
                            </button>
                        </div>

                        {/* Card Image Floating Right */}
                        <div className="absolute right-2 -bottom-2 w-32 sm:w-36 h-32 sm:h-36 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 ring-2 ring-white/20">
                            <Image
                                src={card.imageUrl}
                                alt={card.imageAlt}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
