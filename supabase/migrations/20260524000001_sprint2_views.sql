-- Migration: sprint2_views
-- Purpose: Add views for shopkeeper dashboard and atomic order creation RPC

-- 1. shopkeeper_metrics view
CREATE OR REPLACE VIEW public.shopkeeper_metrics AS
SELECT 
    shopkeeper_id AS shop_id,
    COALESCE(SUM(total_amount), 0) AS total_revenue,
    COUNT(DISTINCT customer_id) AS active_customers,
    COUNT(id) AS total_orders,
    0 AS conversion_rate,
    0 AS revenue_change,
    0 AS customer_change,
    0 AS order_change,
    0 AS conversion_change
FROM public.orders
GROUP BY shopkeeper_id;

-- 2. revenue_trends view
CREATE OR REPLACE VIEW public.revenue_trends AS
SELECT 
    shopkeeper_id AS shop_id,
    TO_CHAR(created_at, 'Mon') AS month,
    DATE_TRUNC('month', created_at) AS month_date,
    SUM(total_amount) AS revenue
FROM public.orders
GROUP BY shopkeeper_id, TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
ORDER BY month_date ASC;

-- 3. sales_by_category view
CREATE OR REPLACE VIEW public.sales_by_category AS
SELECT 
    o.shopkeeper_id AS shop_id,
    p.category AS name,
    SUM(oi.quantity * oi.unit_price) AS value,
    -- Assign deterministic colors based on category name
    CASE p.category
        WHEN 'Grocery' THEN '#f97316'
        WHEN 'Electronics' THEN '#3b82f6'
        WHEN 'Medicine' THEN '#ef4444'
        WHEN 'Stationery' THEN '#a855f7'
        WHEN 'Snacks' THEN '#eab308'
        WHEN 'Fashion' THEN '#ec4899'
        WHEN 'Home' THEN '#14b8a6'
        ELSE '#94a3b8'
    END AS color
FROM public.order_items oi
JOIN public.orders o ON oi.order_id = o.id
JOIN public.shopkeeper_products p ON oi.product_id = p.id
GROUP BY o.shopkeeper_id, p.category;

-- 4. place_order_atomic RPC
CREATE OR REPLACE FUNCTION public.place_order_atomic(
    p_customer_id UUID,
    p_shopkeeper_id UUID,
    p_total_amount NUMERIC,
    p_delivery_address TEXT,
    p_notes TEXT,
    p_payment_method TEXT,
    p_payment_status TEXT,
    p_razorpay_order_id TEXT,
    p_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
BEGIN
    -- Insert the order
    INSERT INTO public.orders (
        customer_id,
        shopkeeper_id,
        status,
        total_amount,
        delivery_address,
        notes,
        payment_method,
        payment_status,
        razorpay_order_id
    ) VALUES (
        p_customer_id,
        p_shopkeeper_id,
        'pending',
        p_total_amount,
        p_delivery_address,
        p_notes,
        p_payment_method,
        p_payment_status,
        p_razorpay_order_id
    ) RETURNING id INTO v_order_id;

    -- Insert all order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            unit_price,
            quantity
        ) VALUES (
            v_order_id,
            (v_item->>'productId')::UUID,
            v_item->>'productName',
            (v_item->>'unitPrice')::NUMERIC,
            (v_item->>'quantity')::INTEGER
        );
    END LOOP;

    -- Return the created order id
    RETURN jsonb_build_object('order_id', v_order_id);
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to place order atomically: %', SQLERRM;
END;
$$;
