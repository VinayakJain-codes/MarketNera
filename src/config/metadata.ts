import type { Metadata } from "next";
import siteConfig from "./site";

const siteMetadata: Metadata = {
    title: {
        default: `${siteConfig.name} — ${siteConfig.tagline}`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
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
};

export default siteMetadata;
