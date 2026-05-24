import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    shopkeeper_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    // Joined product data
    product?: {
        id: string;
        name: string;
        price: number;
        sale_price: number | null;
        unit_type: string;
        shop_id: string;
        product_media?: { media_url: string; is_primary: boolean; sort_order: number }[];
    };
}

export interface CartSummary {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
}

// ── Service Functions ──────────────────────────────────────────────────────

/**
 * Fetches all cart items for a user, joined with product details.
 */
export async function getCart(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
        .from("cart_items")
        .select(`
            *,
            product:shopkeeper_products (
                id,
                name,
                price,
                sale_price,
                unit_type,
                shop_id,
                product_media (media_url, is_primary, sort_order)
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching cart:", error);
        return [];
    }
    return (data ?? []) as CartItem[];
}

/**
 * Returns just the total item count for the cart badge.
 */
export async function getCartCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from("cart_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching cart count:", error);
        return 0;
    }
    return count ?? 0;
}

/**
 * Adds a product to the cart. If it already exists, increments quantity by 1.
 */
export async function addToCart(
    userId: string,
    productId: string,
    shopkeeperId: string
): Promise<{ success: boolean; error?: string }> {
    // Try to increment existing item first (upsert approach)
    const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

    if (existing) {
        // Product already in cart — increment quantity
        const { error } = await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + 1 })
            .eq("id", existing.id);

        if (error) {
            console.error("Error updating cart quantity:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }

    // New cart item
    const { error } = await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: productId,
        shopkeeper_id: shopkeeperId,
        quantity: 1,
    });

    if (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Removes a product from the cart entirely (regardless of quantity).
 */
export async function removeFromCart(
    userId: string,
    productId: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

    if (error) {
        console.error("Error removing from cart:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Updates the quantity of a specific cart item.
 * If qty <= 0, removes the item entirely.
 */
export async function updateCartQty(
    userId: string,
    itemId: string,
    qty: number
): Promise<{ success: boolean; error?: string }> {
    if (qty <= 0) {
        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("id", itemId)
            .eq("user_id", userId); // extra safety

        if (error) {
            console.error("Error removing cart item:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    }

    const { error } = await supabase
        .from("cart_items")
        .update({ quantity: qty })
        .eq("id", itemId)
        .eq("user_id", userId); // extra safety

    if (error) {
        console.error("Error updating cart qty:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Clears all items from a user's cart (e.g., after order placement).
 */
export async function clearCart(userId: string): Promise<void> {
    await supabase.from("cart_items").delete().eq("user_id", userId);
}

/**
 * Helper: compute cart subtotal from cart items.
 */
export function computeSubtotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
        const price = item.product?.sale_price ?? item.product?.price ?? 0;
        return total + price * item.quantity;
    }, 0);
}

/**
 * Bulk add past order items back to the user's cart.
 * Clears the cart first to avoid multi-shop conflicts.
 */
export async function reorderPastOrder(
    userId: string,
    items: { product_id: string; shop_id: string; quantity: number }[]
): Promise<{ success: boolean; error?: string }> {
    try {
        await clearCart(userId);

        if (items.length === 0) {
            return { success: true };
        }

        const insertData = items.map(item => ({
            user_id: userId,
            product_id: item.product_id,
            shopkeeper_id: item.shop_id,
            quantity: item.quantity
        }));

        const { error } = await supabase.from("cart_items").insert(insertData);

        if (error) {
            console.error("Error bulk inserting reorder items:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Exception in reorderPastOrder:", err);
        return { success: false, error: err?.message || "An unexpected error occurred." };
    }
}
