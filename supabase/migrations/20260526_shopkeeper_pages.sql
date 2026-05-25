-- Front Store additions
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{}';
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS delivery_radius_km NUMERIC DEFAULT 5;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS min_order_amount NUMERIC DEFAULT 0;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS delivery_time_minutes INTEGER DEFAULT 30;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 0;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS instagram TEXT;

-- Settings notifications
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS notif_new_order_sound BOOLEAN DEFAULT true;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS notif_new_order_email BOOLEAN DEFAULT true;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS notif_low_stock_email BOOLEAN DEFAULT true;
ALTER TABLE shopkeeper ADD COLUMN IF NOT EXISTS notif_daily_summary BOOLEAN DEFAULT false;

-- Calendar closures
CREATE TABLE IF NOT EXISTS shopkeeper_closures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (shop_id, date)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopkeeper_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(shopkeeper_id, customer_id, created_at);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversation parties access messages"
  ON messages FOR ALL
  USING (auth.uid() = shopkeeper_id OR auth.uid() = customer_id);

-- Payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopkeeper_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed')),
  bank_account_last4 TEXT,
  initiated_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shopkeeper views own payouts"
  ON payouts FOR SELECT
  USING (auth.uid() = shopkeeper_id);

-- Analytics views
DROP VIEW IF EXISTS revenue_trends;
CREATE VIEW revenue_trends AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  shopkeeper_id,
  SUM(total_amount) AS revenue
FROM orders
WHERE payment_status = 'paid'
GROUP BY 1, 2;

DROP VIEW IF EXISTS sales_by_category;
CREATE VIEW sales_by_category AS
SELECT
  sp.category AS name,
  COUNT(oi.id) AS value,
  o.shopkeeper_id
FROM order_items oi
JOIN shopkeeper_products sp ON sp.id = oi.product_id
JOIN orders o ON o.id = oi.order_id
WHERE o.payment_status = 'paid'
GROUP BY sp.category, o.shopkeeper_id;
