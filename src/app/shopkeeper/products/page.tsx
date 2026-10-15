'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ShopkeeperTopbar from '@/components/layout/ShopkeeperTopbar';
import StockMetricsCards from '@/components/sections/shopkeeper/products/StockMetricsCards';
import ProductFilters from '@/components/sections/shopkeeper/products/ProductFilters';
import ProductTable from '@/components/sections/shopkeeper/products/ProductTable';
import ProductModal from '@/components/sections/shopkeeper/products/ProductModal';
import BulkActionBar from '@/components/sections/shopkeeper/products/BulkActionBar';
import ProductAnalyticsDrawer from '@/components/sections/shopkeeper/products/ProductAnalyticsDrawer';
import {
  getProducts,
  updateProduct,
  bulkDeleteProducts,
  bulkUpdateVisibility,
  quickUpdateStock,
  bulkSetStock,
  bulkAdjustStock,
  ProductFilters as FilterType,
  Product,
} from '@/lib/api/products';
import Button from '@/components/ui/Button';
import { Plus, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ShopkeeperProductsPage() {
  const [shopId, setShopId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({ 
    search: '', 
    category: 'All', 
    status: '' as any
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Analytics Drawer State
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsProduct, setAnalyticsProduct] = useState<Product | null>(null);

  // Bulk State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch auth user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setShopId(user.id);
      }
    };
    fetchUser();
  }, []);

  // Fetch full inventory for metric cards calculation
  const loadFullInventory = async (currentShopId: string) => {
    try {
      const fullList = await getProducts(currentShopId);
      setAllProducts(fullList);
    } catch (err) {
      console.error('Failed to load total inventory for metrics:', err);
    }
  };

  useEffect(() => {
    if (shopId) {
      loadFullInventory(shopId);
    }
  }, [shopId]);

  // Debounced fetch logic for filtered view
  useEffect(() => {
    let isMounted = true;
    
    const fetchFiltered = async () => {
      if (!shopId) return;
      setIsLoading(true);
      try {
        const data = await getProducts(shopId, filters);
        if (isMounted) setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFiltered, 300);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [filters, shopId]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleViewAnalytics = (product: Product) => {
    setAnalyticsProduct(product);
    setIsAnalyticsOpen(true);
  };

  const handleDelete = async (product: Product) => {
    try {
      await bulkDeleteProducts([product.id]);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      setAllProducts(prev => prev.filter(p => p.id !== product.id));
      setSelectedIds(prev => prev.filter(id => id !== product.id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    const updatedStatus = !product.is_published;
    // Optimistic toggle
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: updatedStatus } : p));
    setAllProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: updatedStatus } : p));
    try {
      await updateProduct(product.id, { is_published: updatedStatus });
    } catch (err) {
      console.error(err);
      // Revert on failure
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: product.is_published } : p));
      setAllProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: product.is_published } : p));
    }
  };

  // Inline fast stock update handler
  const handleUpdateStock = async (product: Product, newStock: number) => {
    const safeStock = Math.max(0, Math.floor(newStock));
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_quantity: safeStock } : p));
    setAllProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_quantity: safeStock } : p));
    try {
      await quickUpdateStock(product.id, safeStock);
    } catch (err) {
      console.error('Failed to update stock:', err);
      // Revert on failure
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_quantity: product.stock_quantity } : p));
      setAllProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_quantity: product.stock_quantity } : p));
    }
  };

  const handleSaveProduct = async (savedProduct: Product) => {
    try {
      if (shopId) {
        const [filteredData, fullData] = await Promise.all([
          getProducts(shopId, filters),
          getProducts(shopId),
        ]);
        setProducts(filteredData);
        setAllProducts(fullData);
      }
    } catch (error) {
      console.error('Failed to reload products:', error);
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
        setAllProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      } else {
        setProducts(prev => [savedProduct, ...prev]);
        setAllProducts(prev => [savedProduct, ...prev]);
      }
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Bulk Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteProducts(selectedIds);
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setAllProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error('Bulk delete error:', err);
    }
  };

  const handleBulkPublish = async (isPublished: boolean) => {
    try {
      await bulkUpdateVisibility(selectedIds, isPublished);
      setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, is_published: isPublished } : p));
      setAllProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, is_published: isPublished } : p));
      setSelectedIds([]);
    } catch (err) {
      console.error('Bulk publish error:', err);
    }
  };

  const handleBulkRestock = async (delta: number) => {
    const targets = products
      .filter(p => selectedIds.includes(p.id))
      .map(p => ({ id: p.id, stock_quantity: p.stock_quantity }));

    // Optimistic update
    setProducts(prev => prev.map(p => {
      if (selectedIds.includes(p.id)) {
        return { ...p, stock_quantity: Math.max(0, (p.stock_quantity || 0) + delta) };
      }
      return p;
    }));
    setAllProducts(prev => prev.map(p => {
      if (selectedIds.includes(p.id)) {
        return { ...p, stock_quantity: Math.max(0, (p.stock_quantity || 0) + delta) };
      }
      return p;
    }));

    try {
      await bulkAdjustStock(targets, delta);
    } catch (err) {
      console.error('Bulk restock error:', err);
    }
  };

  const handleBulkMarkOutOfStock = async () => {
    // Optimistic update
    setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, stock_quantity: 0 } : p));
    setAllProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, stock_quantity: 0 } : p));
    try {
      await bulkSetStock(selectedIds, 0);
    } catch (err) {
      console.error('Bulk mark out of stock error:', err);
    }
  };

  const handleSelectStatusFilter = (status: '' | 'in_stock' | 'low_stock' | 'out_of_stock') => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? ('' as any) : status,
    }));
  };

  return (
    <>
      <ShopkeeperTopbar title="Product & Stock Management" />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4 sm:p-6 lg:p-10 relative"
      >
        {/* Header Title & Actions */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Inventory & Stock Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live stock levels, fast batch restocking, low-inventory alerts, and catalog controls.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {shopId && (
              <button
                onClick={() => {
                  if (shopId) {
                    loadFullInventory(shopId);
                    getProducts(shopId, filters).then(setProducts);
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                title="Refresh Inventory"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            )}

            <Button 
              variant="primary" 
              className="flex items-center gap-2 text-xs font-bold"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Live Stock Metrics KPI Cards */}
        <StockMetricsCards 
          products={allProducts.length > 0 ? allProducts : products}
          currentStatusFilter={filters.status || ''}
          onSelectStatusFilter={handleSelectStatusFilter}
        />

        {/* Filters Row */}
        <ProductFilters 
          filters={filters} 
          onFilterChange={setFilters} 
        />

        {/* Upgraded Product & Stock Table */}
        <ProductTable 
          products={products} 
          isLoading={isLoading}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
          onViewAnalytics={handleViewAnalytics}
          onUpdateStock={handleUpdateStock}
        />
        
        {/* Product Edit / Add Modal */}
        <ProductModal 
          isOpen={isModalOpen}
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct as any}
          shopId={shopId}
        />

        {/* Analytics Drawer */}
        <ProductAnalyticsDrawer
          isOpen={isAnalyticsOpen}
          product={analyticsProduct}
          onClose={() => setIsAnalyticsOpen(false)}
        />

        {/* Floating Bulk Action Bar */}
        <BulkActionBar 
          selectedIds={selectedIds}
          onClearSelection={() => setSelectedIds([])}
          onBulkDelete={handleBulkDelete}
          onBulkPublish={handleBulkPublish}
          onBulkRestock={handleBulkRestock}
          onBulkMarkOutOfStock={handleBulkMarkOutOfStock}
        />
      </motion.div>
    </>
  );
}
