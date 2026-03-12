import Logo from "@/components/layout/Logo";
import { footerColumns, socialLinks, footerTagline } from "@/content/home";
import siteConfig from "@/config/site";
import { LIMITS } from "@/constants/limits";

export default function Footer() {
    return (
        <footer className="border-t border-primary/10 bg-background-light py-16">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                            <span className="material-symbols-outlined text-3xl" aria-hidden="true">
                                shopping_bag
                            </span>
                            <span>{siteConfig.name}</span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                            {footerTagline}
                        </p>
                    </div>

                    {/* Link columns */}
                    {footerColumns.map((col) => (
                        <div key={col.heading} className="space-y-6">
                            <h5 className="text-sm font-bold uppercase tracking-widest">
                                {col.heading}
                            </h5>
                            <nav className="flex flex-col space-y-3" aria-label={`${col.heading} links`}>
                                {col.links.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm text-slate-500 transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 border-t border-primary/10 pt-8">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <p className="text-xs tracking-wide text-slate-500">
                            © {LIMITS.FOUNDING_YEAR} {siteConfig.name} Inc. All rights reserved.
                        </p>
                        <div className="flex gap-8">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.platform}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-primary"
                                >
                                    {social.platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
