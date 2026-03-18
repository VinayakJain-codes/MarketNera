import Card from "@/components/ui/Card";
import { features, whyTitle, whySubtext } from "@/content/home";

export default function FeaturesSection() {
    return (
        <section className="bg-[#2D9E4B]/5 py-24" id="features">
            <div className="container mx-auto px-6 lg:px-20">
                {/* Heading */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                        {whyTitle}
                    </h2>
                    <p className="max-w-2xl text-lg text-slate-600">
                        {whySubtext}
                    </p>
                </div>

                {/* Feature cards — rendered from data, not hardcoded */}
                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title} className="group flex flex-col space-y-6">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#2D9E4B]/10 text-[#2D9E4B] transition-colors group-hover:bg-[#2D9E4B] group-hover:text-slate-950">
                                <span className="material-symbols-outlined text-3xl" aria-hidden="true">
                                    {feature.icon}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="leading-relaxed text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
