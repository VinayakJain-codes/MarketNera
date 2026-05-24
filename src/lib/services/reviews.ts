import { supabase } from "@/lib/supabase";

export interface ProductReview {
    id: string;
    product_id: string;
    customer_id: string;
    rating: number;
    review_text: string | null;
    created_at: string;
    customer_name?: string;
}

/**
 * Fetch all reviews for a product.
 */
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
    const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }

    // Quietly resolve user metadata names if possible
    return (data ?? []).map((review: any) => ({
        ...review,
        customer_name: "Customer", // fallback name since auth profiles are private
    })) as ProductReview[];
}

/**
 * Add a review for a product.
 */
export async function addProductReview(
    productId: string,
    customerId: string,
    rating: number,
    reviewText: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from("product_reviews")
        .insert({
            product_id: productId,
            customer_id: customerId,
            rating,
            review_text: reviewText || null,
        });

    if (error) {
        console.error("Error adding review:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Get average rating and total review count for a product.
 */
export async function getProductRatingStats(
    productId: string
): Promise<{ average: number; count: number }> {
    const { data, error } = await supabase
        .from("product_reviews")
        .select("rating")
        .eq("product_id", productId);

    if (error || !data || data.length === 0) return { average: 0, count: 0 };

    const total = data.reduce((sum, item) => sum + item.rating, 0);
    const average = parseFloat((total / data.length).toFixed(1));

    return { average, count: data.length };
}
