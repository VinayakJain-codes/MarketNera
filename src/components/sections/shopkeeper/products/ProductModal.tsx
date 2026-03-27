'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Product, ProductCreatePayload } from '@/lib/api/products';
import Button from '@/components/ui/Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (payload: any) => Promise<void>;
}

export default function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'media'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Basic Form State
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'Electronics',
    price: product?.price?.toString() || '',
    sale_price: product?.sale_price?.toString() || '',
    stock_quantity: product?.stock_quantity?.toString() || '0',
    unit_type: product?.unit_type || 'piece',
    sku: product?.sku || '',
    is_published: product?.is_published ?? true,
    scheduled_live_at: product?.scheduled_live_at || ''
  });

  // Mock Media State
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSaveError('Product name is required.');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setSaveError('Please enter a valid price.');
      return;
    }

    setSaveError(null);
    setIsSubmitting(true);
    try {
      const payload: ProductCreatePayload = {
        shop_id: '00000000-0000-0000-0000-000000000000', // MOCK ID
        name: formData.name,
        description: formData.description,
        category: formData.category,
        sub_category: null,
        price: parseFloat(formData.price) || 0,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        price_valid_from: null,
        price_valid_to: null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        low_stock_threshold: 5,
        unit_type: formData.unit_type,
        sku: formData.sku,
        tags: [],
        is_published: formData.is_published,
        scheduled_live_at: formData.scheduled_live_at || null,
        is_featured: false,
        hide_from_search: false,
        restock_notification: true
      };
      
      await onSave(payload);
    } catch (err: any) {
      console.error(err);
      setSaveError(err?.message || 'Failed to save product. Please ensure the database tables have been created in Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-100 px-6 pt-2">
             {['basic', 'pricing', 'media'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`relative py-3 text-sm font-medium capitalize transition-colors ${
                   activeTab === tab ? 'text-[#2D9E4B]' : 'text-slate-500 hover:text-slate-800'
                 }`}
               >
                 {tab === 'basic' ? 'Basic Info' : tab === 'pricing' ? 'Pricing & Stock' : 'Images'}
                 {activeTab === tab && (
                   <motion.div 
                     layoutId="modal-tab" 
                     className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#2D9E4B]" 
                   />
                 )}
               </button>
             ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* BASIC TAB */}
            {activeTab === 'basic' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
                    placeholder="e.g. Organic Avocados"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
                    placeholder="Describe your product..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Groceries">Groceries</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">SKU / Code</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
                      placeholder="e.g. AVO-101"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRICING TAB */}
            {activeTab === 'pricing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Regular Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Sale Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.sale_price}
                      onChange={e => setFormData({...formData, sale_price: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#FF9933] focus:ring-4 focus:ring-[#FF9933]/10"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Unit Type</label>
                    <select
                      value={formData.unit_type}
                      onChange={e => setFormData({...formData, unit_type: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#2D9E4B] focus:ring-4 focus:ring-[#2D9E4B]/10"
                    >
                      <option value="piece">Per Piece</option>
                      <option value="kg">Per Kg</option>
                      <option value="dozen">Per Dozen</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={formData.is_published}
                        onChange={e => setFormData({...formData, is_published: e.target.checked})}
                      />
                      <div className={`block h-6 w-10 text-white rounded-full transition-colors ${formData.is_published ? 'bg-[#2D9E4B]' : 'bg-slate-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${formData.is_published ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Publish Immediately</div>
                      <div className="text-xs text-slate-500">Make this product live on your storefront.</div>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 transition-colors hover:border-[#2D9E4B] hover:bg-[#2D9E4B]/5"
                >
                   <UploadCloud className="h-10 w-10 text-[#2D9E4B] mb-2" />
                   <p className="text-sm font-medium text-slate-700">Click to upload images</p>
                   <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                   <input 
                     type="file" 
                     className="hidden" 
                     ref={fileInputRef} 
                     multiple 
                     accept="image/*"
                     onChange={handleFileChange}
                   />
                </div>

                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {mediaFiles.map((file, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl bg-slate-100 overflow-hidden ring-1 ring-slate-900/5">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="preview" 
                          className="h-full w-full object-cover"
                        />
                        <button 
                          onClick={() => setMediaFiles(mediaFiles.filter((_, i) => i !== idx))}
                          className="absolute right-2 top-2 rounded-lg bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            {saveError && (
              <div className="mb-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                ⚠️ {saveError}
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
              <Button
                className="flex items-center gap-2 px-6"
                variant="primary"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
