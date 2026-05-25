import { supabase } from "@/lib/supabase";

export interface ShopkeeperProfile {
    user_id: string; // Foreign key to auth.users
    shop_name: string;
    category: string;
    address: string;
    phone: string;
    tagline?: string | null;
    banner_url?: string | null;
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

/**
 * Fetches all shopkeeper profiles for display on the Customer Dashboard.
 */
export async function getAllShopkeepers(): Promise<ShopkeeperProfile[]> {
    const { data, error } = await supabase
        .from('shopkeeper')
        .select('user_id, shop_name, category, address, phone, created_at');

    if (error) {
        console.error('Error fetching all shopkeepers:', error);
        return [];
    }

    return (data ?? []) as ShopkeeperProfile[];
}

/**
 * Fetches shopkeepers within proximity of latitude/longitude using PostGIS RPC.
 */
export async function getNearbyShops(
    lat: number,
    lng: number,
    maxDistanceMeters: number = 10000 // default 10km
): Promise<(ShopkeeperProfile & { distance_meters?: number })[]> {
    const { data, error } = await supabase.rpc("get_nearby_shops", {
        user_lat: lat,
        user_lng: lng,
        max_dist_meters: maxDistanceMeters,
    });

    if (error) {
        console.error("Error fetching nearby shops:", error);
        // Fallback to all shopkeepers if PostGIS fails or is unconfigured
        return getAllShopkeepers();
    }

    return (data ?? []) as (ShopkeeperProfile & { distance_meters?: number })[];
}
