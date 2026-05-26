"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface WaitlistSectionProps {
  /** If true, renders in a darker/hero style (used on coming-soon page) */
  dark?: boolean;
}

export default function WaitlistSection({ dark = false }: WaitlistSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: dbError } = await supabase.from("waitlist").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      suggestions: suggestions.trim() || null,
    });

    if (dbError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  const bg = dark
    ? "bg-transparent"
    : "bg-gradient-to-br from-orange-50 via-white to-orange-50";

  const cardBg = dark
    ? "bg-white/10 backdrop-blur-md border border-white/20"
    : "bg-white border border-orange-100 shadow-xl shadow-orange-500/5";

  const labelColor = dark ? "text-white/80" : "text-slate-600";
  const inputClass = dark
    ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-orange-400 focus:ring-orange-400/30"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:ring-orange-400/20";
  const headingColor = dark ? "text-white" : "text-slate-900";
  const subColor = dark ? "text-white/70" : "text-slate-500";

  if (submitted) {
    return (
      <section id="waitlist" className={`${bg} py-20 px-4`}>
        <div className="mx-auto max-w-lg text-center">
          <div className={`${cardBg} rounded-3xl p-10`}>
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className={`text-2xl font-extrabold ${headingColor} mb-2`}>You&apos;re on the list! 🎉</h3>
            <p className={`${subColor} text-sm`}>
              Thank you for joining the MarketNera waitlist. We&apos;ll be in touch as soon as we launch!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className={`${bg} py-20 px-4`}>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
            Early Access
          </span>
          <h2 className={`text-4xl font-extrabold ${headingColor} mb-3`}>
            Join the Waitlist
          </h2>
          <p className={`${subColor} text-base max-w-md mx-auto`}>
            Be the first to know when MarketNera launches in your city. Your feedback shapes what we build.
          </p>
        </div>

        {/* Form Card */}
        <div className={`${cardBg} rounded-3xl p-8`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Email row */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${labelColor}`} htmlFor="waitlist-name">
                  Full Name *
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className={`auth-input block w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${inputClass}`}
                />
              </div>
              <div>
                <label className={`mb-1.5 block text-xs font-semibold ${labelColor}`} htmlFor="waitlist-email">
                  Email Address *
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`auth-input block w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${inputClass}`}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${labelColor}`} htmlFor="waitlist-role">
                I want to join as *
              </label>
              <select
                id="waitlist-role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`auth-input block w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${inputClass} cursor-pointer`}
              >
                <option value="customer">🛒 Customer — I want to shop locally</option>
                <option value="shopkeeper">🏪 Shop Owner — I want to list my store</option>
                <option value="delivery">🛵 Delivery Partner — I want to deliver</option>
                <option value="other">🌟 Other / Just curious</option>
              </select>
            </div>

            {/* Suggestions */}
            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${labelColor}`} htmlFor="waitlist-suggestions">
                Any thoughts or suggestions? <span className={`${subColor} font-normal`}>(optional)</span>
              </label>
              <textarea
                id="waitlist-suggestions"
                rows={3}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="What features would you love to see? What city are you from?"
                className={`auth-input block w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 resize-none ${inputClass}`}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "🚀 Join the Waitlist"
              )}
            </button>

            <p className={`text-center text-[11px] ${subColor}`}>
              No spam, ever. We&apos;ll only email you when something big happens.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
