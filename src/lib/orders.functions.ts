import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { MAX_QTY, MIN_QTY, UNIT_PRICE_NGN, shippingFor, totalFor } from "./pricing";

const orderSchema = z.object({
  buyerName: z.string().trim().min(2).max(120),
  buyerPhone: z
    .string()
    .trim()
    .regex(/^(\+?234|0)[0-9]{10}$/, "Enter a valid Nigerian phone number"),
  quantity: z.number().int().min(MIN_QTY).max(MAX_QTY),
  addressLine: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().min(2).max(120),
  landmark: z.string().trim().max(200).optional().or(z.literal("")),
  deliveryNote: z.string().trim().max(500).optional().or(z.literal("")),
  couponCode: z.string().trim().max(40).optional().or(z.literal("")),
  origin: z.string().trim().url(),
});

function generateReference(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = [...bytes].map((b) => b.toString(36).toUpperCase().padStart(2, "0")).join("");
  return `LT-${new Date().getFullYear()}-${suffix.slice(0, 6)}`;
}

export const submitOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data, context }) => {
    const email = String(context.claims['email'] ?? "").toLowerCase();
    if (!email) throw new Error("Your account has no verified email address.");

    const { data: order, error } = await context.supabase
      .from("orders")
      .insert({
        reference: generateReference(),
        user_id: context.userId,
        buyer_name: data.buyerName,
        buyer_email: email,
        buyer_phone: data.buyerPhone,
        quantity: data.quantity,
        unit_price_ngn: UNIT_PRICE_NGN,
        shipping_fee_ngn: shippingFor(data.quantity),
        total_ngn: totalFor(data.quantity),
        address_line: data.addressLine,
        city: data.city,
        state: data.state,
        landmark: data.landmark || null,
        delivery_note: data.deliveryNote || null,
        coupon_code: data.couponCode ? data.couponCode.toUpperCase() : null,
        email_verified: true,
      })
      .select("reference, quantity, total_ngn, buyer_email")
      .single();

    if (error || !order) throw new Error("We could not place your order. Please try again.");

    const { initializeTransaction } = await import("./paystack.server");
    const origin = new URL(data.origin).origin;
    const checkout = await initializeTransaction({
      email,
      amountNgn: order.total_ngn,
      reference: order.reference,
      callbackUrl: `${origin}/order/${order.reference}`,
      metadata: { order_reference: order.reference, buyer_name: data.buyerName, quantity: data.quantity },
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("orders")
      .update({ payment_reference: checkout.reference })
      .eq("reference", order.reference);

    return { ...order, authorizationUrl: checkout.authorization_url };
  });

/** Confirms a Paystack transaction with Paystack and records the result on the order. */
export const confirmOrderPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ reference: z.string().trim().max(40) }).parse(data))
  .handler(async ({ data, context }) => {
    const reference = data.reference.toUpperCase();
    const { data: order } = await context.supabase
      .from("orders")
      .select("reference, total_ngn, payment_status")
      .eq("reference", reference)
      .maybeSingle();
    if (!order) return { paymentStatus: "unknown" as const };
    if (order.payment_status === "paid") return { paymentStatus: "paid" as const };

    try {
      const { verifyTransaction } = await import("./paystack.server");
      const tx = await verifyTransaction(reference);
      const paid = tx.status === "success" && tx.amount >= order.total_ngn * 100;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: paid ? "paid" : tx.status,
          payment_channel: tx.channel,
          amount_paid_ngn: Math.round(tx.amount / 100),
          paid_at: paid ? (tx.paid_at ?? new Date().toISOString()) : null,
        })
        .eq("reference", reference);
      return { paymentStatus: paid ? ("paid" as const) : ("failed" as const) };
    } catch {
      return { paymentStatus: order.payment_status as string };
    }
  });

export const getOrderByReference = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ reference: z.string().trim().max(40) }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase
      .from("orders")
      .select(
        "reference, buyer_name, buyer_email, quantity, unit_price_ngn, shipping_fee_ngn, total_ngn, city, state, status, payment_status, payment_channel, coupon_code, created_at",
      )
      .eq("reference", data.reference.toUpperCase())
      .maybeSingle();
    return order ?? null;
  });
