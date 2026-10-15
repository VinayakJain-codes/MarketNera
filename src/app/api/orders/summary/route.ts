import { NextResponse } from "next/server";
import Razorpay from "razorpay";
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
                razorpay_order_id,
                razorpay_payment_id,
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

        // If payment is pending and razorpay_order_id exists, verify live status with Razorpay
        if (order.payment_status === "pending" && order.razorpay_order_id) {
            const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
            const keySecret = process.env.RAZORPAY_KEY_SECRET;

            if (keyId && keySecret) {
                try {
                    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
                    const paymentsRes = await razorpay.orders.fetchPayments(order.razorpay_order_id);
                    const items = paymentsRes?.items || [];
                    const captured = items.find((p: any) => p.status === "captured" || p.status === "authorized");

                    if (captured) {
                        if (captured.status === "authorized") {
                            try {
                                await razorpay.payments.capture(captured.id, captured.amount, captured.currency || "INR");
                            } catch {}
                        }

                        await supabaseServer
                            .from("orders")
                            .update({
                                payment_status: "paid",
                                razorpay_payment_id: captured.id,
                            })
                            .eq("id", order.id);

                        order.payment_status = "paid";
                        order.razorpay_payment_id = captured.id;
                    } else if (items.length > 0 && items.every((p: any) => p.status === "failed")) {
                        await supabaseServer
                            .from("orders")
                            .update({ payment_status: "failed" })
                            .eq("id", order.id);
                        order.payment_status = "failed";
                    }
                } catch (rzpErr) {
                    console.warn("Could not check live payment status in summary:", rzpErr);
                }
            }
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
                is_payment_complete: order.payment_status === "paid",
                order: {
                    ...order,
                    shop_name: shopName,
                    is_payment_complete: order.payment_status === "paid",
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

