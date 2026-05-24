'use client';

import { ProductFilters as FilterType } from '@/lib/api/products';

interface ProductFiltersProps {
  filters: FilterType;
  onFilterChange: (newFilters: FilterType) => void;
}

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Beauty', 'Food'];
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
      {/* Search Bus */}
      <div className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
          search
        </span>
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="relative">
          <select
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium outline-none transition-all hover:bg-slate-50 focus:border-[#FF9933] focus:ring-4 focus:ring-[#FF9933]/10"
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat} Categories</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">
            filter_list
          </span>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium outline-none transition-all hover:bg-slate-50 focus:border-[#FF9933] focus:ring-4 focus:ring-[#FF9933]/10"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
          >
            {STATUSES.map(stat => (
              <option key={stat.value} value={stat.value}>{stat.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">
            filter_list
          </span>
        </div>
      </div>
    </div>
  );
}
