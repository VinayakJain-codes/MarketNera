import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await request.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "razorpay_payment_id, razorpay_order_id, and razorpay_signature are required" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

    if (!keySecret) {
      console.error("Razorpay secret key is missing in env");
      return NextResponse.json(
        { error: "Payment verification credentials are not configured on the server." },
        { status: 500 }
      );
    }

    // 1. Signature Verification via HMAC SHA256
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error("Razorpay signature verification failed!");
      
      // Attempt to mark order payment as failed
      await supabaseServer
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("razorpay_order_id", razorpay_order_id);

      return NextResponse.json(
        { success: false, isComplete: false, error: "Signature verification failed" },
        { status: 400 }
      );
    }

    // 2. Fetch Order from Supabase
    const { data: dbOrder, error: orderFetchError } = await supabaseServer
      .from("orders")
      .select("id, total_amount, payment_status, status")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (orderFetchError || !dbOrder) {
      console.error("Database order not found for razorpay_order_id:", razorpay_order_id);
      return NextResponse.json(
        { error: "Order not found in database" },
        { status: 404 }
      );
    }

    // 3. Verify with Razorpay API whether the payment is completed (status === 'captured')
    if (keyId) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (!payment) {
          throw new Error("Unable to retrieve payment entity from Razorpay");
        }

        // Verify linked order ID
        if (payment.order_id && payment.order_id !== razorpay_order_id) {
          console.error("Order ID mismatch:", payment.order_id, razorpay_order_id);
          return NextResponse.json(
            { success: false, isComplete: false, error: "Payment does not belong to this order" },
            { status: 400 }
          );
        }

        // If payment is authorized but not captured, capture it
        if (payment.status === "authorized") {
          console.log(`Payment ${razorpay_payment_id} is authorized. Capturing now...`);
          try {
            await razorpay.payments.capture(
              razorpay_payment_id,
              payment.amount,
              payment.currency || "INR"
            );
          } catch (capErr) {
            console.warn("Failed to capture authorized payment:", capErr);
          }
        }

        // Check if payment is completed
        const isComplete = payment.status === "captured" || payment.status === "authorized";
        if (!isComplete) {
          console.error(`Razorpay payment status is ${payment.status}, not complete.`);
          await supabaseServer
            .from("orders")
            .update({ payment_status: "failed" })
            .eq("id", dbOrder.id);

          return NextResponse.json(
            {
              success: false,
              isComplete: false,
              error: `Payment is not complete. Status: ${payment.status}`,
              paymentStatus: payment.status,
            },
            { status: 400 }
          );
        }

        // Check that payment amount matches expected order total
        const expectedPaise = Math.round(parseFloat(dbOrder.total_amount) * 100);
        if (Number(payment.amount) < expectedPaise) {
          console.error(`Paid amount (${payment.amount}) is less than expected (${expectedPaise})`);
          return NextResponse.json(
            { success: false, isComplete: false, error: "Paid amount does not match order total" },
            { status: 400 }
          );
        }
      } catch (rzpErr: any) {
        console.warn("Razorpay API check warning:", rzpErr?.message || rzpErr);
      }
    }

    // 4. Update order in database to paid
    const { data: updatedOrder, error: updateError } = await supabaseServer
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq("id", dbOrder.id)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error("Error updating order upon payment success:", updateError);
      return NextResponse.json(
        { error: "Payment verified but database update failed" },
        { status: 500 }
      );
    }

    // 5. Return success with completion confirmation
    return NextResponse.json({
      success: true,
      isComplete: true,
      paymentStatus: "paid",
      order: updatedOrder,
    });

  } catch (error: any) {
    console.error("Razorpay verify-payment route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during payment verification" },
      { status: 500 }
    );
  }
}

