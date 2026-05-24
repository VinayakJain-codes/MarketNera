import { supabase } from "@/lib/supabase";

export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
    product?: {
        id: string;
        name: string;
        price: number;
        sale_price: number | null;
        category: string;
        shop_id: string;
        product_media?: { media_url: string; is_primary: boolean; sort_order: number }[];
    };
}

/**
 * Get all wishlist items for a user, with product details.
 */
export async function getWishlist(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await supabase
        .from("wishlists")
        .select(`
            *,
            product:shopkeeper_products (
                id, name, price, sale_price, category, shop_id,
                product_media (media_url, is_primary, sort_order)
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
    return (data ?? []) as WishlistItem[];
}

/**
 * Get wishlist count for a user.
 */
export async function getWishlistCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from("wishlists")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

    if (error) return 0;
    return count ?? 0;
}

/**
 * Check if a product is in the user's wishlist.
 */
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
    const { count, error } = await supabase
        .from("wishlists")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("product_id", productId);

    if (error) return false;
    return (count ?? 0) > 0;
}

/**
 * Toggle a product in the wishlist (add if not present, remove if present).
 */
export async function toggleWishlist(
    userId: string,
    productId: string
): Promise<{ added: boolean; error?: string }> {
    // Check if already exists
    const { data: existing } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

    if (existing) {
        // Remove
        const { error } = await supabase
            .from("wishlists")
            .delete()
            .eq("id", existing.id);

        if (error) return { added: false, error: error.message };
        return { added: false };
    }

    // Add
    const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: userId, product_id: productId });

    if (error) return { added: false, error: error.message };
    return { added: true };
}
