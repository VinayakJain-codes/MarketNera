-- Sprint 6: Growth Features — PostGIS, Reviews, and Coupons

-- ═══════════════════════════════════════════════════════
-- 1. POSTGIS & HYPERLOCAL LOCATION SCHEMAS
-- ═══════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS location GEOGRAPHY(Point, 4326);

CREATE INDEX IF NOT EXISTS idx_shopkeeper_location ON shopkeeper USING GIST(location);

-- RPC Function to query shops within a certain distance of user coordinates
CREATE OR REPLACE FUNCTION get_nearby_shops(
    user_lat double precision,
    user_lng double precision,
    max_dist_meters double precision
)
RETURNS TABLE (
    user_id UUID,
    shop_name TEXT,
    category TEXT,
    address TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ,
    distance_meters double precision
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.user_id,
        sp.shop_name,
        sp.category,
        sp.address,
        sp.phone,
        sp.created_at,
        ST_Distance(sp.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography) AS distance_meters
    FROM 
        shopkeeper sp
    WHERE 
        sp.location IS NOT NULL
        AND ST_DWithin(sp.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, max_dist_meters)
    ORDER BY 
        distance_meters ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══════════════════════════════════════════════════════
-- 2. PRODUCT REVIEWS & RATINGS TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES shopkeeper_products(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, customer_id) -- only one review per user per product
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read product reviews" ON product_reviews;
CREATE POLICY "Anyone can read product reviews" ON product_reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON product_reviews;
CREATE POLICY "Users can manage own reviews" ON product_reviews
    FOR ALL USING (auth.uid() = customer_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON product_reviews(product_id);


-- ═══════════════════════════════════════════════════════
-- 3. COUPONS & PROMO CODES TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    expiry_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read coupons" ON coupons;
CREATE POLICY "Anyone can read coupons" ON coupons
    FOR SELECT USING (true);

-- Seed default coupon codes
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expiry_date, is_active)
VALUES ('WELCOME20', 'percentage', 20, 100, now() + interval '1 year', true)
ON CONFLICT (code) DO NOTHING;
