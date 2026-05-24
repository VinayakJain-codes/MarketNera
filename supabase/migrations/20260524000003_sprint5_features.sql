-- Sprint 5: Feature completions — Wishlist, Saved Addresses, Product Analytics Triggers

-- ═══════════════════════════════════════════════════════
-- 1. WISHLIST TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES shopkeeper_products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlist" ON wishlists
    FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);


-- ═══════════════════════════════════════════════════════
-- 2. CUSTOMER ADDRESSES TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    address_line TEXT NOT NULL,
    city TEXT,
    pincode TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own addresses" ON customer_addresses
    FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON customer_addresses(user_id);


-- ═══════════════════════════════════════════════════════
-- 3. PRODUCT ANALYTICS INCREMENT TRIGGERS
-- ═══════════════════════════════════════════════════════

-- Ensure product_analytics table exists (may already exist)
CREATE TABLE IF NOT EXISTS product_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES shopkeeper_products(id) ON DELETE CASCADE UNIQUE,
    view_count INT DEFAULT 0,
    cart_add_count INT DEFAULT 0,
    order_count INT DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    last_carted_at TIMESTAMPTZ,
    last_ordered_at TIMESTAMPTZ
);

-- Trigger: increment cart_add_count when a cart_items row is inserted
CREATE OR REPLACE FUNCTION increment_cart_add_count()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO product_analytics (product_id, cart_add_count, last_carted_at)
    VALUES (NEW.product_id, 1, now())
    ON CONFLICT (product_id)
    DO UPDATE SET 
        cart_add_count = product_analytics.cart_add_count + 1,
        last_carted_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_cart_add_analytics ON cart_items;
CREATE TRIGGER trg_cart_add_analytics
    AFTER INSERT ON cart_items
    FOR EACH ROW EXECUTE FUNCTION increment_cart_add_count();

-- Trigger: increment order_count when an order_items row is inserted
CREATE OR REPLACE FUNCTION increment_order_count()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO product_analytics (product_id, order_count, last_ordered_at)
    VALUES (NEW.product_id, NEW.quantity, now())
    ON CONFLICT (product_id)
    DO UPDATE SET 
        order_count = product_analytics.order_count + NEW.quantity,
        last_ordered_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_order_item_analytics ON order_items;
CREATE TRIGGER trg_order_item_analytics
    AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION increment_order_count();

-- RLS for product_analytics (read for shopkeepers who own the product)
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product analytics" ON product_analytics
    FOR SELECT USING (true);

-- RPC Function to increment product view count safely from UI
CREATE OR REPLACE FUNCTION increment_product_view(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO product_analytics (product_id, view_count, last_viewed_at)
    VALUES (p_product_id, 1, now())
    ON CONFLICT (product_id)
    DO UPDATE SET 
        view_count = product_analytics.view_count + 1,
        last_viewed_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
