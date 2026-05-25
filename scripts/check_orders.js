const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local file
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE env variables in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log("=== CHECKING SHOPKEEPERS ===");
  const { data: shops, error: shopsErr } = await supabase.from('shopkeeper').select('user_id, shop_name, category');
  if (shopsErr) console.error(shopsErr);
  else console.log(shops);

  console.log("\n=== CHECKING ORDERS ===");
  const { data: orders, error: ordersErr } = await supabase.from('orders').select('id, customer_id, shopkeeper_id, status, total_amount, created_at');
  if (ordersErr) console.error(ordersErr);
  else console.log(orders);
}

check();
