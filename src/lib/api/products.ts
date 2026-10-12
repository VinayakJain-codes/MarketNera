import { supabase } from '@/lib/supabase';

// ── Types ──

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  category: string;
  sub_category: string | null;
  price: number;
  sale_price: number | null;
  price_valid_from: string | null;
  price_valid_to: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  unit_type: string;
  sku: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  scheduled_live_at: string | null;
  is_featured: boolean;
  hide_from_search: boolean;
  restock_notification: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductCreatePayload = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'published_at'>;

export interface ProductMedia {
  id: string;
  product_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  is_primary: boolean;
  alt_text: string | null;
  sort_order: number;
}

// ── Filters ──

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: 'published' | 'draft' | 'low_stock' | 'out_of_stock';
}

// ── CRUD Methods ──

/**
 * Fetch products for a specific shop, optionally filtered.
 */
export async function getProducts(shopId: string, filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('shopkeeper_products')
    .select(`
      *,
      product_media (id, media_url, sort_order, is_primary)
    `)
    .eq('shop_id', shopId);

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }

  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  if (filters?.status) {
    if (filters.status === 'published') {
      query = query.eq('is_published', true);
    } else if (filters.status === 'draft') {
      query = query.eq('is_published', false);
    } else if (filters.status === 'out_of_stock') {
      query = query.lte('stock_quantity', 0);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error('Supabase query error:', error);
    throw new Error(error.message || JSON.stringify(error));
  }

  let results = data as Product[];

  // Post-process low_stock filter if requested
  if (filters?.status === 'low_stock') {
    results = results.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold);
  }

  return results;
}

/**
 * Fetch published products across ALL shops for Customer Dashboard.
 */
export async function getGlobalProducts(filters?: { search?: string; category?: string; limit?: number }): Promise<Product[]> {
  let query = supabase
    .from('shopkeeper_products')
    .select(`
      *,
      product_media (id, media_url, sort_order, is_primary)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(filters?.limit ?? 20);

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
  }

  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Supabase getGlobalProducts error:', error.message);
    return [];
  }
  return (data ?? []) as Product[];
}


/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('shopkeeper_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? (data as Product) : null;
}

/**
 * Create a new product.
 */
export async function createProduct(payload: ProductCreatePayload): Promise<Product> {
  const insertData = {
    ...payload,
    published_at: payload.is_published ? new Date().toISOString() : null
  };

  const { data, error } = await supabase
    .from('shopkeeper_products')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    const { code, message, details, hint } = error as any;
    console.error('Supabase createProduct error:', { code, message, details, hint });
    throw new Error(message || details || hint || `DB error (code: ${code})`);
  }
  return data as Product;
}

/**
 * Update an existing product.
 */
export async function updateProduct(id: string, payload: Partial<ProductCreatePayload>): Promise<Product> {
  const updateData: Record<string, any> = { ...payload };
  if (payload.is_published !== undefined) {
    updateData.published_at = payload.is_published ? new Date().toISOString() : null;
  }

  const { data, error } = await supabase
    .from('shopkeeper_products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Delete a product.
 */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('shopkeeper_products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ── Bulk Operations ──

export async function bulkDeleteProducts(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('shopkeeper_products')
    .delete()
    .in('id', ids);

  if (error) throw error;
}

export async function bulkUpdateVisibility(ids: string[], isPublished: boolean): Promise<void> {
  const { error } = await supabase
    .from('shopkeeper_products')
    .update({ 
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null 
    })
    .in('id', ids);

  if (error) throw error;
}

// ── Media Methods ──

export async function getProductMedia(productId: string): Promise<ProductMedia[]> {
  const { data, error } = await supabase
    .from('product_media')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as ProductMedia[];
}

/**
 * Upload an image file to Supabase Storage and create a DB record.
 */
export async function uploadProductMedia(productId: string, file: File, isPrimary: boolean = false): Promise<ProductMedia> {
  // 1. Upload to storage bucket called 'product-images'
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  // 3. Create DB record
  const { data, error: dbError } = await supabase
    .from('product_media')
    .insert([{
      product_id: productId,
      media_url: publicUrl,
      media_type: file.type.startsWith('video/') ? 'video' : 'image',
      is_primary: isPrimary,
      alt_text: file.name
    }])
    .select()
    .single();

  if (dbError) throw dbError;
  return data as ProductMedia;
}

export async function deleteProductMedia(mediaId: string, mediaUrl: string): Promise<void> {
  // 1. Delete from storage
  const path = mediaUrl.split('/product-images/').pop();
  if (path) {
    await supabase.storage.from('product-images').remove([path]);
  }

  // 2. Delete from DB
  const { error } = await supabase
    .from('product_media')
    .delete()
    .eq('id', mediaId);

  if (error) throw error;
}
