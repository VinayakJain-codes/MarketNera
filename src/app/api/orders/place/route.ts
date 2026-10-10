import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface OrderItemPayload {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
}

interface PlaceOrderRequestBody {
    shopkeeperId: string;
    items: OrderItemPayload[];
    totalAmount: number;
    deliveryAddress: string;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
    paymentMethod?: "cod" | "razorpay";
}

export async function POST(request: Request) {
    try {
        const body: PlaceOrderRequestBody = await request.json();
        const {
            shopkeeperId,
            items,
            totalAmount,
            deliveryAddress,
            customerName,
            customerPhone,
            notes,
            paymentMethod = "cod",
        } = body;

        // 1. Validate items and shopkeeper
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty. Please add items to checkout." },
                { status: 400 }
            );
        }

        if (!shopkeeperId) {
            return NextResponse.json(
                { error: "Invalid merchant store information." },
                { status: 400 }
            );
        }

        if (!deliveryAddress || !deliveryAddress.trim()) {
            return NextResponse.json(
                { error: "Delivery address is required." },
                { status: 400 }
            );
        }

        // 2. Resolve Customer ID (Logged-in vs Guest)
        const cookieStore = await cookies();
        const supabaseAuthClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll() {},
                },
            }
        );

        let customerId: string | null = null;
        let isGuestOrder = false;

        const {
            data: { user },
        } = await supabaseAuthClient.auth.getUser();

        if (user) {
            customerId = user.id;
        } else {
            // Guest Checkout Flow
            isGuestOrder = true;
            if (!customerPhone || customerPhone.trim().length < 10) {
                return NextResponse.json(
                    { error: "Valid 10-digit mobile number is required for guest delivery." },
                    { status: 400 }
                );
            }

            if (!customerName || !customerName.trim()) {
                return NextResponse.json(
                    { error: "Customer name is required for guest checkout." },
                    { status: 400 }
                );
            }

            const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
            const guestEmail = `guest_${cleanPhone}_${Date.now()}@marketnera.guest`;

            const { data: guestAuthUser, error: guestUserError } =
                await supabaseServer.auth.admin.createUser({
                    email: guestEmail,
                    email_confirm: true,
                    user_metadata: {
                        role: "customer",
                        full_name: customerName.trim(),
                        phone: cleanPhone,
                        is_guest: true,
                    },
                });

            if (guestUserError || !guestAuthUser?.user) {
                console.error("Failed to provision guest customer:", guestUserError);
                return NextResponse.json(
                    { error: "Failed to initialize guest checkout. Please try again." },
                    { status: 500 }
                );
            }

            customerId = guestAuthUser.user.id;
        }

        // 3. Format address with guest phone & name if guest
        let formattedAddress = deliveryAddress.trim();
        if (isGuestOrder && customerPhone) {
            formattedAddress = `${customerName?.trim()} (${customerPhone}) - ${formattedAddress}`;
        }

        // 4. Place order atomically using Supabase RPC
        const { data: rpcResult, error: rpcError } = await supabaseServer.rpc(
            "place_order_atomic",
            {
                p_customer_id: customerId,
                p_shopkeeper_id: shopkeeperId,
                p_total_amount: Number(totalAmount),
                p_delivery_address: formattedAddress,
                p_notes: notes?.trim() || (isGuestOrder ? "Guest Checkout" : null),
                p_payment_method: paymentMethod,
                p_payment_status: "pending",
                p_razorpay_order_id: null,
                p_items: items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    unitPrice: Number(item.unitPrice),
                    quantity: Number(item.quantity),
                })),
            }
        );

        if (rpcError || !rpcResult?.order_id) {
            console.error("Database order placement error:", rpcError);
            return NextResponse.json(
                { error: rpcError?.message || "Failed to save order to database." },
                { status: 500 }
            );
        }

        // 5. Fetch full created order details
        const { data: createdOrder, error: orderFetchError } = await supabaseServer
            .from("orders")
            .select(`
                *,
                order_items (*)
            `)
            .eq("id", rpcResult.order_id)
            .single();

        if (orderFetchError || !createdOrder) {
            console.error("Error retrieving placed order:", orderFetchError);
            return NextResponse.json(
                {
                    success: true,
                    orderId: rpcResult.order_id,
                    message: "Order placed successfully.",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                order: createdOrder,
                isGuestOrder,
            },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Unhandled error in /api/orders/place:", err);
        return NextResponse.json(
            { error: err?.message || "Internal server error occurred while placing order." },
            { status: 500 }
        );
    }
}
