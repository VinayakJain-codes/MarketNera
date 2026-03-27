'use client';

import { motion } from 'framer-motion';
import { Package, Star } from 'lucide-react';
import type { RecentOrder, TopProduct } from '@/lib/api/shopkeeper';

interface DashboardDataRowProps {
  orders: RecentOrder[];
  products: TopProduct[];
  satisfactionScore?: number;
}

const statusColors: Record<string, string> = {
  Delivered: 'bg-[var(--brand-green)]/20 text-[var(--brand-green)]',
  Processing: 'bg-[var(--brand-orange)]/20 text-[var(--brand-orange)]',
  Pending: 'bg-yellow-500/20 text-yellow-400',
  Cancelled: 'bg-red-500/20 text-red-400',
};

export default function DashboardDataRow({ orders, products, satisfactionScore = 4.8 }: DashboardDataRowProps) {
  const row = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Recent Orders Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="dash-glass p-5 lg:col-span-2 overflow-hidden"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--dash-text)]">Recent Orders</h3>
          <button className="text-xs text-[var(--brand-green)] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[var(--dash-card-border)] text-[var(--dash-text-muted)]">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium hidden sm:table-cell">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[var(--dash-text-muted)]">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    variants={row}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="border-b border-[var(--dash-card-border)]/50 hover:bg-[var(--dash-card-border)]/40 transition-colors"
                  >
                    <td className="py-3 text-[var(--dash-text)]">{order.customer}</td>
                    <td className="py-3 text-[var(--dash-text-muted)]">{order.product}</td>
                    <td className="py-3 text-[var(--dash-text-muted)] hidden sm:table-cell">{order.date}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[var(--dash-text)] font-medium">₹{order.total}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Right Column: Products + Satisfaction */}
      <div className="flex flex-col gap-4">
        {/* Top Products */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="dash-glass p-5"
        >
          <h3 className="mb-4 text-sm font-semibold text-[var(--dash-text)]">Top Products</h3>
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="py-6 text-center text-sm text-[var(--dash-text-muted)]">
                No products added yet.
              </div>
            ) : (
              products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl p-2 hover:bg-[var(--dash-card-border)]/40 transition-colors cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
                    <Package className="h-5 w-5 text-[var(--brand-green)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--dash-text)] truncate">{product.name}</p>
                    <p className="text-xs text-[var(--dash-text-muted)]">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[var(--dash-text)]">₹{product.price}</p>
                    <p className="text-xs text-[var(--dash-text-muted)]">{product.sold} sold</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Customer Satisfaction */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="dash-glass p-5 flex flex-col items-center justify-center"
        >
          <h3 className="mb-3 text-sm font-semibold text-[var(--dash-text)]">Customer Satisfaction</h3>
          <div className="relative flex items-center justify-center">
            {/* Radial Gauge */}
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2d37" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="50" fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(satisfactionScore / 5) * 314} 314`}
                transform="rotate(-90 60 60)"
                initial={{ strokeDasharray: '0 314' }}
                animate={{ strokeDasharray: `${(satisfactionScore / 5) * 314} 314` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-[var(--dash-text)]">{satisfactionScore}</span>
              <span className="text-xs text-[var(--dash-text-muted)]">/ 5.0</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= Math.floor(satisfactionScore) ? 'text-[var(--brand-orange)] fill-[var(--brand-orange)]' : 'text-[var(--dash-card-border)]'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
