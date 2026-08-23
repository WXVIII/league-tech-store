import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, Mail, PackageCheck, Phone } from "lucide-react";

import { LeagueTechLogo } from "@/components/LeagueTechLogo";
import { Button } from "@/components/ui/button";
import { confirmOrderPayment, getOrderByReference } from "@/lib/orders.functions";
import { naira } from "@/lib/pricing";

export const Route = createFileRoute("/order/$reference")({
  ssr: false,
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.reference} confirmed — LeagueTech` },
      {
        name: "description",
        content: "Your Mesh Tag order is confirmed. Track your order reference and delivery details.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order confirmed — LeagueTech" },
      { property: "og:description", content: "Your Mesh Tag order has been received." },
    ],
  }),
  errorComponent: OrderError,
  notFoundComponent: OrderError,
  component: OrderConfirmation,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-hero-navy min-h-screen px-4 py-10 text-surface-foreground">
      <div className="mx-auto w-full max-w-lg">
        <Link to="/" className="mb-8 inline-block">
          <LeagueTechLogo tone="light" />
        </Link>
        {children}
      </div>
    </main>
  );
}

function OrderError() {
  return (
    <Shell>
      <div className="rounded-3xl bg-card p-6 text-card-foreground">
        <h1 className="text-xl font-semibold">We couldn't load that order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It may belong to a different account, or your sign-in session has expired. Sign in again
          with the email you used at checkout to view it.
        </p>
        <Button asChild className="mt-5 w-full">
          <Link to="/">Back to store</Link>
        </Button>
      </div>
    </Shell>
  );
}

function OrderConfirmation() {
  const { reference } = Route.useParams();
  const fetchOrder = useServerFn(getOrderByReference);
  const confirmPayment = useServerFn(confirmOrderPayment);
  const { data: order, isPending, isError } = useQuery({
    queryKey: ["order", reference],
    queryFn: async () => {
      await confirmPayment({ data: { reference } }).catch(() => null);
      return fetchOrder({ data: { reference } });
    },
    retry: false,
  });

  if (isPending) {
    return (
      <Shell>
        <div className="flex items-center gap-3 rounded-3xl bg-card p-6 text-card-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your order…</p>
        </div>
      </Shell>
    );
  }

  if (isError || !order) return <OrderError />;

  const paid = order.payment_status === "paid";

  return (
    <Shell>
      <div className="overflow-hidden rounded-3xl bg-card text-card-foreground shadow-2xl">
        <div className="flex flex-col items-center gap-3 border-b border-border px-6 py-8 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-success/15 text-success">
            {paid ? <CheckCircle2 className="size-8" /> : <Clock className="size-8" />}
          </span>
          <h1 className="text-2xl font-semibold">
            {paid ? "Payment confirmed" : "Awaiting payment"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {paid
              ? `Thank you, ${order.buyer_name.split(" ")[0]}. Your Mesh Tag order is paid and queued for dispatch.`
              : `Thanks, ${order.buyer_name.split(" ")[0]}. We have your order — it moves to dispatch as soon as payment is confirmed.`}
          </p>
          <div className="mt-2 w-full rounded-2xl bg-secondary px-4 py-3">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Order reference</p>
            <p className="font-display text-xl font-semibold">{order.reference}</p>
          </div>
        </div>

        <dl className="divide-y divide-border px-6 text-sm">
          <Row label="Mesh Tag" value={`${order.quantity} × ${naira(order.unit_price_ngn)}`} />
          <Row
            label="Delivery"
            value={order.shipping_fee_ngn === 0 ? "Free" : naira(order.shipping_fee_ngn)}
          />
          <Row label="Deliver to" value={`${order.city}, ${order.state}`} />
          <Row
            label="Payment"
            value={
              paid
                ? `Paid${order.payment_channel ? ` · ${order.payment_channel}` : ""}`
                : "Not yet confirmed"
            }
          />
          {order.coupon_code ? <Row label="Coupon" value={order.coupon_code} /> : null}
          <Row label="Status" value={order.status === "pending" ? "Awaiting dispatch" : order.status} />
          <div className="flex items-center justify-between py-4">
            <dt className="font-medium">Total</dt>
            <dd className="font-display text-lg font-semibold">{naira(order.total_ngn)}</dd>
          </div>
        </dl>

        <div className="space-y-3 border-t border-border bg-secondary/60 px-6 py-6 text-sm">
          <p className="flex items-start gap-2.5">
            <Mail className="mt-0.5 size-4 shrink-0 text-surface-foreground/70" />
            <span>A summary is on its way to {order.buyer_email}.</span>
          </p>
          <p className="flex items-start gap-2.5">
            <PackageCheck className="mt-0.5 size-4 shrink-0 text-surface-foreground/70" />
            <span>Delivery within 2–5 working days nationwide.</span>
          </p>
          <p className="flex items-start gap-2.5">
            <Phone className="mt-0.5 size-4 shrink-0 text-surface-foreground/70" />
            <span>Our team will call to confirm your address before dispatch.</span>
          </p>
        </div>

        <div className="px-6 pb-6">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Place another order</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
