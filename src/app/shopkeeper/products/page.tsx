'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ShopkeeperTopbar from '@/components/layout/ShopkeeperTopbar';
import ProductFilters from '@/components/sections/shopkeeper/products/ProductFilters';
import ProductTable from '@/components/sections/shopkeeper/products/ProductTable';
import ProductModal from '@/components/sections/shopkeeper/products/ProductModal';
import BulkActionBar from '@/components/sections/shopkeeper/products/BulkActionBar';
import ProductAnalyticsDrawer from '@/components/sections/shopkeeper/products/ProductAnalyticsDrawer';
import { getProducts, createProduct, updateProduct, bulkDeleteProducts, bulkUpdateVisibility, ProductFilters as FilterType, Product, ProductCreatePayload } from '@/lib/api/products';
import Button from '@/components/ui/Button';

// Mock active shop ID for now until Auth is hooked via Context
const MOCK_SHOP_ID = '00000000-0000-0000-0000-000000000000';

export default function ShopkeeperProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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

  // Debounced fetch logic
  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts(MOCK_SHOP_ID, filters);
        if (isMounted) setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [filters]);

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    // Optimistic toggle
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: !p.is_published } : p));
    try {
      await updateProduct(product.id, { is_published: !product.is_published });
    } catch (err) {
      console.error(err);
      // Revert on failure
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_published: product.is_published } : p));
    }
  };

  const handleSaveProduct = async (payload: ProductCreatePayload) => {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, payload);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } else {
      const created = await createProduct(payload);
      setProducts(prev => [created, ...prev]);
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
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkPublish = async (isPublished: boolean) => {
    try {
      await bulkUpdateVisibility(selectedIds, isPublished);
      setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, is_published: isPublished } : p));
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ShopkeeperTopbar title="Product Management" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-6 lg:p-10 relative"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Products & Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your shop's catalog, track stock, and update pricing quickly.
            </p>
          </div>
          
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <ProductFilters 
          filters={filters} 
          onFilterChange={setFilters} 
        />

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
        />
        
        {/* Render Modal Outside Main Layout flow */}
        <ProductModal 
          isOpen={isModalOpen}
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct as any}
        />

        <ProductAnalyticsDrawer
          isOpen={isAnalyticsOpen}
          product={analyticsProduct}
          onClose={() => setIsAnalyticsOpen(false)}
        />

        <BulkActionBar 
          selectedIds={selectedIds}
          onClearSelection={() => setSelectedIds([])}
          onBulkDelete={handleBulkDelete}
          onBulkPublish={handleBulkPublish}
        />
      </motion.div>
    </>
  );
}
