'use client';

import { motion } from 'framer-motion';
import { Package, CheckCircle2, AlertTriangle, PackageX, IndianRupee, ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/api/products';

interface StockMetricsCardsProps {
  products: Product[];
  currentStatusFilter: string;
  onSelectStatusFilter: (status: '' | 'in_stock' | 'low_stock' | 'out_of_stock') => void;
}

export default function StockMetricsCards({
  products,
  currentStatusFilter,
  onSelectStatusFilter,
}: StockMetricsCardsProps) {
  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.stock_quantity > (p.low_stock_threshold || 5)).length;
  const lowStockCount = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= (p.low_stock_threshold || 5)
  ).length;
  const outOfStockCount = products.filter((p) => (p.stock_quantity || 0) <= 0).length;

  const totalStockValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * Math.max(0, p.stock_quantity || 0),
    0
  );
  const totalUnits = products.reduce((sum, p) => sum + Math.max(0, p.stock_quantity || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      id: 'all',
      statusValue: '' as const,
      title: 'Total Catalog',
      value: totalCount,
      subtext: `${totalUnits} total units in inventory`,
      icon: Package,
      gradient: 'from-slate-800 to-slate-900',
      iconBg: 'bg-slate-100 text-slate-800',
      borderColor: 'border-slate-200 hover:border-slate-400',
      activeRing: 'ring-2 ring-slate-900 shadow-md',
      tag: 'Total SKUs',
    },
    {
      id: 'in_stock',
      statusValue: 'in_stock' as const,
      title: 'Healthy Stock',
      value: inStockCount,
      subtext: 'Well-stocked & ready for orders',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      activeRing: 'ring-2 ring-emerald-600 shadow-md',
      tag: 'Optimal',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'low_stock',
      statusValue: 'low_stock' as const,
      title: 'Low Stock Alert',
      value: lowStockCount,
      subtext: 'At or below reorder threshold',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-200 hover:border-amber-400',
      activeRing: 'ring-2 ring-amber-500 shadow-md',
      tag: 'Action Needed',
      badgeColor: 'bg-amber-100 text-amber-800',
      pulse: lowStockCount > 0,
    },
    {
      id: 'out_of_stock',
      statusValue: 'out_of_stock' as const,
      title: 'Out of Stock',
      value: outOfStockCount,
      subtext: '0 available — Customers cannot buy',
      icon: PackageX,
      iconBg: 'bg-rose-50 text-rose-600',
      borderColor: 'border-rose-200 hover:border-rose-400',
      activeRing: 'ring-2 ring-rose-600 shadow-md',
      tag: 'Urgent Restock',
      badgeColor: 'bg-rose-100 text-rose-800',
      pulse: outOfStockCount > 0,
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Top Banner Row: Inventory Valuation Banner + Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1 to 4: Status Quick Filters */}
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive =
            (card.statusValue === '' && (currentStatusFilter === '' || currentStatusFilter === 'published' || currentStatusFilter === 'draft'))
              ? false // don't light up as active filter unless explicitly selected or all
              : currentStatusFilter === card.statusValue;

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectStatusFilter(card.statusValue)}
              className={`relative cursor-pointer overflow-hidden rounded-2xl bg-white p-4.5 border transition-all shadow-sm ${card.borderColor} ${
                isActive ? card.activeRing : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                  {card.tag}
                </span>
                <div className={`p-2 rounded-xl ${card.iconBg} ${card.pulse ? 'animate-pulse' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-2xl font-black tracking-tight text-slate-900">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{card.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{card.subtext}</div>
              </div>

              {isActive && (
                <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  Filter Active <ArrowUpRight className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Card 5: Inventory Valuation Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-4.5 text-white shadow-md border border-slate-700 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Asset Value
            </span>
            <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-2xl font-black tracking-tight text-white">
              {formatCurrency(totalStockValue)}
            </div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">Inventory Valuation</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Based on selling price of {totalUnits} items
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
