import { supabase } from "@/lib/supabase";

export interface CustomerAddress {
    id: string;
    user_id: string;
    label: string;
    address_line: string;
    city: string | null;
    pincode: string | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Get all saved addresses for a user.
 */
export async function getAddresses(userId: string): Promise<CustomerAddress[]> {
    const { data, error } = await supabase
        .from("customer_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
    return (data ?? []) as CustomerAddress[];
}

/**
 * Get address count for a user.
 */
export async function getAddressCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from("customer_addresses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

    if (error) return 0;
    return count ?? 0;
}

/**
 * Add a new address.
 */
export async function addAddress(
    userId: string,
    address: { label: string; address_line: string; city?: string; pincode?: string; is_default?: boolean }
): Promise<{ success: boolean; data?: CustomerAddress; error?: string }> {
    // If setting as default, unset other defaults first
    if (address.is_default) {
        await supabase
            .from("customer_addresses")
            .update({ is_default: false })
            .eq("user_id", userId)
            .eq("is_default", true);
    }

    const { data, error } = await supabase
        .from("customer_addresses")
        .insert({
            user_id: userId,
            label: address.label,
            address_line: address.address_line,
            city: address.city ?? null,
            pincode: address.pincode ?? null,
            is_default: address.is_default ?? false,
        })
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as CustomerAddress };
}

/**
 * Delete an address.
 */
export async function deleteAddress(
    userId: string,
    addressId: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from("customer_addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

/**
 * Set an address as default.
 */
export async function setDefaultAddress(
    userId: string,
    addressId: string
): Promise<{ success: boolean; error?: string }> {
    // Unset all defaults
    await supabase
        .from("customer_addresses")
        .update({ is_default: false })
        .eq("user_id", userId);

    // Set the chosen one
    const { error } = await supabase
        .from("customer_addresses")
        .update({ is_default: true })
        .eq("id", addressId)
        .eq("user_id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}
