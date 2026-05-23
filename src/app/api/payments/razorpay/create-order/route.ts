import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    // 1. Fetch order details from database
    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Database error fetching order:", orderError);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Order is not in pending status" },
        { status: 400 }
      );
    }

    // 2. Initialize Razorpay
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials are missing in env");
      return NextResponse.json(
        { error: "Payment gateway credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Amount must be in the smallest currency unit (paise for INR). E.g. ₹100 = 10000 paise.
    const amountInPaise = Math.round(parseFloat(order.total_amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: order.id,
      notes: {
        orderId: order.id,
        customerId: order.customer_id,
        shopkeeperId: order.shopkeeper_id,
      },
    };

    // 3. Create order with Razorpay
    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error("Failed to create order via Razorpay SDK");
    }

    // 4. Update the order record in database with the Razorpay order ID
    const { error: updateError } = await supabaseServer
      .from("orders")
      .update({
        razorpay_order_id: razorpayOrder.id,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Error updating order with razorpay_order_id:", updateError);
      return NextResponse.json(
        { error: "Failed to link payment gateway order" },
        { status: 500 }
      );
    }

    // 5. Return order details to frontend
    return NextResponse.json({
      success: true,
      keyId,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });

  } catch (error: any) {
    console.error("Razorpay create-order route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during order creation" },
      { status: 500 }
    );
  }
}
