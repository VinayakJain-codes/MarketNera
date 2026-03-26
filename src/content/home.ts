import type {
    NavItem,
    Feature,
    Category,
    FooterColumn,
    SocialLink,
    HeroContent,
    CtaContent,
} from "@/types";
import { ROUTES } from "@/constants/routes";

export const navItems: NavItem[] = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Features", href: ROUTES.FEATURES },
    { label: "Pricing", href: ROUTES.PRICING },
];

export const heroContent: HeroContent = {
    eyebrow: "Digital Transformation",
    heading: "Growth. Local. Yours.",
    subtext: "Help your local business compete and thrive online with modern tools for inventory, delivery, and marketing.",
    primaryCta: "Shop Now",
    secondaryCta: "Register Your shop",
    heroImageUrl: "", // Removed dummy image
    heroImageAlt: "Marketnera Marketplace",
};

export const whyTitle = "Why Marketnera?";
export const whySubtext = "Our platform is meticulously designed to bridge the gap between physical storefronts and the digital marketplace.";

export const features: Feature[] = []; // Data removed

export const categoriesSectionTitle = "Browse by Category";
export const categoriesSectionSubtext = "Discover top-selling items from local partners";

export const categories: Category[] = []; // Data removed

export const ctaContent: CtaContent = {
    heading: "Ready to scale your shop?",
    subtext: "Join local shopkeepers who have transformed their business with Marketnera.",
    primaryCta: "Get Started Now",
    secondaryCta: "Contact Sales",
};

export const footerTagline =
    "Growth. Local. Yours. Modernizing local commerce since 2024.";

export const footerColumns: FooterColumn[] = [
    {
        heading: "Platform",
        links: [
            { label: "Features",       href: "/#features" },
            { label: "Categories",     href: "/#categories" },
            { label: "Register Shop",  href: ROUTES.REGISTER },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About Us",        href: "#" },
            { label: "Success Stories", href: "#" },
            { label: "Careers",         href: "#" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "Help Center",    href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Contact Us",     href: "#" },
        ],
    },
];

export const socialLinks: SocialLink[] = [
    { platform: "Twitter", href: "https://twitter.com/marketnera" },
    { platform: "LinkedIn", href: "https://linkedin.com/company/marketnera" },
    { platform: "Instagram", href: "https://instagram.com/marketnera" },
];
