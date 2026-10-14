"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share,
  PlusSquare,
  Sparkles,
  Zap,
  Bell,
  HardDrive,
  X,
  CheckCircle,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PWAInstallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);
  const deferredPromptRef = useRef<any>(null);
  const hasPromptedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check if already installed & running as standalone PWA
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");
    setIsStandalone(standaloneMode);
    if (standaloneMode) return;

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice =
      /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isAppleDevice);

    // 3. Capture Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Listen for successful PWA install
    const handleAppInstalled = () => {
      setInstalledSuccessfully(true);
      deferredPromptRef.current = null;
      setTimeout(() => setIsOpen(false), 2500);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Trigger prompt as soon as user logs in or is already authenticated
    const promptUserToInstall = () => {
      if (hasPromptedRef.current) return;

      // Check if dismissed recently (within 12 hours)
      const dismissedUntil = localStorage.getItem("marketnera_pwa_dismissed_until");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }

      hasPromptedRef.current = true;
      // Slight delay so the page loads smoothly before showing dialog
      setTimeout(() => {
        setIsOpen(true);
      }, 700);
    };

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !standaloneMode) {
        promptUserToInstall();
      }
    });

    // Listen for login events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        promptUserToInstall();
      }
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      subscription.unsubscribe();
    };
  }, []);

  const handleInstallClick = async () => {
    // If iOS Safari, show the visual step-by-step installation instructions
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    // If native Chromium beforeinstallprompt is ready
    if (deferredPromptRef.current) {
      try {
        deferredPromptRef.current.prompt();
        const { outcome } = await deferredPromptRef.current.userChoice;
        if (outcome === "accepted") {
          setInstalledSuccessfully(true);
          setTimeout(() => setIsOpen(false), 2000);
        }
        deferredPromptRef.current = null;
      } catch (err) {
        console.warn("PWA install error:", err);
      }
    } else {
      // Fallback instructions for desktop or browsers without beforeinstallprompt
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    // Don't re-prompt for the next 12 hours
    try {
      localStorage.setItem(
        "marketnera_pwa_dismissed_until",
        (Date.now() + 12 * 60 * 60 * 1000).toString()
      );
    } catch {
      // ignore
    }
  };

  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
          >
            {/* Top Banner Accent */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-white/20">
                  <Smartphone className="w-4 h-4 text-emerald-100" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-100">
                  MarketNera Web App
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {installedSuccessfully ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Web App Installed!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    MarketNera is now available right on your home screen for instant 1-tap access.
                  </p>
                </div>
              ) : showIOSGuide ? (
                /* iOS or Manual Add to Home Screen Instructions */
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-black text-slate-900">
                      How to Install on Your Device
                    </h3>
                    <p className="text-xs text-slate-500">
                      Follow these 2 quick steps to add MarketNera to your home screen:
                    </p>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                        1
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        Tap the <strong>Share button</strong>{" "}
                        <Share className="w-3.5 h-3.5 inline mx-1 text-emerald-600" />{" "}
                        at the bottom (or top) of your browser.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                        2
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        Scroll down and tap{" "}
                        <strong>&quot;Add to Home Screen&quot;</strong>{" "}
                        <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-600" />.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                        3
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        Tap <strong>&quot;Add&quot;</strong> at the top right. You&apos;re done!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDismiss}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Got it, thanks!
                  </button>
                </div>
              ) : (
                /* Main App Download Callout */
                <>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-slate-100 shrink-0 bg-emerald-50">
                      <Image
                        src="/icon-192x192.png"
                        alt="MarketNera App"
                        width={64}
                        height={64}
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to favicon or logo
                          (e.target as any).src = "/logo.png";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">
                        Download MarketNera
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Install the official web app for the fastest ordering experience.
                      </p>
                    </div>
                  </div>

                  {/* Feature bullet list */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-2.5 text-xs text-slate-700">
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </span>
                      <span>
                        <strong>Instant 1-Tap Access</strong> &amp; 3x faster loading
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-700">
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                        <Bell className="w-3.5 h-3.5" />
                      </span>
                      <span>
                        <strong>Live Order Tracking</strong> &amp; audio alerts
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-700">
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                        <HardDrive className="w-3.5 h-3.5" />
                      </span>
                      <span>
                        <strong>Ultra Lightweight:</strong> Takes less than 2 MB space
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Download / Install Web App</span>
                    </button>

                    <button
                      onClick={handleDismiss}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Continue in Browser
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
