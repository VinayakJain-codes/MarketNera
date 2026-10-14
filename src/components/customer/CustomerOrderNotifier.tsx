"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellRing,
  ExternalLink,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  X,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { playCustomerOrderChime, initAudioUnlock } from "@/lib/audio-bell";
import { ROUTES } from "@/constants/routes";

const WHATSAPP_NUMBER = "8923678493";

interface ActiveOrder {
  id: string;
  status: string;
  total_amount: number;
  delivery_address: string | null;
  shopkeeper_id?: string;
  created_at: string;
}

const STATUS_DETAILS: Record<
  string,
  { label: string; bg: string; text: string; icon: any; message: string }
> = {
  pending: {
    label: "Waiting for Store Acceptance",
    bg: "bg-amber-500",
    text: "text-amber-700",
    icon: Clock,
    message: "Your order is placed! Waiting for the store to accept it.",
  },
  accepted: {
    label: "Order Accepted by Store",
    bg: "bg-blue-500",
    text: "text-blue-700",
    icon: CheckCircle2,
    message: "The store has accepted your order and will start preparation soon!",
  },
  preparing: {
    label: "Store is Preparing Your Order",
    bg: "bg-orange-500",
    text: "text-orange-700",
    icon: ChefHat,
    message: "Your items are being freshly packed and prepared.",
  },
  ready: {
    label: "Ready / Out for Delivery",
    bg: "bg-emerald-500",
    text: "text-emerald-700",
    icon: Bike,
    message: "Your order is ready and heading to your delivery address!",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-slate-500",
    text: "text-slate-700",
    icon: CheckCircle2,
    message: "Your order has been delivered! Enjoy your items.",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-500",
    text: "text-rose-700",
    icon: AlertCircle,
    message: "This order was cancelled by the store.",
  },
};

