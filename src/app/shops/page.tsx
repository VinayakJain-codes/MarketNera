import type { Metadata } from "next";
import ShopkeeperNavbar from "@/components/layout/ShopkeeperNavbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import CtaSection from "@/components/sections/CtaSection";
import WaitlistSection from "@/components/sections/WaitlistSection";

export const metadata: Metadata = {
  title: "Partner With MarketNera | Grow Your Local Store Online",
  description:
    "Launch your verified neighborhood digital shop in under 2 minutes. Empower your local business with modern POS, inventory, 30-minute instant delivery, and zero setup fees.",
  keywords: [
    "MarketNera Merchant",
    "Local Store Onboarding",
    "Shopkeeper POS",
    "Digital Storefront Meerut",
    "Retail Partner India",
    "Hyperlocal Delivery Partner",
  ],
  openGraph: {
    title: "Partner With MarketNera | Grow Your Local Store Online",
    description:
      "Join hundreds of local merchants scaling their neighborhood shops with MarketNera digital operating system.",
    type: "website",
  },
};

export default function ShopsLandingPage() {
  return (
    <div className="bg-background-light font-display text-slate-900 antialiased">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <ShopkeeperNavbar />
          <main className="flex-1">
            <HeroSection />
            <FeaturesSection />
            <CategoriesSection />
            <CtaSection />
            <WaitlistSection />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
