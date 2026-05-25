const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Read and parse .env.local manually
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  envContent.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      process.env[key] = val;
    }
  });
} catch (e) {
  console.warn("Could not read .env.local manually, relying on pre-existing process.env");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function cleanData() {
  console.log("Starting full database clean-up using Service Role Key...");

  // Tables to clean up in dependency order (child tables first)
  const tables = [
    "wishlists",
    "cart_items",
    "order_items",
    "orders",
    "product_analytics",
    "product_media",
    "shopkeeper_products",
    "shopkeeper"
  ];

  for (const table of tables) {
    try {
      console.log(`Clearing table "${table}"...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .neq("created_at", "1970-01-01T00:00:00Z"); // Delete all records matching a dummy check (or standard filter since we bypass RLS)

      if (error) {
        // Retry delete with alternative query if there's no created_at
        const { error: error2 } = await supabase
          .from(table)
          .delete()
          .filter("id", "not.eq", "00000000-0000-0000-0000-000000000000");

        if (error2) {
          console.warn(`Warning clearing "${table}": ${error2.message}`);
        } else {
          console.log(`Successfully cleared table "${table}"`);
        }
      } else {
        console.log(`Successfully cleared table "${table}"`);
      }
    } catch (e) {
      console.error(`Failed to clear table "${table}":`, e);
    }
  }

  console.log("Database clean-up finished successfully!");
}

cleanData();
