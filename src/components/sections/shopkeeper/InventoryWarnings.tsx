'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WarningItem {
  id: string;
  name: string;
  type: 'low_stock' | 'overbooked';
  detail: string;
}

const defaultWarnings: WarningItem[] = [
  { id: '1', name: 'Organic Veggie Box', type: 'low_stock', detail: '3 units left' },
  { id: '2', name: 'Weekend Delivery Slot', type: 'overbooked', detail: '2 over capacity' },
];

export default function InventoryWarnings({ warnings }: { warnings?: WarningItem[] }) {
  const items = warnings && warnings.length > 0 ? warnings : defaultWarnings;

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.75 }}
      className="dash-glass p-5 border-[var(--brand-orange)]/30"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AlertTriangle className="h-5 w-5 text-[var(--brand-orange)]" />
        </motion.div>
        <h3 className="text-sm font-semibold text-[var(--brand-orange)]">Attention Required</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
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
    </motion.div>
  );
}
