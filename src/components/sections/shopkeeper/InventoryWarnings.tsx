'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WarningItem {
  id: string;
  name: string;
  type: 'low_stock' | 'overbooked';
  detail: string;
}

export default function InventoryWarnings({ warnings = [] }: { warnings?: WarningItem[] }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.75 }}
      className="dash-glass p-5 border-[var(--brand-orange)]/30"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={warnings.length > 0 ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AlertTriangle className="h-5 w-5 text-[var(--brand-orange)]" />
        </motion.div>
        <h3 className="text-sm font-semibold text-[var(--dash-text)]">Attention Required</h3>
      </div>
      
      {warnings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-1.5 text-emerald-500">check_circle</span>
          <p className="text-sm font-black text-slate-800 uppercase tracking-wide">All Caught Up!</p>
          <p className="text-xs text-slate-400 mt-0.5">All products are fully stocked and available.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {warnings.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-[var(--brand-orange)]/5 px-3 py-2">
              <div>
                <p className="text-sm text-[var(--dash-text)]">{item.name}</p>
                <p className="text-xs text-[var(--dash-text-muted)]">
                  {item.type === 'low_stock' ? 'Low Stock' : 'Overbooked'}
                </p>
              </div>
              <span className="text-xs font-medium text-[var(--brand-orange)]">{item.detail}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
