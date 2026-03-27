'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Edit, Trash2, EyeOff, Eye, Image as ImageIcon } from 'lucide-react';
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
  onViewAnalytics
}: ProductTableProps) {
  
  if (isLoading) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        <div className="space-y-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="skeleton-pulse h-16 w-full rounded-xl" />
           ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-white py-24 shadow-sm ring-1 ring-slate-900/5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <ImageIcon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
        <p className="max-w-sm text-center text-sm text-slate-500 mt-2">
          Try adjusting your filters, or click "Add Product" to create your first listing.
        </p>
      </div>
    );
  }

  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold w-12">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#2D9E4B] focus:ring-[#2D9E4B]"
                />
              </th>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">SKU</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                  whileHover={{ backgroundColor: 'rgba(248, 250, 252, 1)' }}
                  className={`group transition-colors ${selectedIds.includes(product.id) ? 'bg-indigo-50/50' : ''}`}
                >
                  <td className="px-6 py-4 w-12">
                     <input 
                        type="checkbox" 
                        checked={selectedIds.includes(product.id)}
                        onChange={(e) => onSelectRow(product.id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#2D9E4B] focus:ring-[#2D9E4B]"
                      />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                         {/* Placeholder for Media Thumbnail */}
                         <ImageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{product.sku || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">₹{product.price.toFixed(2)}</div>
                    {product.sale_price && (
                      <div className="text-xs text-[#2D9E4B] line-through">₹{product.sale_price.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.stock_quantity <= 0 
                        ? 'bg-red-100 text-red-700'
                        : product.stock_quantity <= product.low_stock_threshold
                          ? 'bg-[#FF9933]/10 text-[#FF9933]'
                          : 'bg-[#2D9E4B]/10 text-[#2D9E4B]'
                    }`}>
                      {product.stock_quantity} {product.unit_type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleVisibility(product)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        product.is_published 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {product.is_published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {product.is_published ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={() => onViewAnalytics(product)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-[#FF9933]/10 hover:text-[#FF9933] transition-colors"
                        title="View Analytics"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                      </button>
                      <button 
                        onClick={() => onEdit(product)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-[#2D9E4B]/10 hover:text-[#2D9E4B] transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(product)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
