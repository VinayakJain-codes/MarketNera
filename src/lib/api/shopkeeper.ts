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

export async function getDashboardMetrics(shopId?: string | null): Promise<DashboardMetrics> {
  if (shopId === 'mock-shopkeeper-uuid-12345') {
    return {
      totalRevenue: 84250,
      activeCustomers: 142,
      totalOrders: 328,
      conversionRate: 3.4,
      revenueChange: 12.5,
      customerChange: 8.2,
      orderChange: 15.3,
      conversionChange: 0.4,
    };
  }
  try {
    // Note: 'shopkeeper_metrics' is a view or table you might have created.
    // If it doesn't exist, this will trigger the fallback.
    let query = supabase
      .from('shopkeeper_metrics')
      .select('*');
    if (shopId) {
      query = query.eq('shopkeeper_id', shopId);
    }
    const { data, error } = await query.single();
    if (error || !data) throw error;
    return data as DashboardMetrics;
  } catch {
    // Fallback: compute from orders table if it exists, else return zeros
    return computeMetricsFromOrders(shopId);
  }
}

async function computeMetricsFromOrders(shopId?: string | null): Promise<DashboardMetrics> {
  try {
    let query = supabase.from('orders').select('*');
    if (shopId) {
      query = query.eq('shopkeeper_id', shopId);
    }
    const { data: orders } = await query;

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
    return [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 61000 },
      { month: 'Apr', revenue: 70000 },
      { month: 'May', revenue: 84250 },
    ];
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
    return [
      { name: 'Groceries', value: 45, color: '#138808' },
      { name: 'Beverages', value: 25, color: '#FF9933' },
      { name: 'Personal Care', value: 18, color: '#000080' },
      { name: 'Household', value: 12, color: '#F97316' },
    ];
  }
}

export async function getRecentOrders(shopId?: string | null): Promise<RecentOrder[]> {
  if (shopId === 'mock-shopkeeper-uuid-12345') {
    return [
      { id: '1', customer: 'Rahul Sharma', product: 'Aashirvaad Atta & Milk', date: 'Today', status: 'Delivered', total: 380 },
      { id: '2', customer: 'Priya Patel', product: 'Premium Basmati Rice', date: 'Yesterday', status: 'Processing', total: 650 },
      { id: '3', customer: 'Amit Verma', product: 'Organic Green Tea', date: '2 days ago', status: 'Delivered', total: 220 },
      { id: '4', customer: 'Sneha Gupta', product: 'Household Cleaners', date: '3 days ago', status: 'Cancelled', total: 480 },
      { id: '5', customer: 'Rajesh Kumar', product: 'Fortune Cooking Oil', date: '4 days ago', status: 'Pending', total: 310 },
    ];
  }
  try {
    // Use correct columns: customer_id, total_amount, created_at
    // Join with order_items to get the first product name per order
    let query = supabase
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
      `);

    if (shopId) {
      query = query.eq('shopkeeper_id', shopId);
    }

    const { data, error } = await query
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

export async function getTopProducts(shopId?: string | null): Promise<TopProduct[]> {
  if (shopId === 'mock-shopkeeper-uuid-12345') {
    return [
      { id: 'p1', name: 'Aashirvaad Atta 5kg', category: 'Groceries', price: 260, sold: 48, image: '' },
      { id: 'p2', name: 'Surf Excel Easy Wash 1kg', category: 'Household', price: 140, sold: 32, image: '' },
      { id: 'p3', name: 'Fortune Mustard Oil 1L', category: 'Groceries', price: 175, sold: 29, image: '' },
      { id: 'p4', name: 'Tata Salt 1kg', category: 'Groceries', price: 28, sold: 25, image: '' },
      { id: 'p5', name: 'Amul Butter 500g', category: 'Dairy', price: 275, sold: 22, image: '' },
    ];
  }
  try {
    // Use the real table name 'shopkeeper_products'
    let query = supabase
      .from('shopkeeper_products')
      .select('id, name, category, price');

    if (shopId) {
      query = query.eq('shop_id', shopId);
    }

    const { data, error } = await query
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

/**
 * Calculate dynamic customer satisfaction score for a shop based on product reviews.
 */
export async function getShopkeeperSatisfactionScore(shopId?: string | null): Promise<number> {
  if (!shopId) return 5.0;
  try {
    // 1. Get all product IDs for this shop
    const { data: products, error: prodError } = await supabase
      .from('shopkeeper_products')
      .select('id')
      .eq('shop_id', shopId);
      
    if (prodError || !products || products.length === 0) return 5.0; // Default to 5.0 if no products
    
    const productIds = products.map(p => p.id);
    
    // 2. Fetch all reviews for these products
    const { data: reviews, error: revError } = await supabase
      .from('product_reviews')
      .select('rating')
      .in('product_id', productIds);
      
    if (revError || !reviews || reviews.length === 0) return 5.0; // Default to 5.0 if no reviews yet
    
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = parseFloat((total / reviews.length).toFixed(1));
    return average;
  } catch {
    return 5.0;
  }
}
