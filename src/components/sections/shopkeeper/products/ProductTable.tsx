'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit,
  Trash2,
  EyeOff,
  Eye,
  Image as ImageIcon,
  Plus,
  Minus,
  AlertTriangle,
  PackageX,
  CheckCircle2,
  BarChart3,
  PackagePlus,
  Loader2,
} from 'lucide-react';
import type { Product } from '@/lib/api/products';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleVisibility: (product: Product) => void;
  onViewAnalytics: (product: Product) => void;
  onUpdateStock: (product: Product, newStock: number) => Promise<void>;
}

export default function ProductTable({
  products,
  isLoading,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  onToggleVisibility,
  onViewAnalytics,
  onUpdateStock,
}: ProductTableProps) {
  // Local state for tracking which product stock is currently being updated
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // Local draft inputs for typing in custom quantities
  const [draftStocks, setDraftStocks] = useState<Record<string, string>>({});

  const handleStockChange = async (product: Product, newQuantity: number) => {
    const safeQuantity = Math.max(0, Math.floor(newQuantity));
    setUpdatingId(product.id);
    try {
      await onUpdateStock(product, safeQuantity);
      setDraftStocks((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleInputBlurOrEnter = async (product: Product) => {
    const rawVal = draftStocks[product.id];
    if (rawVal === undefined) return;
    const parsed = parseInt(rawVal, 10);
    if (isNaN(parsed)) {
      setDraftStocks((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      return;
    }
    await handleStockChange(product, parsed);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-pulse h-18 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-white py-20 px-6 text-center shadow-sm ring-1 ring-slate-900/5">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <ImageIcon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900">No Products Found</h3>
        <p className="mt-1.5 max-w-sm text-xs font-medium text-slate-500">
          No items match your active filters. Try resetting search criteria or add new inventory.
        </p>
      </div>
    );
  }

  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
      {/* ─── DESKTOP DATA TABLE (md and above) ─── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-5 py-4 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-4">Product</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Stock Management</th>
              <th className="px-4 py-4">Stock Status</th>
              <th className="px-4 py-4">Visibility</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {products.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const isUpdating = updatingId === product.id;
                const primaryImage = product.product_media?.find((m) => m.is_primary)?.media_url || product.product_media?.[0]?.media_url;
                const threshold = product.low_stock_threshold || 5;
                const isOutOfStock = (product.stock_quantity || 0) <= 0;
                const isLowStock = !isOutOfStock && product.stock_quantity <= threshold;
                const draftVal = draftStocks[product.id] ?? String(product.stock_quantity);

                return (
                  <motion.tr
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }}
                    whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                    className={`group transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="px-5 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectRow(product.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* Product Media & Info */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-semibold text-slate-500">
                              {product.category}
                            </span>
                            {product.sku && (
                              <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                SKU: {product.sku}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">₹{product.price.toFixed(2)}</div>
                      {product.sale_price && product.sale_price < product.price && (
                        <div className="text-[11px] font-semibold text-emerald-600">
                          Sale: ₹{product.sale_price.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Quick Stock Management Stepper */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          {/* Decrement Button */}
                          <button
                            type="button"
                            disabled={isUpdating || product.stock_quantity <= 0}
                            onClick={() => handleStockChange(product, product.stock_quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                            title="Decrease stock by 1"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          {/* Direct Input */}
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              value={draftVal}
                              onChange={(e) =>
                                setDraftStocks({ ...draftStocks, [product.id]: e.target.value })
                              }
                              onBlur={() => handleInputBlurOrEnter(product)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="h-7 w-16 rounded-lg border border-slate-200 bg-white px-1.5 text-center text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                            {isUpdating && (
                              <Loader2 className="absolute right-1 top-1.5 h-3.5 w-3.5 animate-spin text-emerald-600" />
                            )}
                          </div>

                          {/* Increment Button */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStockChange(product, product.stock_quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 transition-colors"
                            title="Increase stock by 1"
                          >
                            <Plus className="h-3 w-3" />
                          </button>

                          {/* Quick +10 Restock */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStockChange(product, product.stock_quantity + 10)}
                            className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                            title="Restock +10 units"
                          >
                            <PackagePlus className="w-3 h-3" /> +10
                          </button>
                        </div>

                        {/* Stock Unit & Threshold hint */}
                        <div className="text-[11px] text-slate-400">
                          {product.unit_type || 'units'} • Min alert: {threshold}
                        </div>
                      </div>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {isOutOfStock ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                          <PackageX className="h-3.5 w-3.5" />
                          Out of Stock
                        </div>
                      ) : isLowStock ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Low Stock ({product.stock_quantity})
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          In Stock ({product.stock_quantity})
                        </div>
                      )}
                    </td>

                    {/* Published Status Toggle */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleVisibility(product)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                          product.is_published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {product.is_published ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                        {product.is_published ? 'Published' : 'Hidden'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewAnalytics(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          title="View Product Sales Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Edit Product Details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ─── MOBILE CARDS VIEW (Under md: 768px) ─── */}
      <div className="block md:hidden divide-y divide-slate-100">
        {/* Mobile Header Bar with Select All */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700">Select All ({products.length})</span>
          </label>
        </div>

        <div className="space-y-3 p-3">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const isUpdating = updatingId === product.id;
            const primaryImage = product.product_media?.find((m) => m.is_primary)?.media_url || product.product_media?.[0]?.media_url;
            const threshold = product.low_stock_threshold || 5;
            const isOutOfStock = (product.stock_quantity || 0) <= 0;
            const isLowStock = !isOutOfStock && product.stock_quantity <= threshold;
            const draftVal = draftStocks[product.id] ?? String(product.stock_quantity);

            return (
              <div
                key={product.id}
                className={`rounded-2xl border p-4 transition-all shadow-sm ${
                  isSelected
                    ? 'border-emerald-500/50 bg-emerald-50/30'
                    : 'border-slate-200/80 bg-white'
                }`}
              >
                {/* Header Row: Checkbox, Thumbnail, Title & Category */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectRow(product.id, e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{product.name}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {product.category}
                      </span>
                      {product.sku && (
                        <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-600">
                          SKU: {product.sku}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Status Row */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <div>
                    <span className="text-base font-black text-slate-900">
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.sale_price && product.sale_price < product.price && (
                      <span className="ml-2 text-xs font-bold text-emerald-600 line-through">
                        ₹{product.sale_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {isOutOfStock ? (
                    <div className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                      <PackageX className="h-3 w-3" />
                      Out of Stock
                    </div>
                  ) : isLowStock ? (
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                      <AlertTriangle className="h-3 w-3" />
                      Low ({product.stock_quantity})
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      In Stock ({product.stock_quantity})
                    </div>
                  )}
                </div>

                {/* Mobile Stock Management Section */}
                <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Stock Units</span>
                    <span className="text-[11px] text-slate-500">
                      Min Alert: {threshold} {product.unit_type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isUpdating || product.stock_quantity <= 0}
                        onClick={() => handleStockChange(product, product.stock_quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <input
                        type="number"
                        min={0}
                        value={draftVal}
                        onChange={(e) =>
                          setDraftStocks({ ...draftStocks, [product.id]: e.target.value })
                        }
                        onBlur={() => handleInputBlurOrEnter(product)}
                        className="h-8 w-16 rounded-lg border border-slate-200 bg-white text-center text-sm font-bold text-slate-800"
                      />

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleStockChange(product, product.stock_quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStockChange(product, product.stock_quantity + 10)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      +10 Restock
                    </button>
                  </div>
                </div>

                {/* Actions & Visibility Row */}
                <div className="mt-3 flex items-center justify-between pt-1">
                  <button
                    onClick={() => onToggleVisibility(product)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                      product.is_published
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {product.is_published ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                    {product.is_published ? 'Published' : 'Hidden'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewAnalytics(product)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
