"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Banknote,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { updateOrderStatus, Order } from "@/lib/services/orders";
import {
  initAudioUnlock,
  playLoudBellSound,
  startLoudBellNonStop,
  stopLoudBell,
  isBellRinging,
  isAudioEngineUnlocked,
  isAudioBlocked,
} from "@/lib/audio-bell";

interface IncomingOrderData {
  id: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
}

export default function IncomingOrderAlert() {
  const router = useRouter();
  const [shopkeeperId, setShopkeeperId] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<IncomingOrderData | null>(null);
  const activeAlertRef = useRef<IncomingOrderData | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bellTested, setBellTested] = useState(false);
  const [audioNeedsTap, setAudioNeedsTap] = useState(false);

  useEffect(() => {
    activeAlertRef.current = activeAlert;
  }, [activeAlert]);

  // 1. Initial auth check & audio unlock listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setShopkeeperId(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setShopkeeperId(session?.user?.id ?? null);
    });

    // Unlock AudioContext on first touch/click
    initAudioUnlock();

    // Request desktop/mobile push notification permissions
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }

    return () => {
      subscription.unsubscribe();
      stopLoudBell();
    };
  }, []);

  // 2. Trigger native OS push notification
  const triggerPushNotification = useCallback((order: IncomingOrderData) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      try {
        const isPaid = order.payment_status === "paid";
        const paymentLabel = isPaid
          ? "Payment Complete · Paid Online"
          : order.payment_method === "cod"
          ? "Cash on Delivery"
          : "Payment Incomplete";

        const notif = new Notification("🚨 NEW ORDER RECEIVED! 🛒", {
          body: `Order #${order.id.slice(0, 8).toUpperCase()} for ₹${order.total_amount.toFixed(
            2
          )} (${paymentLabel}). Tap to view.`,
          icon: "/favicon.ico",
          tag: `order-${order.id}`,
          requireInteraction: true,
        });

        notif.onclick = () => {
          window.focus();
          router.push("/shopkeeper/dashboard/orders");
          notif.close();
        };
      } catch (e) {
        console.warn("Could not display notification:", e);
      }
    }
  }, [router]);

  // 3. Handle an incoming pending order
  const handleNewOrderArrival = useCallback(
    (orderData: IncomingOrderData) => {
      setActiveAlert(orderData);
      setIsMuted(false);

      // Start loud bell chime loop non-stop until accepted or declined
      startLoudBellNonStop();

      // Check if browser blocked autoplay (requires tap)
      if (isAudioBlocked()) {
        setAudioNeedsTap(true);
      }

      // Trigger native browser notification
      triggerPushNotification(orderData);

      // Notify any currently mounted orders list
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("new-order-received", { detail: orderData })
        );
      }
    },
    [triggerPushNotification]
  );

  // 4. Check for active unaccepted pending orders from Supabase (runs on mount & every 2.5s)
  const checkPendingOrders = useCallback(async () => {
    if (!shopkeeperId) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, total_amount, payment_method, payment_status, delivery_address, notes, created_at, status"
        )
        .eq("shopkeeper_id", shopkeeperId)
        .eq("status", "pending")
        .or("payment_method.eq.cod,payment_status.eq.paid")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("Error polling pending orders:", error);
        return;
      }

      if (data) {
        // Enforce payment completion check: order must be marked "paid" (or "cod")
        if (data.payment_status !== "paid" && data.payment_method !== "cod") {
          return;
        }

        // Only trigger if not already alerting this exact order
        if (!activeAlertRef.current || activeAlertRef.current.id !== data.id) {
          handleNewOrderArrival(data as IncomingOrderData);
        }
      } else {
        // No pending unaccepted orders
        if (activeAlertRef.current) {
          stopLoudBell();
          setActiveAlert(null);
        }
      }
    } catch (e) {
      console.warn("Poll exception:", e);
    }
  }, [shopkeeperId, handleNewOrderArrival]);

  // 5. Continuous 2.5s Background Polling + Focus + Mount Check
  useEffect(() => {
    if (!shopkeeperId) return;

    // Check immediately on mount/auth
    checkPendingOrders();

    const pollInterval = setInterval(() => {
      checkPendingOrders();
    }, 2500);

    const onFocus = () => checkPendingOrders();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [shopkeeperId, checkPendingOrders]);

  // 6. Supabase Realtime subscription across the entire shopkeeper dashboard
  useEffect(() => {
    if (!shopkeeperId) return;

    const channel = supabase
      .channel(`shopkeeper-order-alerts-${shopkeeperId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `shopkeeper_id=eq.${shopkeeperId}`,
        },
        () => {
          checkPendingOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shopkeeperId, checkPendingOrders]);

  // Silence bell
  const handleSilence = () => {
    stopLoudBell();
    setIsMuted(true);
  };

  // Accept order
  const handleAccept = async () => {
    if (!activeAlert) return;
    if (activeAlert.payment_status !== "paid" && activeAlert.payment_method !== "cod") {
      alert("Cannot accept order: Payment is not completed yet.");
      return;
    }
    setIsProcessing(true);
    stopLoudBell();

    const { success, error } = await updateOrderStatus(activeAlert.id, "accepted");
    setIsProcessing(false);

    if (success) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("order-status-updated", {
            detail: { orderId: activeAlert.id, status: "accepted" },
          })
        );
      }
      setActiveAlert(null);
      router.push("/shopkeeper/dashboard/orders");
    } else {
      alert("Failed to accept order: " + (error || "Unknown error"));
    }
  };

  // Reject / Decline order
  const handleReject = async () => {
    if (!activeAlert) return;
    const confirmed = window.confirm("Are you sure you want to decline this order?");
    if (!confirmed) return;

    setIsProcessing(true);
    stopLoudBell();

    const { success, error } = await updateOrderStatus(activeAlert.id, "cancelled");
    setIsProcessing(false);

    if (success) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("order-status-updated", {
            detail: { orderId: activeAlert.id, status: "cancelled" },
          })
        );
      }
      setActiveAlert(null);
    } else {
      alert("Failed to decline order: " + (error || "Unknown error"));
    }
  };

  return (
    <>
      {/* Sound test button for shopkeeper to confirm audio and unlock browser autoplay */}
      {!activeAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-3 right-4 md:right-48 z-40"
        >
          <button
            type="button"
            onClick={() => {
              initAudioUnlock();
              playLoudBellSound();
              setBellTested(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-md active:scale-95 transition-all cursor-pointer border ${
              bellTested
                ? "bg-emerald-600/90 text-white border-emerald-400 shadow-emerald-700/20"
                : "bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-300 shadow-amber-500/20 animate-pulse"
            }`}
            title="Click to test loud order bell sound and ensure browser audio is active"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{bellTested ? "Order Bell Active ✓" : "Test Order Bell 🔊"}</span>
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:w-[460px] z-[9999]"
          >
            <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-500 shadow-2xl shadow-emerald-500/30 text-white p-5 ring-4 ring-emerald-500/20">
              {/* Loud Ringing Header Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shadow-lg">
                    <BellRing className="w-5 h-5 animate-bounce" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
                    </span>
                  </span>
                  <div>
                    <h3 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5 uppercase">
                      New Order Incoming!
                    </h3>
                    <p className="text-[11px] text-emerald-400 font-semibold">
                      Order #{activeAlert.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Silence / Mute Bell Button */}
                <button
                  onClick={handleSilence}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isMuted
                      ? "bg-slate-800 text-slate-400"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 animate-pulse"
                  }`}
                  title={isMuted ? "Sound silenced" : "Silence ringing bell"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>Silenced</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Silence Bell</span>
                    </>
                  )}
                </button>
              </div>

              {/* Autoplay bypass banner if browser silenced audio until interaction */}
              {audioNeedsTap && !isMuted && (
                <button
                  type="button"
                  onClick={() => {
                    initAudioUnlock();
                    startLoudBellNonStop();
                    setAudioNeedsTap(false);
                  }}
                  className="w-full my-2.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 animate-bounce cursor-pointer shadow-lg transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Browser Silenced Audio — Tap Here to Play Loud Bell! 🔊</span>
                </button>
              )}

              {/* Order Info Body */}
              <div className="py-3.5 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Amount to Collect:
                  </span>
                  <span className="text-2xl font-black text-emerald-400 tracking-tight">
                    ₹{activeAlert.total_amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 font-bold flex items-center gap-1.5 text-slate-200">
                    {activeAlert.payment_status === "paid" ? (
                      <>
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Payment Complete · Paid Online</span>
                      </>
                    ) : activeAlert.payment_method === "cod" ? (
                      <>
                        <Banknote className="w-3.5 h-3.5 text-amber-400" />
                        Cash on Delivery
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Payment Incomplete</span>
                      </>
                    )}
                  </span>

                  <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                    Pending Acceptance
                  </span>
                </div>

                {activeAlert.delivery_address && (
                  <div className="flex items-start gap-1.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2 leading-relaxed">
                      {activeAlert.delivery_address}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isProcessing ? "Accepting..." : "Accept Order"}</span>
                </button>

                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/30 text-rose-300 font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Decline</span>
                </button>
              </div>

              {/* Review Details Link */}
              <div className="mt-2.5 text-center">
                <button
                  onClick={() => {
                    handleSilence();
                    router.push("/shopkeeper/dashboard/orders");
                  }}
                  className="text-[11px] text-slate-400 hover:text-emerald-300 underline-offset-4 hover:underline inline-flex items-center gap-1 font-semibold transition-colors"
                >
                  Open Orders Queue to inspect items
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
