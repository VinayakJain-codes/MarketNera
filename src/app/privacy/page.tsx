import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />
      <main className="container mx-auto px-6 py-20 max-w-3xl">
        <h1 className="text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 mt-4">Last updated: March 2026</p>
        <div className="mt-8 space-y-6 text-slate-600 leading-relaxed">
          <p>
            Marketnera (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting
            your personal information and your right to privacy.
          </p>
          <h2 className="text-xl font-bold text-slate-800">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as your
            name, email address, and location when you register for an account.
          </p>
          <h2 className="text-xl font-bold text-slate-800">How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, process transactions, and communicate with you.
          </p>
          <h2 className="text-xl font-bold text-slate-800">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at hello@marketnera.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
