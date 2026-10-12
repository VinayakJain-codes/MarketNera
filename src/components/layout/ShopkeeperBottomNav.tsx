'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  Settings,
} from 'lucide-react';

const mobileNavItems = [
  { label: 'Dash', href: '/shopkeeper/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/shopkeeper/dashboard/orders', icon: ShoppingCart },
  { label: 'Products', href: '/shopkeeper/products', icon: Package },
  { label: 'Store', href: '/shopkeeper/dashboard/store', icon: Store },
  { label: 'Settings', href: '/shopkeeper/dashboard/settings', icon: Settings },
];

export default function ShopkeeperBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-50 px-2 pb-safe flex justify-between items-center">
      {mobileNavItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/shopkeeper/dashboard' && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center h-full relative group"
          >
            {isActive && (
              <motion.div
                layoutId="shopkeeper-mobile-nav-active"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-emerald-600"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <div
              className={`mt-1 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] mt-0.5 font-bold transition-colors ${
                isActive ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
