import { supabase } from "@/lib/supabase";

export interface Coupon {
    id: string;
    code: string;
    discount_type: "percentage" | "flat";
    discount_value: number;
    min_order_amount: number;
    expiry_date: string | null;
    is_active: boolean;
}

/**
 * Validate a promo coupon code against order amount.
 */
export async function validateCoupon(
    code: string,
    orderAmount: number
): Promise<{ success: boolean; coupon?: Coupon; error?: string }> {
    const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.trim().toUpperCase())
        .single();

    if (error || !coupon) {
        return { success: false, error: "Invalid coupon code." };
    }

    if (!coupon.is_active) {
        return { success: false, error: "This coupon is no longer active." };
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
        return { success: false, error: "This coupon has expired." };
    }

    if (orderAmount < coupon.min_order_amount) {
        return {
            success: false,
            error: `Minimum order amount of ₹${coupon.min_order_amount} required for this coupon.`,
        };
    }

    return { success: true, coupon: coupon as Coupon };
}
