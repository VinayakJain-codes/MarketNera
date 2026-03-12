import Button from "@/components/ui/Button";
import { ctaContent } from "@/content/home";
import { LIMITS } from "@/constants/limits";
import siteConfig from "@/config/site";

export default function CtaSection() {
    const { heading, primaryCta, secondaryCta } = ctaContent;

    // Compose subtext using config constants — no magic numbers
    const subtext = `Join over ${LIMITS.SHOPKEEPER_COUNT.toLocaleString()}+ local shopkeepers who have transformed their business with ${siteConfig.name}.`;

    return (
        <section className="relative bg-[#102216] py-24 text-slate-100" id="cta">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-10 space-y-4">
                        <h2 className="text-4xl font-black lg:text-6xl">{heading}</h2>
                        <p className="mx-auto max-w-2xl text-lg text-slate-400 lg:text-xl">
                            {subtext}
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <button className="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer bg-[#13ec5b] text-slate-950 shadow-lg shadow-[#13ec5b]/20 hover:scale-105 h-14 min-w-[180px] px-8 text-base">
                            {primaryCta}
                        </button>
                        <Button variant="ghost" size="lg" className="bg-[#1C2C23] border border-white/10 hover:bg-[#253A2E] text-white">
                            {secondaryCta}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#13ec5b]/10 blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#13ec5b]/5 blur-[100px]" />
            </div>
        </section>
    );
}
