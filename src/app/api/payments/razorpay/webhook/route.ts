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
    const orderEntity = payload.payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id || null;

    if (!razorpayOrderId) {
      console.log("No linked razorpayOrderId found in webhook entity:", event);
      return NextResponse.json({ success: true, message: "Ignored event without order ID" });
    }

    console.log(`Processing webhook event ${event} for order ${razorpayOrderId}`);

    // 3. Handle Webhook Events - Check payment completion
    if (event === "payment.captured" || event === "order.paid") {
      // Check that payment status is captured if entity is provided
      if (paymentEntity && paymentEntity.status && paymentEntity.status !== "captured") {
        console.warn(`Payment ${paymentEntity.id} has status ${paymentEntity.status}, not captured.`);
        return NextResponse.json({ success: true, message: "Payment not captured yet" });
      }

      // Update order payment status to paid in Supabase
      const updateData: Record<string, any> = {
        payment_status: "paid",
      };
      if (razorpayPaymentId) {
        updateData.razorpay_payment_id = razorpayPaymentId;
      }

      const { data, error } = await supabaseServer
        .from("orders")
        .update(updateData)
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
