import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return NextResponse.json(
                { error: "orderId query parameter is required" },
                { status: 400 }
            );
        }

        const { data: order, error } = await supabaseServer
            .from("orders")
            .select(`
                id,
                status,
                total_amount,
                delivery_address,
                notes,
                payment_method,
                payment_status,
                created_at,
                shopkeeper_id,
                order_items (
                    id,
                    product_id,
                    product_name,
                    unit_price,
                    quantity,
                    subtotal
                )
            `)
            .eq("id", orderId)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // Fetch shop details
        let shopName = "Local Merchant Store";
        if (order.shopkeeper_id) {
            const { data: shop } = await supabaseServer
                .from("shopkeeper")
                .select("shop_name, phone, address")
                .eq("user_id", order.shopkeeper_id)
                .single();

            if (shop?.shop_name) {
                shopName = shop.shop_name;
            }
        }

        return NextResponse.json(
            {
                success: true,
                order: {
                    ...order,
                    shop_name: shopName,
                },
            },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error fetching order summary:", err);
        return NextResponse.json(
            { error: "Failed to fetch order details" },
            { status: 500 }
        );
    }
}
