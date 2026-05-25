'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ShopkeeperTopbar from '@/components/layout/ShopkeeperTopbar';
import MetricsCards from '@/components/sections/shopkeeper/MetricsCards';
import DashboardChartsRow from '@/components/sections/shopkeeper/DashboardChartsRow';
import DashboardDataRow from '@/components/sections/shopkeeper/DashboardDataRow';
import GamificationWidget from '@/components/sections/shopkeeper/GamificationWidget';
import InventoryWarnings from '@/components/sections/shopkeeper/InventoryWarnings';
import QuickActions from '@/components/sections/shopkeeper/QuickActions';
import { getProducts } from '@/lib/api/products';
import { supabase } from '@/lib/supabase';
import {
  getDashboardMetrics,
  getRevenueTrend,
  getSalesByCategory,
  getRecentOrders,
  getTopProducts,
  getShopkeeperSatisfactionScore,
} from '@/lib/api/shopkeeper';
import type {
  DashboardMetrics,
  RevenueTrend,
  CategorySale,
  RecentOrder,
  TopProduct,
} from '@/lib/api/shopkeeper';

export default function ShopkeeperDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [revenue, setRevenue] = useState<RevenueTrend[]>([]);
  const [categories, setCategories] = useState<CategorySale[]>([]);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [satisfactionScore, setSatisfactionScore] = useState<number>(5.0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const shopId = user?.id || null;

        const [m, r, c, o, p, lowStockProducts, score] = await Promise.all([
          getDashboardMetrics(shopId),
          getRevenueTrend(),
          getSalesByCategory(),
          getRecentOrders(shopId),
          getTopProducts(shopId),
          shopId ? getProducts(shopId, { status: 'low_stock' }) : Promise.resolve([]),
          getShopkeeperSatisfactionScore(shopId),
        ]);
        setMetrics(m);
        setRevenue(r);
        setCategories(c);
        setOrders(o);
        setProducts(p);
        setSatisfactionScore(score);

        // Map low stock products to WarningItem shape
        const mappedWarnings = lowStockProducts.map((prod: any) => ({
          id: prod.id,
          name: prod.name,
          type: 'low_stock',
          detail: `${prod.stock_quantity} left`
        }));
        setWarnings(mappedWarnings);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <>
      <ShopkeeperTopbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      >
        {loading ? (
          /* Skeleton Loaders */
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-pulse h-32 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="skeleton-pulse h-72 rounded-2xl lg:col-span-2" />
              <div className="skeleton-pulse h-72 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="skeleton-pulse h-64 rounded-2xl lg:col-span-2" />
              <div className="skeleton-pulse h-64 rounded-2xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Row 1: Metrics */}
            <MetricsCards
              totalRevenue={metrics?.totalRevenue}
              activeCustomers={metrics?.activeCustomers}
              totalOrders={metrics?.totalOrders}
              conversionRate={metrics?.conversionRate}
              revenueChange={metrics?.revenueChange}
              customerChange={metrics?.customerChange}
              orderChange={metrics?.orderChange}
              conversionChange={metrics?.conversionChange}
            />

            {/* Row 2: Charts */}
            <DashboardChartsRow revenueData={revenue} categoryData={categories} />

            {/* Row 3: Data Tables */}
            <DashboardDataRow orders={orders} products={products} satisfactionScore={satisfactionScore} />

            {/* Row 4: Advanced Features */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <GamificationWidget currentRevenue={metrics?.totalRevenue || 0} />
              <InventoryWarnings warnings={warnings} />
            </div>
          </>
        )}
      </motion.div>

      {/* Floating Quick Actions */}
      <QuickActions />
    </>
  );
}
