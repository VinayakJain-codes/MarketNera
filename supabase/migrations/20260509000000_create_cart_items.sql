-- Migration: 20260509000000_create_cart_items.sql
-- Creates the cart_items table for persisting customer cart state.

-- 1. Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.shopkeeper_products(id) ON DELETE CASCADE,
    shopkeeper_id UUID NOT NULL,  -- denormalized for quick shopkeeper grouping
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- One row per user+product combination
    CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id)
);

-- 2. Auto-update updated_at
CREATE OR REPLACE TRIGGER set_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. Enable Row Level Security
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: users can only access their own cart
CREATE POLICY "Users can view their own cart"
    ON public.cart_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart"
    ON public.cart_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
    ON public.cart_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart"
    ON public.cart_items FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Index for fast per-user cart lookups
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
