'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Tag, Wallet, X } from 'lucide-react';
import { useState } from 'react';

const actions = [
  { label: 'Add Product', icon: Package, color: 'var(--brand-green)', href: '/shopkeeper/products' },
  { label: 'Create Discount', icon: Tag, color: 'var(--brand-orange)' },
  { label: 'Request Payout', icon: Wallet, color: 'var(--brand-green-light)' },
];

import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <>
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 20 }}
                transition={{ delay: i * 0.08, type: 'spring', bounce: 0.4 }}
                className="flex items-center gap-3 rounded-2xl bg-[var(--dash-card)] border border-[var(--dash-card-border)] px-4 py-3 text-sm font-medium text-[var(--dash-text)] shadow-xl hover:border-[var(--brand-green)] transition-colors"
                onClick={() => {
                  setOpen(false);
                  if (action.href) router.push(action.href);
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${action.color}20` }}>
                  <action.icon className="h-4 w-4" style={{ color: action.color }} />
                </div>
                {action.label}
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: open ? 0 : 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-orange)] text-white shadow-2xl"
      >
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
