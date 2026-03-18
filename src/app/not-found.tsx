import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light text-center px-6">
      <h1 className="text-8xl font-black text-primary">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-4">
        Page Not Found
      </h2>
      <p className="text-slate-500 mt-2 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href={ROUTES.HOME}
        className="mt-8 px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
      >
        Go Back Home
      </a>
    </div>
  );
}
