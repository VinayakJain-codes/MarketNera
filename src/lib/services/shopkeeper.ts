import { supabase } from "@/lib/supabase";

export interface ShopkeeperProfile {
    user_id: string; // Foreign key to auth.users
    shop_name: string;
    category: string;
    address: string;
    phone: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Upserts a shopkeeper profile in the database.
 * If a profile with the user_id exists, it updates it. Otherwise, it inserts a new one.
 */
export async function upsertShopkeeperProfile(profile: ShopkeeperProfile) {
    const { data, error } = await supabase
        .from("shopkeeper")
        .upsert({
            ...profile,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error upserting shopkeeper profile:", error);
        throw new Error(error.message);
    }
    return data;
}

/**
 * Fetches the shopkeeper profile for a given user ID.
 */
export async function getShopkeeperProfile(userId: string) {
    const { data, error } = await supabase
        .from("shopkeeper")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error && error.code !== 'PGRST116') // PGRST116 is "No rows found"
    {
        console.error("Error fetching shopkeeper profile:", error);
        throw new Error(error.message);
    }
    
    return data as ShopkeeperProfile | null;
}