export default function CustomerOrderNotifier() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide on admin and shopkeeper dashboard routes
  const isShopkeeperOrAdmin =
    pathname.startsWith("/shopkeeper") || pathname.startsWith("/admin");

  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [inAppToast, setInAppToast] = useState<{
    title: string;
    body: string;
    status: string;
  } | null>(null);

  // Notification permission states
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [showPermissionBanner, setShowPermissionBanner] = useState<boolean>(true);
  const [promptCount, setPromptCount] = useState<number>(0);
  const repromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Check Notification permission & setup reprompt loop
  const checkPermission = useCallback(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === "granted") {
        setShowPermissionBanner(false);
      }
    } else {
      setNotificationPermission("unsupported");
    }
  }, []);

  useEffect(() => {
    checkPermission();
    initAudioUnlock();
  }, [checkPermission]);

  // Persistent / "again and again" permission reminder loop
  useEffect(() => {
    if (isShopkeeperOrAdmin) return;
    if (notificationPermission === "granted" || notificationPermission === "unsupported") {
      return;
    }

    // If permission banner was closed or dismissed, re-surface it periodically
    if (!showPermissionBanner) {
      if (repromptTimerRef.current) clearTimeout(repromptTimerRef.current);
      repromptTimerRef.current = setTimeout(() => {
        setShowPermissionBanner(true);
        setPromptCount((c) => c + 1);
      }, 25000); // Re-ask after 25 seconds
    }

    return () => {
      if (repromptTimerRef.current) clearTimeout(repromptTimerRef.current);
    };
  }, [showPermissionBanner, notificationPermission, isShopkeeperOrAdmin]);

  // Request browser push notification permission
  const handleRequestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === "granted") {
        setShowPermissionBanner(false);
        try {
          new Notification("🔔 Notifications Enabled!", {
            body: "You will now get live updates whenever your order status changes.",
            icon: "/favicon.ico",
          });
        } catch {
          // ignore
        }
      } else if (res === "denied") {
        alert(
          "Notifications were blocked in your browser. Please click the padlock or settings icon in your URL address bar to allow notifications for MarketNera."
        );
      }
    } catch (e) {
      console.warn("Error requesting notification permission:", e);
    }
  };

  // 2. Fetch or restore active order
  const refreshActiveOrder = useCallback(async () => {
    if (isShopkeeperOrAdmin) return;

    // Check localStorage first
    let storedOrderId: string | null = null;
    try {
      storedOrderId = localStorage.getItem("marketnera_active_order_id");
    } catch {
      // ignore
    }

    // If user is authenticated, check their latest active order
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const { data } = await supabase
        .from("orders")
        .select("id, status, total_amount, delivery_address, shopkeeper_id, created_at")
        .eq("customer_id", session.user.id)
        .in("status", ["pending", "accepted", "preparing", "ready"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setActiveOrder(data as ActiveOrder);
        try {
          localStorage.setItem("marketnera_active_order_id", data.id);
        } catch {
          // ignore
        }
        return;
      }
    }

    // If guest or no user active order, check stored ID
    if (storedOrderId) {
      const { data } = await supabase
        .from("orders")
        .select("id, status, total_amount, delivery_address, shopkeeper_id, created_at")
        .eq("id", storedOrderId)
        .maybeSingle();

      if (data) {
        if (["pending", "accepted", "preparing", "ready"].includes(data.status)) {
          setActiveOrder(data as ActiveOrder);
        } else if (data.status === "delivered" || data.status === "cancelled") {
          // Keep showing for a short while, then remove
          setActiveOrder(data as ActiveOrder);
        }
      }
    }
  }, [isShopkeeperOrAdmin]);

  // Listen for order placed event
  useEffect(() => {
    refreshActiveOrder();

    const handleOrderPlaced = (e: any) => {
      const order = e.detail;
      if (order && order.id) {
        setActiveOrder(order);
        try {
          localStorage.setItem("marketnera_active_order_id", order.id);
        } catch {
          // ignore
        }
      }
      refreshActiveOrder();
    };

    window.addEventListener("customer_order_placed", handleOrderPlaced);
    return () => {
      window.removeEventListener("customer_order_placed", handleOrderPlaced);
    };
  }, [refreshActiveOrder]);

  // 3. Supabase Realtime subscription for customer's active order
  useEffect(() => {
    if (!activeOrder?.id || isShopkeeperOrAdmin) return;

    const channel = supabase
      .channel(`customer-order-updates-${activeOrder.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${activeOrder.id}`,
        },
        (payload) => {
          const updated = payload.new as ActiveOrder;
          if (!updated) return;

          const oldStatus = activeOrder.status;
          const newStatus = updated.status;

          setActiveOrder(updated);

          // If status advanced, notify customer!
          if (newStatus !== oldStatus) {
            const statusInfo = STATUS_DETAILS[newStatus] || {
              label: newStatus,
              message: `Your order status changed to ${newStatus}.`,
            };

            // Play pleasant customer audio chime
            playCustomerOrderChime();

            // Set in-app toast
            setInAppToast({
              title: statusInfo.label,
              body: statusInfo.message,
              status: newStatus,
            });

            // Native push notification
            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              try {
                const notif = new Notification(
                  `Order #${updated.id.slice(0, 8).toUpperCase()}: ${statusInfo.label}`,
                  {
                    body: statusInfo.message,
                    icon: "/favicon.ico",
                    tag: `cust-order-${updated.id}`,
                  }
                );
                notif.onclick = () => {
                  window.focus();
                  router.push(ROUTES.CUSTOMER_ORDERS);
                };
              } catch {
                // ignore
              }
            }

            // Auto-dismiss in-app toast after 8 seconds
            setTimeout(() => {
              setInAppToast(null);
            }, 8000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOrder?.id, activeOrder?.status, isShopkeeperOrAdmin, router]);

  if (isShopkeeperOrAdmin) return null;

  const currentStatusInfo = activeOrder
    ? STATUS_DETAILS[activeOrder.status] || STATUS_DETAILS.pending
    : null;

  const whatsappUrl = activeOrder
    ? `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hi MarketNera Support, I have a query regarding my order #${activeOrder.id.slice(
          0,
          8
        ).toUpperCase()} (₹${Number(activeOrder.total_amount).toFixed(2)}).`
      )}`
    : `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hi MarketNera Support, I have an order related query.`
      )}`;

  return (
    <>
      {/* ── 1. PERSISTENT NOTIFICATION PERMISSION BAR ("AGAIN & AGAIN") ── */}
      <AnimatePresence>
        {notificationPermission !== "granted" &&
          notificationPermission !== "unsupported" &&
          showPermissionBanner && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white px-4 py-2.5 shadow-lg border-b border-emerald-500/30 backdrop-blur-md"
            >
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-medium">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-emerald-200">
                    <BellRing className="w-3.5 h-3.5 animate-bounce" />
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  </span>
                  <span>
                    <strong className="font-bold text-white">Enable Notifications:</strong> Get
                    instant live alerts when your order is accepted, preparing &amp; out for delivery!
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRequestPermission}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 text-xs font-black shadow-xs transition-all cursor-pointer"
                  >
                    Allow Notifications
                  </button>
                  <button
                    onClick={() => setShowPermissionBanner(false)}
                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="Remind me later"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Persistent floating notification reminder pill if dismissed */}
      {notificationPermission !== "granted" &&
        notificationPermission !== "unsupported" &&
        !showPermissionBanner && (
          <button
            onClick={() => setShowPermissionBanner(true)}
            className="fixed top-3 right-3 z-[90] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700/90 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-md shadow-emerald-900/20 backdrop-blur-sm border border-emerald-500/40 transition-all active:scale-95 cursor-pointer animate-pulse"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Enable Alerts</span>
          </button>
        )}

      {/* ── 2. REALTIME IN-APP ORDER STATUS TOAST ── */}
      <AnimatePresence>
        {inAppToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-14 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[95]"
          >
            <div className="rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border-2 border-emerald-500/80 ring-4 ring-emerald-500/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
                    <BellRing className="w-4 h-4 animate-bounce" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Order Update
                    </h4>
                    <p className="text-sm font-bold text-white mt-0.5">{inAppToast.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInAppToast(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                {inAppToast.body}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href={ROUTES.CUSTOMER_ORDERS}
                  onClick={() => setInAppToast(null)}
                  className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  See Order Status
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-300 hover:text-[#25D366] font-semibold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  Order Query
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. AUTOMATIC ACTIVE ORDER BOTTOM BAR ── */}
      {/* "when coustomer places order automatically a bar should come to see order and a bar order related query redirecting to a whatsapp number 8923678493" */}
      <AnimatePresence>
        {activeOrder && activeOrder.status !== "delivered" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-16 sm:bottom-5 left-3 right-3 sm:left-auto sm:right-6 sm:w-[440px] z-40"
          >
            <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 p-3.5 sm:p-4 text-white shadow-2xl shadow-slate-950/40 ring-1 ring-white/10">
              {/* Header: Order ID & Live Pulse Status */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-300">
                    #{activeOrder.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    ₹{Number(activeOrder.total_amount).toFixed(2)}
                  </span>
                </div>

                {/* Status Badge */}
                {currentStatusInfo && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-200 border border-slate-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatusInfo.bg}`} />
                    <span>{currentStatusInfo.label}</span>
                  </span>
                )}
              </div>

              {/* Action Bars: Two Prominent Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                {/* Bar 1: See Order */}
                <Link
                  href={ROUTES.CUSTOMER_ORDERS}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-bold border border-slate-700/80 flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer group"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>See Order</span>
                </Link>

                {/* Bar 2: Order Related Query -> WhatsApp 8923678493 */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20 transition-all cursor-pointer group"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>Order Query (WA)</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
