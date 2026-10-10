import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants/routes";
import { Truck, Zap, Navigation } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased flex flex-col justify-between">
      <Navbar />
      <main className="container mx-auto px-6 py-20 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Active Hyperlocal Fleet · Meerut, UP</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Neighborhood Delivery Fleet
        </h1>
        <p className="text-slate-600 mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
          Dedicated local delivery partners ensuring your orders from neighborhood shops reach your doorstep within 1 hour.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href={ROUTES.SHIPPING_POLICY}
            className="px-6 py-3.5 bg-primary text-slate-950 font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20 text-sm uppercase tracking-wider flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Delivery Policy &amp; SLA</span>
          </a>
          <a
            href={ROUTES.CONTACT}
            className="px-6 py-3.5 bg-white text-slate-800 border-2 border-slate-200 font-black rounded-xl hover:border-primary transition-colors text-sm uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>Join as Delivery Partner</span>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
