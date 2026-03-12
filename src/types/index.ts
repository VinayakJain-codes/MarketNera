import { ROUTES } from "@/constants/routes";

/** A single navigation link item */
export interface NavItem {
    label: string;
    href: string;
}

/** A feature/benefit card displayed in the Features section */
export interface Feature {
    icon: string; // Material Symbols icon name
    title: string;
    description: string;
}

/** A product category card */
export interface Category {
    name: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    badge?: string; // Optional label e.g. "New Arrival"
    href: string;
}

/** A column of links in the footer */
export interface FooterColumn {
    heading: string;
    links: NavItem[];
}

/** A social media link */
export interface SocialLink {
    platform: string;
    href: string;
}

/** Hero section content shape */
export interface HeroContent {
    eyebrow: string;
    heading: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
    heroImageUrl: string;
    heroImageAlt: string;
}

/** CTA section content shape */
export interface CtaContent {
    heading: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
}

export { ROUTES };
