/** Paystack REST helpers. Server-only: never import from client components. */

const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackSecretKey(): string {
  const key = process.env["PAYSTACK_SECRET_KEY"] ?? process.env["STRIPE_LIVE_API_KEY"];
  if (!key) throw new Error("Payment is not configured yet. Please try again shortly.");
  return key;
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${paystackSecretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => null)) as
    | { status?: boolean; message?: string; data?: unknown }
    | null;
  if (!res.ok || !body?.status) {
    throw new Error(body?.message || "Paystack request failed. Please try again.");
  }
  return body.data as T;
}

export type PaystackInit = { authorization_url: string; access_code: string; reference: string };

export function initializeTransaction(input: {
  email: string;
  amountNgn: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  return paystackFetch<PaystackInit>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amountNgn * 100), // kobo
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata ?? {},
    }),
  });
}

export type PaystackVerify = {
  status: string;
  reference: string;
  amount: number;
  channel: string | null;
  paid_at: string | null;
  currency: string;
};

export function verifyTransaction(reference: string) {
  return paystackFetch<PaystackVerify>(`/transaction/verify/${encodeURIComponent(reference)}`);
}
