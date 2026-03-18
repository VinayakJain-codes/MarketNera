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
                <a href={ROUTES.HOME} aria-label="Go to homepage">
                    <Logo />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
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
