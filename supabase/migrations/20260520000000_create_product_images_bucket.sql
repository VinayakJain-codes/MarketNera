-- Create the product-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public read access to product-images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Enable insert/upload access for everyone
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Enable delete access for everyone
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );
