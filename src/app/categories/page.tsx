import type { Metadata } from "next";
import CustomerNavbar from "@/components/layout/CustomerNavbar";
import Footer from "@/components/layout/Footer";
import { CUSTOMER_CATEGORIES, CATALOG_PRODUCTS } from "@/content/customer";
import ProductCard from "@/components/customer/ProductCard";
import Image from "next/image";
import { Sparkles, ArrowRight, Store } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "All Categories | MarketNera 15-Minute Local Delivery",
  description:
    "Browse local grocery, dairy, fresh vegetables, snacks, and pharmacy categories delivered within 15 minutes from neighborhood stores.",
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 font-display flex flex-col justify-between">
      <CustomerNavbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-12 max-w-7xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Departments &amp; Avenues</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Browse All Product Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl">
            Choose from farm-fresh vegetables, dairy, bakery items, quick snacks, or daily pharmacy supplies delivered in under 15 minutes.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CUSTOMER_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/#${cat.slug}`}
              className="group relative flex flex-col items-center justify-between p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 bg-slate-50 shadow-inner">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="w-full">
                <h2 className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {cat.name}
                </h2>
                <span className="text-[11px] font-bold text-slate-400 mt-0.5 block">
                  {cat.itemCount}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Popular Essentials Shelf */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trending Across All Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Most ordered essentials in your area today
              </p>
            </div>
            <a
              href={ROUTES.HOME}
              className="text-xs sm:text-sm font-extrabold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {CATALOG_PRODUCTS.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Bottom Merchant Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Are you a local shopkeeper or merchant?
            </h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              List your retail store, accept direct customer orders, and unlock 30-minute hyperlocal delivery with MarketNera.
            </p>
          </div>
          <a
            href={ROUTES.SHOPS_HOME}
            className="px-6 py-3.5 bg-white text-emerald-950 font-black rounded-2xl hover:bg-emerald-50 transition-all text-sm shrink-0 shadow-lg flex items-center gap-2"
          >
            <Store className="w-4 h-4 text-emerald-700" />
            <span>Register as Shop Owner</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
