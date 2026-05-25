'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const mobileNavItems = [
  { label: 'Dash', href: '/shopkeeper/dashboard', icon: 'dashboard' },
  { label: 'Orders', href: '/shopkeeper/dashboard/orders', icon: 'shopping_cart' },
  { label: 'Products', href: '/shopkeeper/products', icon: 'package' },
  { label: 'Contacts', href: '/shopkeeper/dashboard/contacts', icon: 'group' },
  { label: 'Settings', href: '/shopkeeper/dashboard/settings', icon: 'settings' },
];

export default function ShopkeeperBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-50 px-2 pb-safe flex justify-between items-center">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/shopkeeper/dashboard' && pathname.startsWith(item.href));
        
        return (
          <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center h-full relative group">
            {isActive && (
              <motion.div
                layoutId="mobile-nav-active"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-[#13ec5b]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isActive ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-50'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {item.icon}
              </span>
            </div>
            <span className={`text-[10px] mt-0.5 font-bold transition-colors ${
              isActive ? 'text-[#13ec5b]' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
