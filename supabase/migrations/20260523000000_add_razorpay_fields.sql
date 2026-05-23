-- Migration: 20260523000000_add_razorpay_fields.sql
-- Description: Adds columns to public.orders table to support Razorpay and COD billing info.

-- 1. Add columns to public.orders table
ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cod'
    CONSTRAINT check_payment_method CHECK (payment_method IN ('cod', 'razorpay'));

ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
    CONSTRAINT check_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed'));

ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT UNIQUE;

ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- 2. Create indexes for quick order lookups by razorpay order id or payment status
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
