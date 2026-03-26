"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";
import { getURL } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Logo from "@/components/layout/Logo";

export default function ShopkeeperLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            setIsError(true);
            setLoading(false);
        } else if (authData?.user) {
            import("@/lib/services/shopkeeper").then(async ({ getShopkeeperProfile }) => {
                try {
                    const profile = await getShopkeeperProfile(authData.user.id);
                    if (profile) {
                        window.location.href = ROUTES.SHOPKEEPER_DASHBOARD;
                    } else {
                        window.location.href = ROUTES.SHOPKEEPER_SETUP;
                    }
                } catch (err) {
                    window.location.href = ROUTES.SHOPKEEPER_SETUP;
                }
            });
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${getURL()}${ROUTES.SHOPKEEPER_SETUP.substring(1)}`,
                queryParams: {
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        });
        if (error) {
            setMessage(error.message);
            setIsError(true);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4">
            {/* Decorative blobs - Orange and Green for Shopkeeper theme */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#138808]/10 blur-3xl animate-float delay-150" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#FF9933]/10 blur-3xl animate-float delay-500" />

            <div className="relative z-10 w-full max-w-md animate-scale-in">
                <div className="auth-card rounded-3xl p-10 shadow-2xl ring-1 ring-[#138808]/5 bg-white border border-[#138808]/20">
                    {/* Logo */}
                    <div className="flex justify-center animate-fade-in-up">
                        <Logo />
                    </div>

                    <div className="mt-6 text-center animate-fade-in-up delay-100">
                        <h1 className="text-3xl font-extrabold text-slate-900">
                            Welcome Back
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Sign in to your shop owner account
                        </p>
                    </div>

                    {/* Google Button */}
                    <div className="mt-8 animate-fade-in-up delay-200">
                        <button
                            onClick={handleGoogleLogin}
                            className="google-btn flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Sign in with Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6 animate-fade-in delay-200">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-4 text-slate-400">or sign in with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4 animate-fade-in-up delay-300" onSubmit={handleLogin}>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="auth-input block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-[#138808] focus:ring-1 focus:ring-[#138808] outline-none transition-all placeholder-slate-400"
                                placeholder="shop@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="auth-input block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-[#138808] focus:ring-1 focus:ring-[#138808] outline-none transition-all placeholder-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {message && (
                            <div className={`text-sm text-center p-3 rounded-xl border animate-fade-in ${isError ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"}`}>
                                {message}
                            </div>
                        )}

                        <Button type="submit" variant="primary" size="lg" className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-400 animate-fade-in delay-500">
                        Don't have a shop account yet?{" "}
                        <a href={ROUTES.SIGNUP_SHOPKEEPER} className="font-semibold text-[#138808] hover:text-[#FF9933] transition-colors">
                            Partner with Us
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
