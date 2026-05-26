import WaitlistSection from "@/components/sections/WaitlistSection";
import Logo from "@/components/layout/Logo";
import Link from "next/link";

export const metadata = {
  title: "Coming Soon — MarketNera",
  description: "MarketNera is launching soon! Join the waitlist to be among the first to experience India's next-generation local service marketplace.",
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/15 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-3xl animate-float delay-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10">
        {/* Top nav */}
        <nav className="flex items-center justify-between px-6 py-6 max-w-5xl mx-auto">
          <Logo />
          <Link
            href="/"
            className="text-xs text-white/50 hover:text-white/80 transition-colors border border-white/10 rounded-full px-4 py-1.5 hover:border-white/30"
          >
            ← Back to Home
          </Link>
        </nav>

        {/* Hero section */}
        <div className="text-center px-4 pt-10 pb-4 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-xs font-semibold text-orange-300 uppercase tracking-wider">
              Launching Soon
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 leading-tight">
            MarketNera is
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
              Launching Soon 🚀
            </span>
          </h1>

          <p className="text-white/60 text-lg max-w-xl mx-auto mb-4 leading-relaxed">
            MarketNera is India&apos;s next-generation local marketplace — connecting customers with
            local shops, delivery partners, and career opportunities in one seamless platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {["🛒 Local Shopping", "🛵 Fast Delivery", "🏪 Shop Owners", "💼 Career Services"].map((feat) => (
              <span
                key={feat}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70"
              >
                {feat}
              </span>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-white/40 text-xs mb-2">
            <span>🔒 Your data is safe</span>
            <span>·</span>
            <span>📧 No spam, ever</span>
            <span>·</span>
            <span>🚀 Free to join</span>
          </div>
        </div>

        {/* Waitlist Form */}
        <WaitlistSection dark={true} />

        {/* Footer */}
        <div className="text-center pb-10 text-white/30 text-xs">
          <p>© 2026 MarketNera. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
