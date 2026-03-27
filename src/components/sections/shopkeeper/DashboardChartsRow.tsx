'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { RevenueTrend, CategorySale } from '@/lib/api/shopkeeper';

interface DashboardChartsRowProps {
  revenueData: RevenueTrend[];
  categoryData: CategorySale[];
}

const COLORS = ['#22c55e', '#f97316', '#4ade80', '#94a3b8'];

export default function DashboardChartsRow({ revenueData, categoryData }: DashboardChartsRowProps) {

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Revenue Area Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="dash-glass p-5 lg:col-span-2"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--dash-text)]">Revenue Overview</h3>
          <span className="text-xs text-[var(--dash-text-muted)]">Last 6 months</span>
        </div>
        <div className="h-64">
          {revenueData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--dash-text-muted)]">
              No revenue data recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#0f1117',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#greenGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Sales by Category Pie Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="dash-glass p-5"
      >
        <h3 className="mb-4 text-sm font-semibold text-[var(--dash-text)]">Sales by Category</h3>
        <div className="h-48">
          {categoryData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--dash-text-muted)]">
              No categories data.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#0f1117',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Legend */}
        {categoryData.length > 0 && (
          <div className="mt-3 space-y-2">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[var(--dash-text-muted)]">{cat.name}</span>
                </div>
                <span className="text-[var(--dash-text)] font-medium">{cat.value}%</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
