import Button from "@/components/ui/Button";
import { heroContent } from "@/content/home";
import featureFlags from "@/config/features";
import SmartHeroCta from "@/components/sections/SmartHeroCta";

export default function HeroSection() {
    const { eyebrow, heading, subtext, primaryCta, secondaryCta, heroImageUrl, heroImageAlt } =
        heroContent;

    return (
        <section className="relative overflow-hidden py-16 lg:py-24" id="hero">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Text content */}
                    <div className="flex flex-col space-y-8">
                        <div className="space-y-4">
                            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#13ec5b]">
                                {eyebrow}
                            </span>
                            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 lg:text-7xl">
                                {heading}
                            </h1>
                            <p className="max-w-xl text-lg leading-relaxed text-slate-600 lg:text-xl">
                                {subtext}
                            </p>
                        </div>
                        <SmartHeroCta />
                    </div>

                    {/* Hero image */}
                    <div className="relative">
                        <div className="aspect-video w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-900/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={heroImageUrl}
                                alt={heroImageAlt}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-2xl bg-[#13ec5b]/20 blur-2xl lg:block" />
                        <div className="absolute -right-6 -top-6 hidden h-32 w-32 rounded-full bg-[#13ec5b]/10 blur-3xl lg:block" />
                    </div>
                </div>
            </div>
        </section>
    );
}
