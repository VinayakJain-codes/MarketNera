-- Supabase Migration: 20260326_init_product_management.sql

-- 1. Create the Core Products Table
CREATE TABLE IF NOT EXISTS public.shopkeeper_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shop_id UUID NOT NULL, -- Ties to the shopkeeper's account
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    sub_category TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2),
    price_valid_from TIMESTAMP WITH TIME ZONE,
    price_valid_to TIMESTAMP WITH TIME ZONE,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    unit_type TEXT NOT NULL, -- e.g., 'kg', 'piece', 'dozen'
    sku TEXT,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_live_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN DEFAULT false,
    hide_from_search BOOLEAN DEFAULT false,
    restock_notification BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Media Table (One-to-Many for Products)
CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.shopkeeper_products(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
    is_primary BOOLEAN DEFAULT false,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Analytics Table (One-to-One for Products)
CREATE TABLE IF NOT EXISTS public.product_analytics (
    product_id UUID REFERENCES public.shopkeeper_products(id) ON DELETE CASCADE PRIMARY KEY,
    view_count INTEGER DEFAULT 0,
    cart_add_count INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    revenue_generated NUMERIC(12, 2) DEFAULT 0.00,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Automatically touch updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.shopkeeper_products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 5. Enable RLS (Row Level Security) - Customize auth schemas as needed based on your setup
ALTER TABLE public.shopkeeper_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;

-- Note: You should add policies matching your `auth.uid()` so shopkeepers can only see their own products.
-- Example:
-- CREATE POLICY "Shopkeepers manage their own products" ON public.shopkeeper_products 
-- FOR ALL USING (auth.uid() = shop_id);
