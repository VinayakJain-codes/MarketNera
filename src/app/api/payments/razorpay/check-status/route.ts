import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, razorpayOrderId } = body;

    if (!orderId && !razorpayOrderId) {
      return NextResponse.json(
        { error: "orderId or razorpayOrderId is required" },
        { status: 400 }
      );
    }

    // 1. Fetch order from Supabase
    let query = supabaseServer.from("orders").select("*");
    if (orderId) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("razorpay_order_id", razorpayOrderId);
    }

    const { data: order, error: orderErr } = await query.single();
    if (orderErr || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. If already marked paid in DB, return immediate success
    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        isComplete: true,
        paymentStatus: "paid",
        order,
      });
    }

    // 3. Query Razorpay API directly using SDK if razorpay_order_id exists
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && order.razorpay_order_id) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const paymentsRes = await razorpay.orders.fetchPayments(order.razorpay_order_id);
        const items = paymentsRes?.items || [];

        const captured = items.find((p: any) => p.status === "captured");
        const authorized = items.find((p: any) => p.status === "authorized");
        const targetPayment = captured || authorized;

        if (targetPayment) {

          if (authorized && !captured) {
            try {
              await razorpay.payments.capture(
                authorized.id,
                authorized.amount,
                authorized.currency || "INR"
              );
            } catch (capErr) {
              console.warn("Failed to capture authorized payment:", capErr);
            }
          }

          // Update database order to paid
          const { data: updatedOrder, error: updateErr } = await supabaseServer
            .from("orders")
            .update({
              payment_status: "paid",
              razorpay_payment_id: targetPayment.id,
            })
            .eq("id", order.id)
            .select()
            .single();

          if (!updateErr && updatedOrder) {
            return NextResponse.json({
              success: true,
              isComplete: true,
              paymentStatus: "paid",
              order: updatedOrder,
            });
          }
        }

        // If all attempted payments have failed
        if (items.length > 0 && items.every((p: any) => p.status === "failed")) {
          await supabaseServer
            .from("orders")
            .update({ payment_status: "failed" })
            .eq("id", order.id);

          return NextResponse.json({
            success: true,
            isComplete: false,
            paymentStatus: "failed",
            order: { ...order, payment_status: "failed" },
          });
        }
      } catch (sdkErr: any) {
        console.warn("Error checking status with Razorpay SDK:", sdkErr?.message || sdkErr);
      }
    }

    return NextResponse.json({
      success: true,
      isComplete: false,
      paymentStatus: order.payment_status || "pending",
      order,
    });
  } catch (error: any) {
    console.error("Check payment status error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const razorpayOrderId = searchParams.get("razorpayOrderId");

  return POST(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, razorpayOrderId }),
    })
  );
}
