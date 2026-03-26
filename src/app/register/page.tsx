"use client";

import { ROUTES } from "@/constants/routes";
import Logo from "@/components/layout/Logo";

export default function RegisterSelectionPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
            {/* Decorative blobs */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-float" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-float delay-300" />

            <div className="relative z-10 w-full max-w-md animate-scale-in">
                {/* Card */}
                <div className="auth-card rounded-3xl p-10 shadow-2xl ring-1 ring-slate-900/5">
                    {/* Logo */}
                    <div className="flex justify-center animate-fade-in-up">
                        <Logo />
                    </div>

                    <div className="mt-8 text-center animate-fade-in-up delay-100">
                        <h1 className="text-3xl font-extrabold text-slate-900">
                            Join Marketnera
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Select how you'd like to get started
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col gap-4">
                        {/* Customer */}
                        <a
                            href={ROUTES.SIGNUP_CUSTOMER}
                            className="group relative flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 animate-fade-in-up delay-200"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <span className="material-symbols-outlined text-2xl">person</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">I am a Customer</p>
                                <p className="text-xs text-slate-500">Browse and shop from local stores</p>
                            </div>
                            <span className="material-symbols-outlined ml-auto text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                                arrow_forward
                            </span>
                        </a>

                        {/* Shopkeeper */}
                        <a
                            href={ROUTES.SIGNUP_SHOPKEEPER}
                            className="group relative flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 animate-fade-in-up delay-300"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <span className="material-symbols-outlined text-2xl">storefront</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">I am a Shopkeeper</p>
                                <p className="text-xs text-slate-500">List your shop and grow your business</p>
                            </div>
                            <span className="material-symbols-outlined ml-auto text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                                arrow_forward
                            </span>
                        </a>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-400 animate-fade-in delay-400">
                        Already have an account?{" "}
                        <a href={ROUTES.LOGIN_CUSTOMER} className="font-semibold text-primary hover:text-green-600 transition-colors">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
