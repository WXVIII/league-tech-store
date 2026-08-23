import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { paystackSecretKey } = await import("@/lib/paystack.server");
        const body = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = createHmac("sha512", paystackSecretKey()).update(body).digest("hex");
        const sig = Buffer.from(signature);
        const exp = Buffer.from(expected);
        if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body) as {
          event?: string;
          data?: {
            reference?: string;
            status?: string;
            amount?: number;
            channel?: string | null;
            paid_at?: string | null;
          };
        };

        const reference = event.data?.reference;
        if (!reference) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        if (event.event === "charge.success" && event.data?.status === "success") {
          await supabaseAdmin
            .from("orders")
            .update({
              payment_status: "paid",
              payment_channel: event.data.channel ?? null,
              amount_paid_ngn: Math.round((event.data.amount ?? 0) / 100),
              paid_at: event.data.paid_at ?? new Date().toISOString(),
            })
            .eq("reference", reference.toUpperCase());
        } else if (event.event === "charge.failed") {
          await supabaseAdmin
            .from("orders")
            .update({ payment_status: "failed" })
            .eq("reference", reference.toUpperCase());
        }

        return new Response("ok");
      },
    },
  },
});
