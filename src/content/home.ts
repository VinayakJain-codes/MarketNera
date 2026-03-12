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
    heading: "Empowering Local Shopkeepers in the Digital Age",
    subtext:
        "Help your local business compete and thrive online with modern tools for inventory, delivery, and marketing.",
    primaryCta: "Shop Now",
    secondaryCta: "Register Your shop",
    heroImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD1C-bsXfzER13g0lNgxU9LH6PzBrzB3OordTZ5ezDdqUEK0CyigSCUKPvJ_TnKcGwCoY23qCTNcIBjC82IALOssvAw-QKXXk50S0Pndl8NKI1p5J4OQxx6e3xc5l7yKjnOi7RGTLtHtH44D6Bi946B_BcAaHgmeRA-E6oX0Z7hXnYHojdwSidHZbcbxpRQUUY-XzWWBtPiOJ2Nf9yQFvjh5op3XVn1nj5EzSP20YQRzj5QitlKKGpdj0TJplWdfstGvJl43MnFpqUI",
    heroImageAlt: "A local vegetable vendor in a clean modern market setting",
};

export const whyTitle = "Why Marketnera?";
export const whySubtext =
    "Our platform is meticulously designed to bridge the gap between physical storefronts and the digital marketplace.";

export const features: Feature[] = [
    {
        icon: "trending_up",
        title: "Increase Sales",
        description:
            "Leverage powerful SEO and marketing tools to grow your daily revenue automatically.",
    },
    {
        icon: "groups",
        title: "Reach More Customers",
        description:
            "Connect with shoppers in your neighborhood and across the city through our mobile app.",
    },
    {
        icon: "inventory_2",
        title: "Smart Management",
        description:
            "Manage your inventory, orders, and delivery fleet through a seamless dashboard.",
    },
];

export const categoriesSectionTitle = "Browse by Category";
export const categoriesSectionSubtext =
    "Discover top-selling items from local partners";

export const categories: Category[] = [
    {
        name: "Grocery",
        description: "Fresh organic essentials daily",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB202VitgXwM5sug7nubqMb527DL-dIHGvv9AC0lH00KRaAXJcXWmd-LCu-Uq7PaqoBDzOjp5uEouJT4TPqrvTHVLUh4NZclqj7bG5n0LsbrarQO-JyR_ZwTlock5IXPZztxzYshZxP7EXx0UxqjTuhXXuiTorwkfE1U_7U8t9geqvNfujBXADy-UXfBijY6mYf87rfcPeiiMYvwefFTG5tb5TGmYLMsp4FqA14nAzxciPJGwcybq4kY6Gnf36s63tNDXJKxps3WpJr",
        imageAlt: "Fresh grocery produce organized in wooden crates",
        badge: "New Arrival",
        href: ROUTES.MARKETPLACE,
    },
    {
        name: "Sports",
        description: "Professional gear & apparel",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCGM9zvnVC9KjdnKycBiTAt2QfxbSSVixDtfZ1veXOuVduKbt8aQHYnyThgGTuUHh3SyX_oYygroHx72es__uEg0iESDUXJH2hLtRygchHzoAuBJ8NOEM4v4LLWVrPtCC5ADIpo0VbX_NNK7IoegYB94uWNlRXwyo6xKaHPbTn8LuVSyJ3-99yxx57v211X0MVpYYcoHWYeQabXfWTzVywndLN9tFaDjAYq3igrpzPSiz7HUr-s6VK_gzNelkCdn1VGnNFOhEtBe-q7",
        imageAlt: "High quality sports equipment including sneakers and dumbbells",
        href: ROUTES.MARKETPLACE,
    },
    {
        name: "Kitchen Items",
        description: "Modern cooking tools",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB6xF3Bvm-HBxfSsrTR5BfbBsBJshaKi9U70XsuxunBWtvc2Yn-I4BiCgxn3WFeaZyexbhQC5HvpqMH4y1kgLlMjyoG7K3wfc9vrPGMvAuAWSc53YaWncme87gffx1ztDBNjYPJQQ7tYHPz8FWMD-QHhB4DxTau6pyiyb7XPajjCHx-iZWgt7q17GDeb8Dsi3PFydweoEUVxSv8uGAI3psp_7xbC9lCu7Y-3Rzyy970P1iJ2gbpQ3qatnobJr-vdYz87q1KiNxxGXPs",
        imageAlt: "Modern kitchen utensils and cookware on a marble counter",
        href: ROUTES.MARKETPLACE,
    },
    {
        name: "Wardrobe",
        description: "The latest fashion trends",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBiqsLOYBU7z7eH1MLEYIL93EK4DKEHEunr9o7FO91myhxtKAUhMERs01vKDfk_l6bKhlEv4wQbGFaHClt5e-vfMzfv0dMg1xBHlnoMxmW9L2t1wEz3Jy0i2mtICygx98YKcBn3NJCaQXhFDFBjXZbvyd3gzOg2DJlPku3eBkmJtj-3CDpVzI-0BwyizIV17AH-Ju2vMY2SsrL0DkDc433SF6pjcR3pqdrqpCBZPRYrYQE1BPs1W3DnRDfvDHL2F9jBPoM9bTsHa-zk",
        imageAlt: "Stylish clothing hanging on a wooden rack",
        href: ROUTES.MARKETPLACE,
    },
];

export const ctaContent: CtaContent = {
    heading: "Ready to scale your shop?",
    subtext:
        "Join over 5,000+ local shopkeepers who have transformed their business with Marketnera.",
    primaryCta: "Get Started Now",
    secondaryCta: "Contact Sales",
};

export const footerTagline =
    "Modernizing local commerce since 2024. Bridging the gap between local shops and the digital future.";

export const footerColumns: FooterColumn[] = [
    {
        heading: "Platform",
        links: [
            { label: "Features", href: ROUTES.FEATURES },
            { label: "Marketplace", href: ROUTES.MARKETPLACE },
            { label: "Delivery", href: ROUTES.DELIVERY },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About Us", href: ROUTES.ABOUT },
            { label: "Success Stories", href: ROUTES.SUCCESS_STORIES },
            { label: "Careers", href: ROUTES.CAREERS },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "Help Center", href: ROUTES.HELP_CENTER },
            { label: "API Docs", href: ROUTES.API_DOCS },
            { label: "Privacy", href: ROUTES.PRIVACY },
        ],
    },
];

export const socialLinks: SocialLink[] = [
    { platform: "Twitter", href: "https://twitter.com/marketnera" },
    { platform: "LinkedIn", href: "https://linkedin.com/company/marketnera" },
    { platform: "Instagram", href: "https://instagram.com/marketnera" },
];
