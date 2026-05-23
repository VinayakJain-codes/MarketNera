import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured on the server");
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    // 1. Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Parse payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    
    if (!paymentEntity) {
      return NextResponse.json({ error: "Invalid payload data" }, { status: 400 });
    }

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;

    if (!razorpayOrderId) {
      // Direct payments not linked to an order
      console.log("No linked razorpayOrderId found in webhook entity:", razorpayPaymentId);
      return NextResponse.json({ success: true, message: "Ignored direct payment" });
    }

    console.log(`Processing webhook event ${event} for order ${razorpayOrderId}`);

    // 3. Handle Webhook Events
    if (event === "payment.captured" || event === "order.paid") {
      // Update order status to paid and accepted in Supabase
      const { data, error } = await supabaseServer
        .from("orders")
        .update({
          payment_status: "paid",
          status: "accepted",
          razorpay_payment_id: razorpayPaymentId,
        })
        .eq("razorpay_order_id", razorpayOrderId);

      if (error) {
        console.error("Error updating order via webhook payment.captured:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      console.log(`Order ${razorpayOrderId} marked as PAID via webhook`);
    } 
    else if (event === "payment.failed") {
      // Mark payment status as failed in Supabase
      const { error } = await supabaseServer
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("razorpay_order_id", razorpayOrderId);

      if (error) {
        console.error("Error updating order via webhook payment.failed:", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      console.log(`Order ${razorpayOrderId} marked as FAILED via webhook`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Razorpay webhook route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during webhook" },
      { status: 500 }
    );
  }
}
