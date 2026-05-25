const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

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
  console.error("Could not read .env.local", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function testInsert() {
  const testId = "00000000-0000-0000-0000-000000000000";
  console.log("Testing insert with image_url column...");
  
  const { data, error } = await supabase
    .from("shopkeeper")
    .upsert({
      user_id: testId,
      shop_name: "Test Shop",
      category: "Grocery",
      address: "123 Test St",
      phone: "1234567890",
      image_url: "https://example.com/photo.jpg"
    })
    .select();

  if (error) {
    console.log("Error inserting with image_url:", error.message);
  } else {
    console.log("SUCCESS! The image_url column exists in the database!", data);
    // Delete the test record
    await supabase.from("shopkeeper").delete().eq("user_id", testId);
  }
}

testInsert();
