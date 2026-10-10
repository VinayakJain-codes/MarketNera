import type { Metadata } from "next";
import siteConfig from "./site";

const extractGoogleToken = (val?: string) => {
    if (!val) return "google-site-verification-marketnera";
    const contentMatch = val.match(/content=["']([^"']+)["']/i);
    if (contentMatch) return contentMatch[1];
    return val.replace(/^google-site-verification=/, "").replace(/['"]/g, "").trim();
};

const siteMetadata: Metadata = {
    title: {
        default: `${siteConfig.name} — ${siteConfig.tagline}`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    verification: {
        google: extractGoogleToken(
            process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
            process.env.GOOGLE_SITE_VERIFICATION
        ),
    },
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: `${siteConfig.name} — ${siteConfig.tagline}`,
        description: siteConfig.description,
    },
    twitter: {
        card: "summary_large_image",
        title: `${siteConfig.name} — ${siteConfig.tagline}`,
        description: siteConfig.description,
        site: "@marketnera",
    },
    robots: {
        index: true,
        follow: true,
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "MarketNera",
    },
};

export default siteMetadata;
