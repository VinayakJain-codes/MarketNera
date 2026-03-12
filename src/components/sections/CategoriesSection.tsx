import {
    categories,
    categoriesSectionTitle,
    categoriesSectionSubtext,
} from "@/content/home";

export default function CategoriesSection() {
    return (
        <section className="py-24" id="categories">
            <div className="container mx-auto px-6 lg:px-20">
                {/* Header */}
                <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            {categoriesSectionTitle}
                        </h2>
                        <p className="text-slate-600">
                            {categoriesSectionSubtext}
                        </p>
                    </div>
                    <a
                        className="group flex items-center gap-1 font-bold text-[#13ec5b] hover:underline"
                        href="/marketplace"
                    >
                        View All Categories
                        <span
                            className="material-symbols-outlined transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        >
                            chevron_right
                        </span>
                    </a>
                </div>

                {/* Category cards — rendered from data array */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={category.imageUrl}
                                    alt={category.imageAlt}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {category.badge && (
                                    <span className="absolute bottom-4 left-4 rounded bg-[#13ec5b] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">
                                        {category.badge}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-6">
                                <div className="mb-6 flex-1">
                                    <h4 className="text-xl font-bold text-slate-900">
                                        {category.name}
                                    </h4>
                                    <p className="text-sm text-slate-500">
                                        {category.description}
                                    </p>
                                </div>
                                <a
                                    href={category.href}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#13ec5b]/10 py-3 text-sm font-bold text-[#13ec5b] transition-all hover:bg-[#13ec5b] hover:text-slate-950"
                                >
                                    Browse Items
                                    <span className="material-symbols-outlined text-sm" aria-hidden="true">
                                        arrow_forward
                                    </span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
