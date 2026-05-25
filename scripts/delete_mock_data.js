const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clean() {
  const mockId = '00000000-0000-0000-0000-000000000000';
  
  console.log("=== CLEANING MOCK DATA FOR 00000000-0000-0000-0000-000000000000 ===");

  // 1. Delete order items for mock orders
  const { data: mockOrders } = await supabase.from('orders').select('id').eq('shopkeeper_id', mockId);
  if (mockOrders && mockOrders.length > 0) {
    const orderIds = mockOrders.map(o => o.id);
    const { error: orderItemsErr } = await supabase.from('order_items').delete().in('order_id', orderIds);
    if (orderItemsErr) console.error("Error deleting mock order items:", orderItemsErr);
    else console.log(`Deleted order items for mock orders: ${orderIds.join(', ')}`);
  }

  // 2. Delete mock orders
  const { error: ordersErr } = await supabase.from('orders').delete().eq('shopkeeper_id', mockId);
  if (ordersErr) console.error("Error deleting mock orders:", ordersErr);
  else console.log("Deleted mock orders!");

  // 3. Delete mock product media
  const { data: mockProducts } = await supabase.from('shopkeeper_products').select('id').eq('shop_id', mockId);
  if (mockProducts && mockProducts.length > 0) {
    const productIds = mockProducts.map(p => p.id);
    const { error: mediaErr } = await supabase.from('product_media').delete().in('product_id', productIds);
    if (mediaErr) console.error("Error deleting mock product media:", mediaErr);
    else console.log(`Deleted product media for mock products: ${productIds.join(', ')}`);

    // 4. Delete mock products
    const { error: productsErr } = await supabase.from('shopkeeper_products').delete().eq('shop_id', mockId);
    if (productsErr) console.error("Error deleting mock products:", productsErr);
    else console.log("Deleted mock products!");
  }

  console.log("=== MOCK DATA CLEANUP COMPLETED ===");
}

clean();
