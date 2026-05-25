'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';

interface GamificationWidgetProps {
  currentRevenue?: number;
  tierTarget?: number;
  tierName?: string;
  nextTierName?: string;
}

export default function GamificationWidget({
  currentRevenue = 0,
}: { currentRevenue?: number }) {
  let tierName = 'Bronze Seller';
  let nextTierName = 'Silver Seller';
  let tierTarget = 1000;

  if (currentRevenue >= 20000) {
    tierName = 'Platinum Seller';
    nextTierName = '';
    tierTarget = 20000;
  } else if (currentRevenue >= 5000) {
    tierName = 'Gold Seller';
    nextTierName = 'Platinum Seller';
    tierTarget = 20000;
  } else if (currentRevenue >= 1000) {
    tierName = 'Silver Seller';
    nextTierName = 'Gold Seller';
    tierTarget = 5000;
  }

  const progress = Math.min((currentRevenue / tierTarget) * 100, 100);
  const remaining = Math.max(tierTarget - currentRevenue, 0);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="dash-glass p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-orange)]/10">
          <Trophy className="h-5 w-5 text-[var(--brand-orange)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--dash-text)]">Seller Tier Progress</h3>
          <p className="text-xs text-[var(--dash-text-muted)]">Current: {tierName}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 rounded-full bg-[var(--dash-card-border)] overflow-hidden mb-3">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--brand-green), var(--brand-orange))' }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>


      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--dash-text-muted)]">₹{currentRevenue.toLocaleString()} / ₹{tierTarget.toLocaleString()}</span>
        <span className="text-[var(--brand-green)] font-medium">{Math.round(progress)}%</span>
      </div>

      {remaining > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--brand-green)]/10 px-3 py-2">
          <Zap className="h-4 w-4 text-[var(--brand-green)]" />
          <span className="text-xs text-[var(--brand-green)]">
            ₹{remaining.toLocaleString()} more to unlock <strong>{nextTierName}</strong> (Lower Platform Fees!)
          </span>
        </div>
      )}
    </motion.div>
  );
}
