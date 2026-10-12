'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Download, ChevronDown, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getShopkeeperProfile, ShopkeeperProfile } from '@/lib/services/shopkeeper';

interface TopbarProps {
  title?: string;
  description?: string;
}

export default function ShopkeeperTopbar({ 
  title = "Dashboard Overview", 
  description = "Manage your store operations, orders, and performance." 
}: TopbarProps) {
  const [shop, setShop] = useState<ShopkeeperProfile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getShopkeeperProfile(session.user.id).then(data => {
            if (data) setShop(data);
        }).catch(() => {});
      }
    });
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-between border-b border-[var(--dash-card-border)] bg-[var(--dash-bg)] px-6 py-4"
    >
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-bold text-[var(--dash-text)]">{title}</h1>
        <p className="text-sm text-[var(--dash-text-muted)]">{description}</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] px-3 py-2 text-sm text-[var(--dash-text-muted)]">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-[var(--dash-text)] placeholder:text-[var(--dash-text-muted)] w-40"
          />
        </div>

        {/* Date Range */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] px-3 py-2 text-sm text-[var(--dash-text-muted)]">
          <span>{dateStr}</span>
          <ChevronDown className="h-3 w-3" />
        </div>

        {/* Export */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors"
        >
          <Download className="h-4 w-4" />
          Export
        </motion.button>

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-700 transition-colors shadow-xs"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white" />
        </motion.button>

        {/* Avatar */}
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900">{shop?.shop_name || "Shopkeeper"}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 mt-0.5">{shop?.category || "Verified Merchant"}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-xs"
          >
            {shop?.shop_name ? shop.shop_name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
