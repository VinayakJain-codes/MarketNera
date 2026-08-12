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
    { label: "About", href: ROUTES.ABOUT },
];

export const heroContent: HeroContent = {
    eyebrow: "Digital Transformation",
    heading: "Growth. Local. Yours.",
    subtext: "Help your local business compete and thrive online with modern tools for inventory, delivery, and marketing.",
    primaryCta: "Start Free Trial",
    secondaryCta: "Book a Demo",
    heroImageUrl: "/HeroImage.webp",
    heroImageAlt: "MarketNera Platform Interface",
};

export const whyTitle = "Engineered for Hyperlocal Commerce";
export const whySubtext = "A complete, modern digital operating system bridging neighborhood shops, instant local delivery, and digital customers seamlessly.";

export const features: Feature[] = [
    {
        id: "storefront",
        icon: "Store",
        title: "Instant Digital Storefront & Smart POS",
        description: "Launch your verified neighborhood digital shop in under 2 minutes. Scan barcodes, organize inventory, manage SKU variants, and receive direct customer orders seamlessly.",
        category: "shopkeeper",
        badge: "Zero Setup Fee",
        highlight: "QR Catalog & Barcode Scanner",
        stat: { value: "< 2 Mins", label: "Store Onboarding" },
        gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        action: { label: "Register Your Shop", href: ROUTES.SIGNUP_SHOPKEEPER },
        isHero: true,
    },
    {
        id: "instant-delivery",
        icon: "Zap",
        title: "Lightning 30-Minute Local Delivery",
        description: "Order groceries, medicines, snacks, and daily essentials from trusted stores down your street with live rider telemetry and guaranteed under-30-minute doorstep delivery.",
        category: "customer",
        badge: "Hyperlocal SLA",
        highlight: "Live Turn-by-Turn GPS Tracking",
        stat: { value: "< 30 Min", label: "Doorstep Delivery" },
        gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
        action: { label: "Explore Marketplace", href: ROUTES.MARKETPLACE },
        isHero: true,
    },
    {
        id: "analytics",
        icon: "TrendingUp",
        title: "Real-Time Revenue & Inventory Analytics",
        description: "Stay ahead with live daily revenue dashboards, gross margins, best-selling product reports, customer retention metrics, and automated low-stock replenishment warnings.",
        category: "shopkeeper",
        badge: "Smart Intelligence",
        highlight: "Low-Stock Predictive Warnings",
        stat: { value: "+34.8%", label: "Avg. Revenue Growth" },
        gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
        action: { label: "View Analytics Demo", href: ROUTES.SIGNUP_SHOPKEEPER },
    },
    {
        id: "payments",
        icon: "CreditCard",
        title: "Zero-Friction UPI & Instant Settlements",
        description: "Supports Google Pay, PhonePe, Paytm, Debit/Credit cards, NetBanking, and verified Cash-on-Delivery with Razorpay escrow protection and same-day direct bank transfers.",
        category: "tech",
        badge: "Bank Grade Security",
        highlight: "Same-Day Direct Bank Settlements",
        stat: { value: "0%", label: "Platform Hidden Fees" },
        gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
        action: { label: "Learn About Payments", href: ROUTES.ABOUT },
    },
    {
        id: "pwa",
        icon: "Smartphone",
        title: "Offline-Ready Progressive Web App (PWA)",
        description: "Ultra-fast web app that installs directly to your home screen without bulky app store downloads. Operates smoothly and caches catalogs even on spotty 2G/3G network conditions.",
        category: "tech",
        badge: "Next-Gen Web App",
        highlight: "Offline Catalog Caching",
        stat: { value: "< 1.2s", label: "Instant App Load" },
        gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
        action: { label: "Install MarketNera App", href: ROUTES.HOME },
    },
    {
        id: "chat",
        icon: "MessageSquare",
        title: "Direct Merchant Chat & WhatsApp Sync",
        description: "Bridge the physical-to-digital gap. Send specific brand requests, ask for custom grocery cuts, or request instant product substitutions over direct merchant chat.",
        category: "customer",
        badge: "Personal Touch",
        highlight: "1-Click WhatsApp Order Bridge",
        stat: { value: "100%", label: "Direct Communication" },
        gradient: "from-green-500/20 via-green-500/5 to-transparent",
        action: { label: "Shop Local", href: ROUTES.MARKETPLACE },
    },
    {
        id: "fleet",
        icon: "Navigation",
        title: "Smart Proximity Routing & Fleet Telemetry",
        description: "Intelligent order-to-rider batching algorithms maximize rider earnings while minimizing transit times through precision Leaflet and OpenStreetMap geocoding.",
        category: "delivery",
        badge: "Optimized Logistics",
        highlight: "Clustered Multi-Drop Routing",
        stat: { value: "4.8 / 5.0", label: "Rider Satisfaction" },
        gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
        action: { label: "Deliver with Us", href: ROUTES.DELIVERY },
    },
    {
        id: "trust",
        icon: "ShieldCheck",
        title: "Verified Neighborhood Trust & Buyer Protection",
        description: "Every registered merchant undergoes identity and physical location verification. Enjoy peace of mind with fresh guarantees, transparent returns, and dedicated support.",
        category: "tech",
        badge: "Verified Sellers",
        highlight: "100% Genuine Quality Guarantee",
        stat: { value: "99.9%", label: "Dispute Resolution Rate" },
        gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        action: { label: "Trust & Safety", href: ROUTES.ABOUT },
    },
];

export const categoriesSectionTitle = "Browse by Category";
export const categoriesSectionSubtext = "Discover fresh produce, daily essentials, and local goods from verified neighborhood partners";

export const categories: Category[] = [
    {
        name: "Grocery & Fresh Produce",
        description: "Farm-fresh vegetables, fruits, dairy, and everyday kitchen staples",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Fresh vegetables and fruits arranged neatly in a local grocery store",
        badge: "Daily Fresh",
        href: ROUTES.MARKETPLACE,
    },
    {
        name: "Pharmacy & Wellness",
        description: "OTC medicines, first aid, baby care, vitamins, and wellness essentials",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Pharmacy and medical wellness products",
        badge: "Under 20 Mins",
        href: ROUTES.MARKETPLACE,
    },
    {
        name: "Snacks, Bakery & Beverages",
        description: "Artisan breads, namkeens, cold drinks, teas, and midnight cravings",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Freshly baked artisan bread and pastry treats",
        badge: "Trending",
        href: ROUTES.MARKETPLACE,
    },
    {
        name: "Electronics & Daily Tech",
        description: "Chargers, cables, batteries, headphones, and computer accessories",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Modern headphones and electronics accessories",
        badge: "Verified Warranty",
        href: ROUTES.MARKETPLACE,
    },
];

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
            { label: "About Us",        href: ROUTES.ABOUT },
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
