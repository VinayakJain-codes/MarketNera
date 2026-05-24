-- Sprint 4: Add database indexes for high-frequency queries
-- These indexes dramatically improve query performance as data grows

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_shopkeeper_id ON orders(shopkeeper_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON shopkeeper_products(category);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON shopkeeper_products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON shopkeeper_products(is_published);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
