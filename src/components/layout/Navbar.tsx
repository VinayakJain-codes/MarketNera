import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { navItems } from "@/content/home";
import { ROUTES } from "@/constants/routes";
import ProfileMenu from "@/components/layout/ProfileMenu";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-background-light/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-20">
                {/* Brand */}
                <div className="flex items-center gap-4">
                    <a href={ROUTES.HOME} aria-label="Go to homepage" className="flex-shrink-0">
                        <Logo />
                    </a>
                    {/* Launching Soon Banner */}
                    <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 shadow-[0_0_12px_rgba(249,115,22,0.05)] animate-pulse-badge hover:bg-[#f97316]/15 transition-all">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f97316]"></span>
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-extrabold text-[#f97316] uppercase tracking-wider flex items-center gap-1">
                            <span>Launching Soon</span>
                            <span className="inline-block animate-bounce">🚀</span>
                        </span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#2D9E4B]"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <ProfileMenu />
                </div>
            </div>
        </header>
    );
}
