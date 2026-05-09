import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

export type OrderStatus =
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    id: string;
    customer_id: string;
    shopkeeper_id: string;
    status: OrderStatus;
    total_amount: number;
    delivery_address: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[];
}

export interface PlaceOrderPayload {
    customerId: string;
    shopkeeperId: string;
    items: { productId: string; productName: string; unitPrice: number; quantity: number }[];
    totalAmount: number;
    deliveryAddress?: string;
    notes?: string;
}

// ── Status helpers ─────────────────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pending",
    accepted: "Accepted",
    preparing: "Preparing",
    ready: "Ready for pickup",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    preparing: "bg-orange-100 text-orange-700",
    ready: "bg-green-100 text-green-700",
    delivered: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-100 text-red-600",
};

// Status flow order (for display / progress indicator)
export const ORDER_STATUS_FLOW: OrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "delivered",
];

// ── Customer API ───────────────────────────────────────────────────────────

/**
 * Place a new order from the customer's cart.
 * Creates the order + all order_items in a single transaction-like sequence.
 */
export async function placeOrder(
    payload: PlaceOrderPayload
): Promise<{ order: Order | null; error?: string }> {
    // 1. Create the order record
    const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
            customer_id: payload.customerId,
            shopkeeper_id: payload.shopkeeperId,
            status: "pending",
            total_amount: payload.totalAmount,
            delivery_address: payload.deliveryAddress ?? null,
            notes: payload.notes ?? null,
        })
        .select()
        .single();

    if (orderErr || !order) {
        console.error("Error placing order:", orderErr);
        return { order: null, error: orderErr?.message ?? "Failed to create order" };
    }

    // 2. Insert all order items
    const itemRows = payload.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        unit_price: item.unitPrice,
        quantity: item.quantity,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
    if (itemsErr) {
        console.error("Error inserting order items:", itemsErr);
        // Order exists but items failed — partial state, surface the error
        return { order: order as Order, error: "Order created but items failed: " + itemsErr.message };
    }

    return { order: order as Order };
}

/**
 * Fetch all orders for a customer, newest first, with their items.
 */
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (*)
        `)
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching customer orders:", error);
        return [];
    }
    return (data ?? []) as Order[];
}

// ── Shopkeeper API ─────────────────────────────────────────────────────────

/**
 * Fetch all orders for a shopkeeper, newest first.
 * Optionally filter by status.
 */
export async function getShopkeeperOrders(
    shopkeeperId: string,
    status?: OrderStatus
): Promise<Order[]> {
    let query = supabase
        .from("orders")
        .select(`*, order_items (*)`)
        .eq("shopkeeper_id", shopkeeperId)
        .order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching shopkeeper orders:", error);
        return [];
    }
    return (data ?? []) as Order[];
}

/**
 * Advance an order to the next status in the flow.
 * Only shopkeepers should call this.
 */
export async function updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Customer: cancel a pending order.
 */
export async function cancelOrder(
    orderId: string,
    customerId: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("customer_id", customerId)
        .in("status", ["pending"]); // can only cancel pending orders

    if (error) {
        console.error("Error cancelling order:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Get the count of active (non-delivered, non-cancelled) orders for a shopkeeper.
 * Used for dashboard badge.
 */
export async function getActiveOrderCount(shopkeeperId: string): Promise<number> {
    const { count, error } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("shopkeeper_id", shopkeeperId)
        .in("status", ["pending", "accepted", "preparing", "ready"]);

    if (error) return 0;
    return count ?? 0;
}
