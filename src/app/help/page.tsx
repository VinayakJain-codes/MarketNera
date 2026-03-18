import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-4xl font-black text-slate-900">Help Center</h1>
        <p className="text-slate-500 mt-4 max-w-md">
          Need help? Our support team is here for you.
          Email us at hello@marketnera.com
        </p>
        <a
          href="mailto:hello@marketnera.com"
          className="mt-6 px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
        >
          Contact Support
        </a>
      </main>
      <Footer />
    </div>
  );
}
