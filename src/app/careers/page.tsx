import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="text-4xl font-black text-slate-900">Careers</h1>
        <p className="text-slate-500 mt-4 max-w-md">
          Join us in empowering local shopkeepers.
          We are currently building our core team.
        </p>
        <span className="mt-6 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-full">
          Openings Coming Soon
        </span>
      </main>
      <Footer />
    </div>
  );
}
