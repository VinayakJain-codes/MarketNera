import { supabase } from "@/lib/supabase";

export interface LiveCatalogProduct {
    id: string;
    shop_id: string;
    name: string;
    description: string | null;
    category: string;
    sub_category: string | null;
    price: number;
    sale_price: number | null;
    stock_quantity: number;
    unit_type: string;
    sku: string | null;
    is_published: boolean;
    is_featured: boolean;
    media_url: string | null;
    shop_name: string;
    shop_address: string;
    shop_phone?: string;
    delivery_time_minutes: number;
    created_at: string;
}

export interface LiveCategorySummary {
    name: string;
    slug: string;
    count: number;
}

export interface LiveShopSummary {
    id: string;
    name: string;
    category: string;
    address: string;
    phone: string;
    banner_url: string | null;
    tagline: string | null;
    is_open: boolean;
    delivery_time_minutes: number;
    product_count: number;
}

/**
 * Fetches published products from Supabase with media and merchant store info.
 */
export async function getLiveCatalogProducts(options?: {
    category?: string | null;
    search?: string | null;
    shopId?: string | null;
    limit?: number;
}): Promise<LiveCatalogProduct[]> {
    try {
        let query = supabase
            .from("shopkeeper_products")
            .select(`
                *,
                product_media (id, media_url, is_primary, sort_order)
            `)
            .eq("is_published", true)
            .order("created_at", { ascending: false });

        if (options?.category && options.category !== "All") {
            query = query.ilike("category", `%${options.category}%`);
        }

        if (options?.shopId) {
            query = query.eq("shop_id", options.shopId);
        }

        if (options?.search && options.search.trim()) {
            const s = options.search.trim();
            query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%,category.ilike.%${s}%`);
        }

        if (options?.limit) {
            query = query.limit(options.limit);
        }

        const { data: products, error: prodError } = await query;

        if (prodError) {
            console.error("Error fetching live products:", prodError);
            return [];
        }

        if (!products || products.length === 0) {
            // Also check if any products exist regardless of is_published for dev convenience
            let fallbackQuery = supabase
                .from("shopkeeper_products")
                .select("*, product_media (id, media_url, is_primary, sort_order)")
                .limit(options?.limit || 50);

            if (options?.shopId) {
                fallbackQuery = fallbackQuery.eq("shop_id", options.shopId);
            }

            const { data: allProds } = await fallbackQuery;
            if (!allProds || allProds.length === 0) return [];

            return await attachShopInfoToProducts(allProds);
        }

        return await attachShopInfoToProducts(products);
    } catch (err) {
        console.error("Failed to query catalog products:", err);
        return [];
    }
}

/**
 * Attaches merchant store information to each product row.
 */
async function attachShopInfoToProducts(rawProducts: any[]): Promise<LiveCatalogProduct[]> {
    const shopIds = [...new Set(rawProducts.map((p) => p.shop_id).filter(Boolean))];

    let shopMap: Record<string, any> = {};
    if (shopIds.length > 0) {
        const { data: shops } = await supabase
            .from("shopkeeper")
            .select("user_id, shop_name, address, phone, delivery_time_minutes")
            .in("user_id", shopIds);

        if (shops) {
            shops.forEach((s) => {
                shopMap[s.user_id] = s;
            });
        }
    }

    return rawProducts.map((p) => {
        const mediaList = p.product_media || [];
        const primaryMedia =
            mediaList.find((m: any) => m.is_primary)?.media_url ||
            mediaList[0]?.media_url ||
            null;

        const shop = shopMap[p.shop_id];

        // Format clean address without raw internal delimiters
        let cleanAddress = shop?.address || "Meerut Local Store";
        if (cleanAddress.includes("|||")) {
            cleanAddress = cleanAddress.split("|||")[0].trim();
        }

        return {
            id: p.id,
            shop_id: p.shop_id,
            name: p.name,
            description: p.description,
            category: p.category || "General",
            sub_category: p.sub_category,
            price: Number(p.price) || 0,
            sale_price: p.sale_price !== null && p.sale_price !== undefined ? Number(p.sale_price) : null,
            stock_quantity: Number(p.stock_quantity) || 0,
            unit_type: p.unit_type || "item",
            sku: p.sku,
            is_published: Boolean(p.is_published),
            is_featured: Boolean(p.is_featured),
            media_url: primaryMedia,
            shop_name: shop?.shop_name || "Local Verified Merchant",
            shop_address: cleanAddress,
            shop_phone: shop?.phone,
            delivery_time_minutes: shop?.delivery_time_minutes || 25,
            created_at: p.created_at,
        };
    });
}

/**
 * Computes live category summaries directly from product counts in Supabase.
 */
export async function getLiveCategories(): Promise<LiveCategorySummary[]> {
    try {
        const { data, error } = await supabase
            .from("shopkeeper_products")
            .select("category");

        if (error || !data) {
            console.error("Error fetching categories:", error);
            return [];
        }

        const counts: Record<string, number> = {};
        data.forEach((row) => {
            const cat = row.category?.trim() || "General";
            counts[cat] = (counts[cat] || 0) + 1;
        });

        return Object.entries(counts).map(([name, count]) => ({
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            count,
        }));
    } catch (err) {
        console.error("Failed to compute live categories:", err);
        return [];
    }
}

/**
 * Fetches all registered neighborhood shops from Supabase.
 */
export async function getLiveShops(): Promise<LiveShopSummary[]> {
    try {
        const { data: shops, error: sErr } = await supabase
            .from("shopkeeper")
            .select("user_id, shop_name, category, address, phone, banner_url, tagline, is_open, delivery_time_minutes");

        if (sErr || !shops) {
            console.error("Error fetching shops:", sErr);
            return [];
        }

        // Count products per shop
        const { data: prods } = await supabase
            .from("shopkeeper_products")
            .select("shop_id");

        const productCounts: Record<string, number> = {};
        prods?.forEach((p) => {
            productCounts[p.shop_id] = (productCounts[p.shop_id] || 0) + 1;
        });

        return shops.map((s) => {
            let cleanAddress = s.address || "Meerut, UP";
            if (cleanAddress.includes("|||")) {
                cleanAddress = cleanAddress.split("|||")[0].trim();
            }

            return {
                id: s.user_id,
                name: s.shop_name,
                category: s.category || "General Store",
                address: cleanAddress,
                phone: s.phone,
                banner_url: s.banner_url || null,
                tagline: s.tagline || null,
                is_open: s.is_open !== false,
                delivery_time_minutes: s.delivery_time_minutes || 30,
                product_count: productCounts[s.user_id] || 0,
            };
        });
    } catch (err) {
        console.error("Failed to fetch live shops:", err);
        return [];
    }
}
