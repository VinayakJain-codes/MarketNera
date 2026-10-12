'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Users,
  Package,
  Store,
  ShoppingCart,
  BarChart3,
  Wallet,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/shopkeeper/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/shopkeeper/dashboard/orders', icon: ShoppingCart },
  { label: 'Products', href: '/shopkeeper/products', icon: Package },
  { label: 'Storefront', href: '/shopkeeper/dashboard/store', icon: Store },
  { label: 'Customers', href: '/shopkeeper/dashboard/contacts', icon: Users },
];

const bottomItems = [
  { label: 'Analytics', href: '/shopkeeper/dashboard/analytics', icon: BarChart3 },
  { label: 'Payouts', href: '/shopkeeper/dashboard/payouts', icon: Wallet },
  { label: 'Payments', href: '/shopkeeper/dashboard/payments', icon: CreditCard },
  { label: 'Settings', href: '/shopkeeper/dashboard/settings', icon: Settings },
];

export default function ShopkeeperSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login/shopkeeper');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`hidden md:flex sticky top-0 h-screen flex-col justify-between border-r border-slate-200/90 bg-white transition-all duration-300 z-30 shadow-xs ${
        collapsed ? 'w-[76px]' : 'w-[250px]'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4.5 border-b border-slate-100">
        {!collapsed ? (
          <Link href="/shopkeeper/dashboard" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-xs">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                Market<span className="text-emerald-700">nera</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Merchant Portal
              </span>
            </div>
          </Link>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Store className="w-4 h-4 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors ${
            collapsed ? 'mx-auto mt-2' : ''
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {!collapsed && 'Store Operations'}
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/shopkeeper/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="shopkeeper-sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-emerald-600"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav / Settings */}
      <div className="border-t border-slate-100 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {!collapsed && 'Management'}
        </div>
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}

        {/* View Customer Website Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
          {!collapsed && <span>View Marketplace</span>}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-1"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
