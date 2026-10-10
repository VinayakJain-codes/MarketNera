import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants/routes";
import { Store, Zap, ShieldCheck } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
      <Navbar />
      <main className="container mx-auto px-6 py-20 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Live in Meerut · Fast 1-Hour Delivery</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Hyperlocal Marketplace
        </h1>
        <p className="text-slate-600 mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
          Order groceries, medicines, snacks, and daily essentials from trusted neighborhood stores right down your street.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href={ROUTES.SIGNUP_CUSTOMER}
            className="px-6 py-3.5 bg-primary text-slate-950 font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20 text-sm uppercase tracking-wider flex items-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>Start Shopping Local</span>
          </a>
          <a
            href={ROUTES.SIGNUP_SHOPKEEPER}
            className="px-6 py-3.5 bg-white text-slate-800 border-2 border-slate-200 font-black rounded-xl hover:border-emerald-600 hover:text-emerald-700 transition-colors text-sm uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Register Your Store</span>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
