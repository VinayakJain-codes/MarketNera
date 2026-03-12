import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import CtaSection from "@/components/sections/CtaSection";

export default function Page() {
  return (
    <div className="bg-background-light font-display text-slate-900 antialiased">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Navbar />
          <main className="flex-1">
            <HeroSection />
            <FeaturesSection />
            <CategoriesSection />
            <CtaSection />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}