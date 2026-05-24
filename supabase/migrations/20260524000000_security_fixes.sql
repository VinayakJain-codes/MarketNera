-- 1. Add RLS Policies for shopkeeper_products
-- Allow shopkeepers to manage all their products
CREATE POLICY "Shopkeepers manage their own products" 
ON public.shopkeeper_products 
FOR ALL USING (auth.uid() = shop_id);

-- Allow anyone (including customers) to view published products
CREATE POLICY "Public can view published products" 
ON public.shopkeeper_products 
FOR SELECT USING (is_published = true);

-- 2. Add RLS Policies for product_media
CREATE POLICY "Shopkeepers manage their product media" 
ON public.product_media 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.shopkeeper_products p 
    WHERE p.id = product_id AND p.shop_id = auth.uid()
  )
);

CREATE POLICY "Public can view product media" 
ON public.product_media 
FOR SELECT USING (true);

-- 3. Refine orders update policy
DROP POLICY IF EXISTS "Shopkeepers update order status" ON public.orders;

CREATE POLICY "Shopkeepers can update their orders"
ON public.orders FOR UPDATE
USING (auth.uid() = shopkeeper_id);

CREATE POLICY "Customers can cancel their pending orders"
ON public.orders FOR UPDATE
USING (auth.uid() = customer_id AND status = 'pending')
WITH CHECK (status = 'cancelled');
