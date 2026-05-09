-- Migration: 20260509000001_create_orders.sql
-- Creates orders and order_items tables for the full order lifecycle.

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    shopkeeper_id UUID NOT NULL,  -- denormalized reference to shopkeeper profile
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled')),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    delivery_address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.shopkeeper_products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,   -- snapshot of name at order time
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    subtotal NUMERIC(12, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Auto-update orders.updated_at
CREATE OR REPLACE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 4. Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for orders

-- Customers see their own orders
CREATE POLICY "Customers view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = customer_id);

-- Shopkeepers see orders directed at them
CREATE POLICY "Shopkeepers view their orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = shopkeeper_id);

-- Only customers can create orders
CREATE POLICY "Customers create orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Shopkeepers can update status on their orders; customers can cancel their own
CREATE POLICY "Shopkeepers update order status"
    ON public.orders FOR UPDATE
    USING (auth.uid() = shopkeeper_id OR auth.uid() = customer_id);

-- 6. RLS Policies for order_items

-- Readable by the customer or shopkeeper of the parent order
CREATE POLICY "Order parties view order items"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id
              AND (o.customer_id = auth.uid() OR o.shopkeeper_id = auth.uid())
        )
    );

-- Inserted only when the customer owns the order
CREATE POLICY "Customer inserts order items"
    ON public.order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id AND o.customer_id = auth.uid()
        )
    );

-- 7. Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_orders_customer_id     ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_shopkeeper_id   ON public.orders(shopkeeper_id);
CREATE INDEX IF NOT EXISTS idx_orders_status          ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON public.order_items(order_id);
