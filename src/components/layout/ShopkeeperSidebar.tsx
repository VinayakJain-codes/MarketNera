'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const navItems = [
  { label: 'Dashboard', href: '/shopkeeper/dashboard', icon: 'dashboard' },
  { label: 'Contacts', href: '/shopkeeper/dashboard/contacts', icon: 'group' },
  { label: 'Products', href: '/shopkeeper/products', icon: 'package' },
  { label: 'Front Store', href: '/shopkeeper/dashboard/store', icon: 'storefront' },
  { label: 'Orders', href: '/shopkeeper/dashboard/orders', icon: 'shopping_cart' },
];

const bottomItems = [
  { label: 'Analytics', href: '/shopkeeper/dashboard/analytics', icon: 'bar_chart' },
  { label: 'Payouts', href: '/shopkeeper/dashboard/payouts', icon: 'account_balance_wallet' },
  { label: 'Settings', href: '/shopkeeper/dashboard/settings', icon: 'settings' },
  { label: 'Payments', href: '/shopkeeper/dashboard/payments', icon: 'credit_card' },
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
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`hidden md:flex sticky top-0 h-screen flex-col justify-between border-r border-[var(--dash-card-border)] bg-[var(--dash-card)] transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[var(--dash-card-border)]">
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold text-[var(--brand-orange)]">
            MarketNera
          </motion.span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--dash-text-muted)] hover:bg-[var(--dash-card-border)] hover:text-[var(--brand-orange)] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--brand-green)]/10 text-[var(--brand-green)]'
                    : 'text-[var(--dash-text-muted)] hover:bg-[var(--dash-card-border)] hover:text-[var(--dash-text)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[var(--brand-green)]"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--dash-card-border)] px-3 py-4 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--brand-orange)]'
                    : 'text-[var(--dash-text-muted)] hover:bg-[var(--dash-card-border)] hover:text-[var(--dash-text)]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
          {!collapsed && <span>Log out</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}
