'use client';

import { ProductFilters as FilterType } from '@/lib/api/products';
import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterType;
  onFilterChange: (newFilters: FilterType) => void;
}

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Beauty', 'Food', 'Grocery'];
const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft / Hidden' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

export default function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="relative">
          <select
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs font-semibold outline-none transition-all hover:bg-slate-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat} Categories
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs font-semibold outline-none transition-all hover:bg-slate-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
          >
            {STATUSES.map((stat) => (
              <option key={stat.value} value={stat.value}>
                {stat.label}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
