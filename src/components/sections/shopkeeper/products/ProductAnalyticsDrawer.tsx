'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, ShoppingCart, Eye, DollarSign } from 'lucide-react';
import type { Product } from '@/lib/api/products';

interface ProductAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductAnalyticsDrawer({ isOpen, onClose, product }: ProductAnalyticsDrawerProps) {
  if (!isOpen || !product) return null;

  // Mock analytics data - in production this would fetch from product_analytics table
  const analytics = {
    views: 1245,
    cartAdds: 312,
    orders: 89,
    revenue: product.price * 89
  };

  const conversionRate = ((analytics.orders / analytics.views) * 100).toFixed(1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="relative flex w-full max-w-md flex-col bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col border-b border-slate-100 px-6 py-6 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Performance Stats</h2>
                <p className="text-sm text-slate-500 mt-1">{product.name}</p>
              </div>
              <button onClick={onClose} className="rounded-full p-2 bg-slate-50 hover:bg-slate-100 transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                  <Eye className="h-4 w-4" />
                </div>
                <div className="text-2xl font-black text-slate-900">{analytics.views}</div>
                <div className="text-xs font-medium text-slate-500">Total Views</div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="text-2xl font-black text-slate-900">{analytics.cartAdds}</div>
                <div className="text-xs font-medium text-slate-500">Added to Cart</div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D9E4B]/10 text-[#2D9E4B] mb-3">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-2xl font-black text-slate-900">{analytics.orders}</div>
                <div className="text-xs font-medium text-slate-500">Total Orders</div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF9933]/10 text-[#FF9933] mb-3">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="text-2xl font-black text-slate-900">₹{analytics.revenue.toLocaleString()}</div>
                <div className="text-xs font-medium text-slate-500">Gross Revenue</div>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg">
              <h3 className="text-sm font-medium text-slate-300">Conversion Rate</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black">{conversionRate}%</span>
                <span className="text-sm text-[#4ade80]">+1.2% this week</span>
              </div>
              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gradient-to-r from-[#2D9E4B] to-[#FF9933]" style={{ width: `${Math.min(parseFloat(conversionRate) * 5, 100)}%` }} />
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
