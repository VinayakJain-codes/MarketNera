import { supabase } from '@/lib/supabase';

// ── Types ──
export interface DashboardMetrics {
  totalRevenue: number;
  activeCustomers: number;
  totalOrders: number;
  conversionRate: number;
  revenueChange: number;
  customerChange: number;
  orderChange: number;
  conversionChange: number;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
}

export interface CategorySale {
  name: string;
  value: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Cancelled' | 'Pending';
  total: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  image: string;
}

// ── Fetchers (Supabase-backed with fallback) ──

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    // Note: 'shopkeeper_metrics' is a view or table you might have created.
    // If it doesn't exist, this will trigger the fallback.
    const { data, error } = await supabase
      .from('shopkeeper_metrics')
      .select('*')
      .single();
    if (error || !data) throw error;
    return data as DashboardMetrics;
  } catch {
    // Fallback: compute from orders table if it exists, else return zeros
    return computeMetricsFromOrders();
  }
}

async function computeMetricsFromOrders(): Promise<DashboardMetrics> {
  try {
    const { data: orders } = await supabase.from('orders').select('*');

    // Use correct column name: total_amount (not total)
    const totalRevenue = orders?.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0) ?? 0;
    const totalOrders = orders?.length ?? 0;
    // Count unique customers
    const uniqueCustomers = new Set(orders?.map(o => o.customer_id) ?? []).size;

    return {
      totalRevenue,
      activeCustomers: uniqueCustomers,
      totalOrders,
      conversionRate: 0,
      revenueChange: 0,
      customerChange: 0,
      orderChange: 0,
      conversionChange: 0,
    };
  } catch {
    return {
      totalRevenue: 0,
      activeCustomers: 0,
      totalOrders: 0,
      conversionRate: 0,
      revenueChange: 0,
      customerChange: 0,
      orderChange: 0,
      conversionChange: 0,
    };
  }
}

export async function getRevenueTrend(): Promise<RevenueTrend[]> {
  try {
    const { data, error } = await supabase
      .from('revenue_trends')
      .select('month, revenue')
      .order('month', { ascending: true });
    if (error || !data?.length) throw error;
    return data as RevenueTrend[];
  } catch {
    return [];
  }
}

export async function getSalesByCategory(): Promise<CategorySale[]> {
  try {
    const { data, error } = await supabase
      .from('sales_by_category')
      .select('name, value, color');
    if (error || !data?.length) throw error;
    return data as CategorySale[];
  } catch {
    return [];
  }
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    // Use correct columns: customer_id, total_amount, created_at
    // Join with order_items to get the first product name per order
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        customer_id,
        status,
        total_amount,
        created_at,
        order_items (
          product_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;
    if (!data?.length) return [];

    // Map DB rows → RecentOrder shape
    return data.map((row: any) => {
      // Capitalise first char of status to match union type
      const rawStatus = (row.status ?? 'pending') as string;
      const statusMap: Record<string, RecentOrder['status']> = {
        pending: 'Pending',
        accepted: 'Processing',
        preparing: 'Processing',
        ready: 'Processing',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      };

      const firstProduct = row.order_items?.[0]?.product_name ?? 'Order';

      return {
        id: row.id,
        customer: `Customer ${row.customer_id?.slice(0, 6) ?? ''}`,
        product: firstProduct,
        date: new Date(row.created_at).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: statusMap[rawStatus] ?? 'Pending',
        total: parseFloat(row.total_amount) || 0,
      };
    }) as RecentOrder[];
  } catch {
    return [];
  }
}

export async function getTopProducts(): Promise<TopProduct[]> {
  try {
    // Use the real table name 'shopkeeper_products'
    const { data, error } = await supabase
      .from('shopkeeper_products')
      .select('id, name, category, price')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error || !data?.length) throw error;
    
    // Map to TopProduct interface (simulating 'sold' and 'image' for now)
    return data.map(p => ({
      ...p,
      sold: 0,
      image: '',
    })) as TopProduct[];
  } catch {
    return [];
  }
}
