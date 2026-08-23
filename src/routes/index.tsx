import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Signal,
  Smartphone,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { LeagueTechLogo } from "@/components/LeagueTechLogo";
import productPhoto from "@/assets/mesh-tag-product.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitOrder } from "@/lib/orders.functions";
import {
  FREE_SHIPPING_MIN_QTY,
  MAX_QTY,
  MIN_QTY,
  NIGERIAN_STATES,
  UNIT_PRICE_NGN,
  naira,
  shippingFor,
  totalFor,
} from "@/lib/pricing";

const APP_URL =
  import.meta.env.VITE_SITE_URL ||
  import.meta.env.VITE_APP_URL ||
  "https://leaguetech.store";
const ORDER_REDIRECT_URL = `${APP_URL.replace(/\/$/, "")}/#order`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mesh Tag + MeshApp — Order in Nigeria | LeagueTech" },
      {
        name: "description",
        content:
          "Order the League Technologies Mesh Tag and pair it with MeshApp. A safety layer for everyday urban life in Nigeria, ₦30,000 per tag, with nationwide delivery.",
      },
      { property: "og:title", content: "Mesh Tag + MeshApp — Order in Nigeria | LeagueTech" },
      {
        property: "og:description",
        content:
          "Your safety layer for everyday urban life. Order your Mesh Tag today with nationwide delivery.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: productPhoto.url },
      { name: "twitter:image", content: productPhoto.url },
    ],
  }),
  component: Storefront,
});

type Step = "details" | "verify" | "shipping";

function Storefront() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <DownloadSection />
      <OrderSection />
      <Faq />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-hero-navy sticky top-0 z-30 border-b border-white/10 text-surface-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <LeagueTechLogo tone="light" />
        <a
          href="#order"
          className="rounded-full bg-surface-foreground px-4 py-2 text-sm font-semibold text-surface transition hover:opacity-90"
        >
          Order now
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-hero-navy text-surface-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-16 md:grid-cols-2 md:items-center md:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
            <Signal className="size-3.5" /> Mesh network powered
          </span>
          <h1 className="mt-5 text-4xl leading-[1.1] font-bold md:text-5xl">
            Mesh Tag is your safety layer for <span className="underline decoration-white/30 underline-offset-8">everyday urban life</span>.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/75">
            A pocket sized tag that silently creates a network around you. Pair it with the
            MeshApp and have a phone-based edge that makes sure you make it home.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#order"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-surface-foreground px-6 font-semibold text-surface transition hover:opacity-90"
            >
              Order for {naira(UNIT_PRICE_NGN)} <ArrowRight className="size-4" />
            </a>
            <a
              href="#how"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 font-medium text-white/90 transition hover:bg-white/10"
            >
              How it works
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4 text-white/70" /> Nationwide delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-white/70" /> Verified email checkout
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 text-white/70" /> 1-year warranty
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-white p-6">
            <img
              src={productPhoto.url}
              alt="Mesh Tag denim key fob tracker shown with the MeshApp live map on two phones"
              className="h-full w-full object-contain"
              width={735}
              height={717}
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl bg-card px-4 py-3 text-card-foreground shadow-xl">
            <p className="text-xs text-muted-foreground">Mesh Tag · Gen 2</p>
            <p className="font-display text-lg font-semibold">{naira(UNIT_PRICE_NGN)} per tag</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Signal,
    title: "Mesh network",
    body: "Every Mesh Tag relays for the next, so your location keeps updating as you go.",
  },
  {
    icon: BatteryCharging,
    title: "24-month battery",
    body: "A sealed, non-replaceable battery that runs for two years.",
  },
  {
    icon: MapPin,
    title: "Built for Nigerian streets",
    body: "Tuned for busy markets, estates and traffic — with landmark-based delivery support.",
  },
];

function Features() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h2 className="text-2xl font-semibold md:text-3xl">Why people buy Mesh Tag</h2>
      <p className="mt-2 max-w-lg text-muted-foreground">
        Hardware and app designed together, so setup takes under two minutes.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/8 text-primary">
              <f.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DownloadSection() {
  return (
    <section className="bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Smartphone className="size-3.5" /> Free companion app
        </span>
        <h2 className="mt-5 text-2xl font-semibold md:text-3xl">Get the MeshApp</h2>
        <p className="mt-2 max-w-lg mx-auto text-muted-foreground">
          Mesh Tag pairs with the MeshApp on your phone to create your personal safety layer.
          Download free for iOS or Android.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://apps.apple.com/us/app/m-e-s-h/id6736515454"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-surface-foreground px-6 font-semibold text-surface transition hover:opacity-90"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.05 12.04c-.03-3.07 2.5-4.55 2.62-4.62-1.43-2.09-3.65-2.38-4.43-2.4-1.88-.2-3.68 1.11-4.64 1.11-.97 0-2.44-1.09-4.02-1.06-2.06.03-3.97 1.21-5.03 3.06-2.15 3.73-.55 9.25 1.54 12.28 1.03 1.49 2.25 3.16 3.85 3.1 1.55-.06 2.13-1 4-1 1.86 0 2.4 1 4.03.97 1.67-.03 2.72-1.51 3.73-3.01 1.18-1.73 1.66-3.41 1.69-3.5-.04-.02-3.24-1.24-3.27-4.93zM14.3 3.9c.85-1.03 1.42-2.46 1.26-3.88-1.22.05-2.7.81-3.58 1.84-.78.91-1.47 2.37-1.29 3.76 1.37.1 2.76-.7 3.61-1.72z"/>
            </svg>
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=rocateer.undrcovr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 font-semibold text-card-foreground transition hover:bg-secondary"
          >
            <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#34A853" d="M3.6 2.3a1 1 0 0 0-.6.9v18.5a1 1 0 0 0 .6.9l10.4-10.4L3.6 2.3z"/>
              <path fill="#FBBC05" d="M14.1 13.4 11.3 10.6 4 17.9l9.9-4.5z"/>
              <path fill="#EA4335" d="M4.2 1.6l9.9 9.9 2.8-2.8L4.9 1.3a1 1 0 0 0-.7.3z"/>
              <path fill="#4285F4" d="M14.1 13.4l2.8 2.8 7.3-4.1c.7-.4.7-1.5 0-1.9l-7.3-4.1-2.8 2.8z"/>
            </svg>
            Google Play
          </a>
        </div>
      </div>
    </section>
  );
}

function OrderSection() {
  return (
    <section id="order" className="bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">Order your Mesh Tag</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Confirm your email and share your delivery address. No card details needed.
          </p>
        </div>
        <OrderFlow />
      </div>
    </section>
  );
}

const DRAFT_KEY = "leaguetech.order.draft";

type Draft = {
  quantity: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  addressLine: string;
  city: string;
  stateName: string;
  landmark: string;
  deliveryNote: string;
  couponCode: string;
};

function OrderFlow() {
  const navigate = useNavigate();
  const placeOrder = useServerFn(submitOrder);

  const [step, setStep] = useState<Step>("details");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [code, setCode] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const shipping = shippingFor(quantity);
  const total = totalFor(quantity);

  // Restore an in-progress order (the customer may leave to open the email link).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<Draft>;
      if (d.quantity) setQuantity(d.quantity);
      if (d.buyerName) setBuyerName(d.buyerName);
      if (d.buyerEmail) setBuyerEmail(d.buyerEmail);
      if (d.buyerPhone) setBuyerPhone(d.buyerPhone);
      if (d.addressLine) setAddressLine(d.addressLine);
      if (d.city) setCity(d.city);
      if (d.stateName) setStateName(d.stateName);
      if (d.landmark) setLandmark(d.landmark);
      if (d.deliveryNote) setDeliveryNote(d.deliveryNote);
      if (d.couponCode) setCouponCode(d.couponCode);
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  useEffect(() => {
    const draft: Draft = {
      quantity,
      buyerName,
      buyerEmail,
      buyerPhone,
      addressLine,
      city,
      stateName,
      landmark,
      deliveryNote,
      couponCode,
    };
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage may be unavailable */
    }
  }, [
    quantity,
    buyerName,
    buyerEmail,
    buyerPhone,
    addressLine,
    city,
    stateName,
    landmark,
    deliveryNote,
    couponCode,
  ]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const email = data.session?.user.email ?? null;
      setAuthEmail(email);
      setAuthReady(true);
      if (email) {
        setBuyerEmail(email);
        setStep((s) => (s === "verify" ? "shipping" : s));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user.email ?? null;
      setAuthEmail(email);
      if (email) {
        setBuyerEmail(email);
        setError(null);
        setStep((s) => (s === "details" ? s : "shipping"));
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const message = (e: unknown) =>
    e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.";

  async function startVerification() {
    setError(null);
    if (buyerName.trim().length < 2) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(buyerEmail.trim()))
      return setError("Please enter a valid email address.");
    if (!/^(\+?234|0)[0-9]{10}$/.test(buyerPhone.trim()))
      return setError("Enter a valid Nigerian phone number, e.g. 08031234567.");

    if (authEmail) {
      setStep("shipping");
      return;
    }

    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: buyerEmail.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: ORDER_REDIRECT_URL,
        },
      });
      if (authError) throw new Error(authError.message);
      setLinkSent(true);
      setCooldown(45);
      setStep("verify");
      toast.success("Sign-in email sent");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    setError(null);
    setGoogleBusy(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: ORDER_REDIRECT_URL,
        },
      });
      if (authError) throw new Error(authError.message);
      toast.success("Signed in with Google");
    } catch (e) {
      setError(message(e));
    } finally {
      setGoogleBusy(false);
    }
  }

  async function confirmCode() {
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) return setError("Enter the 6-digit code from your email.");
    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.verifyOtp({
        email: buyerEmail.trim().toLowerCase(),
        token: code.trim(),
        type: "email",
      });
      if (authError) throw new Error(authError.message);
      setCode("");
      setStep("shipping");
      toast.success("Email confirmed");
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }

  async function useAnotherEmail() {
    setBusy(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setAuthEmail(null);
      setLinkSent(false);
      setCode("");
      setError(null);
      setStep("details");
      setBusy(false);
    }
  }

  async function finishOrder() {
    setError(null);
    if (!authEmail) {
      setStep("details");
      return setError("Please confirm your email address before placing the order.");
    }
    if (addressLine.trim().length < 5) return setError("Please enter your street address.");
    if (city.trim().length < 2) return setError("Please enter your city or town.");
    if (!stateName) return setError("Please select your state.");

    setBusy(true);
    try {
      const order = await placeOrder({
        data: {
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          quantity,
          addressLine: addressLine.trim(),
          city: city.trim(),
          state: stateName,
          landmark: landmark.trim(),
          deliveryNote: deliveryNote.trim(),
          couponCode: couponCode.trim(),
          origin: window.location.origin,
        },
      });
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      if (order.authorizationUrl) {
        window.location.href = order.authorizationUrl;
        return;
      }
      navigate({ to: "/order/$reference", params: { reference: order.reference } });
    } catch (e) {
      setError(message(e));
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
      <Stepper step={step} />

      <div className="space-y-5 px-5 py-6 sm:px-7">
        {step === "details" && (
          <>
            <div>
              <Label className="mb-2 block">Quantity</Label>
              <QuantityPicker value={quantity} onChange={setQuantity} />
              <p className="mt-2 text-xs text-muted-foreground">
                Free delivery on {FREE_SHIPPING_MIN_QTY} tags or more. Max {MAX_QTY} per order.
              </p>
            </div>

            <Field label="Full name" htmlFor="name">
              <Input
                id="name"
                autoComplete="name"
                placeholder="Chinaza Okeke"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
            </Field>
            <Field label="Email address" htmlFor="email">
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={buyerEmail}
                disabled={Boolean(authEmail)}
                onChange={(e) => setBuyerEmail(e.target.value)}
              />
              {authEmail ? (
                <p className="flex flex-wrap items-center gap-1.5 text-xs text-success">
                  <CheckCircle2 className="size-3.5" /> Signed in and confirmed.
                  <button
                    type="button"
                    className="text-muted-foreground underline underline-offset-4"
                    onClick={useAnotherEmail}
                  >
                    Use a different email
                  </button>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  We send a secure one-time code to confirm this address — no password needed.
                </p>
              )}
            </Field>
            <Field label="Phone number" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="08031234567"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
              />
            </Field>

            <Summary quantity={quantity} shipping={shipping} total={total} />
            <ErrorNote error={error} />
            <Button
              size="lg"
              className="w-full"
              disabled={busy || !authReady}
              onClick={startVerification}
            >
              {busy || !authReady ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mail className="size-4" />
              )}
              {busy
                ? "Sending email…"
                : authEmail
                  ? "Continue to delivery"
                  : "Confirm email to continue"}
            </Button>
            {!authEmail && (
              <GoogleOption busy={googleBusy} disabled={busy} onClick={continueWithGoogle} />
            )}
            <TrustRow />
          </>
        )}

        {step === "verify" && (
          <>
            <div className="rounded-2xl bg-secondary p-4 text-sm">
              <p className="font-medium">Check your inbox</p>
              <p className="mt-1 text-muted-foreground">
                We sent a secure one-time code to <span className="font-medium">{buyerEmail}</span>.
                Enter it below to continue — your order details are saved.
              </p>
              {linkSent && (
                <p className="mt-2 text-xs text-muted-foreground">
                  It can take a minute to arrive. Remember to check spam or promotions.
                </p>
              )}
            </div>

            <Field label="Or enter the 6-digit code from the email" htmlFor="code">
              <Input
                id="code"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="000000"
                className="text-center text-lg tracking-[0.5em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </Field>

            <ErrorNote error={error} />
            <Button size="lg" className="w-full" disabled={busy} onClick={confirmCode}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {busy ? "Confirming…" : "Confirm email"}
            </Button>
            <GoogleOption busy={googleBusy} disabled={busy} onClick={continueWithGoogle} />
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => {
                  setStep("details");
                  setError(null);
                  setCode("");
                }}
              >
                Change details
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline disabled:opacity-50"
                disabled={busy || cooldown > 0}
                onClick={startVerification}
              >
                <RefreshCw className="size-3.5" />
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
              </button>
            </div>
          </>
        )}

        {step === "shipping" && (
          <>
            <div className="flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-sm text-success">
              <CheckCircle2 className="size-4" />
              <span className="truncate">{authEmail ?? buyerEmail} confirmed</span>
            </div>

            <Field label="Street address" htmlFor="address">
              <Input
                id="address"
                autoComplete="street-address"
                placeholder="12 Adeola Odeku Street"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City / town" htmlFor="city">
                <Input
                  id="city"
                  autoComplete="address-level2"
                  placeholder="Victoria Island"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Field>
              <Field label="State" htmlFor="state">
                <Select value={stateName} onValueChange={setStateName}>
                  <SelectTrigger id="state" className="w-full">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Nearest landmark (optional)" htmlFor="landmark">
              <Input
                id="landmark"
                placeholder="Opposite Zenith Bank"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </Field>
            <Field label="Coupon code (optional)" htmlFor="coupon">
              <Input
                id="coupon"
                placeholder="Enter coupon code"
                autoCapitalize="characters"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-muted-foreground">
                We verify coupon codes when we call to confirm your order.
              </p>
            </Field>
            <Field label="Delivery note (optional)" htmlFor="note">
              <Textarea
                id="note"
                rows={3}
                placeholder="Call when you reach the estate gate."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </Field>

            <Summary quantity={quantity} shipping={shipping} total={total} />
            <ErrorNote error={error} />
            <Button size="lg" className="w-full" disabled={busy} onClick={finishOrder}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {busy ? "Redirecting to payment…" : `Pay ${naira(total)} securely`}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Payments are processed securely by Paystack. Card, bank transfer and USSD accepted.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "details", label: "Your details" },
    { key: "verify", label: "Verify email" },
    { key: "shipping", label: "Delivery" },
  ];
  const activeIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex border-b border-border bg-surface text-surface-foreground">
      {steps.map((s, i) => (
        <div
          key={s.key}
          className={`flex flex-1 items-center gap-2 px-3 py-3.5 text-xs font-medium sm:text-sm ${
            i <= activeIndex ? "text-surface-foreground" : "text-white/45"
          }`}
        >
          <span
            className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] ${
              i < activeIndex
                ? "bg-white/85 text-surface"
                : i === activeIndex
                  ? "bg-surface-foreground text-surface"
                  : "bg-white/10"
            }`}
          >
            {i < activeIndex ? <CheckCircle2 className="size-3.5" /> : i + 1}
          </span>
          <span className="truncate">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function QuantityPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const set = (n: number) => onChange(Math.min(MAX_QTY, Math.max(MIN_QTY, n)));
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-xl border border-border">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="grid size-11 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          disabled={value <= MIN_QTY}
          onClick={() => set(value - 1)}
        >
          <Minus className="size-4" />
        </button>
        <input
          aria-label="Quantity"
          inputMode="numeric"
          className="w-14 border-x border-border bg-transparent py-2.5 text-center font-display text-lg font-semibold outline-none"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, ""));
            set(Number.isFinite(n) && n > 0 ? n : MIN_QTY);
          }}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          className="grid size-11 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          disabled={value >= MAX_QTY}
          onClick={() => set(value + 1)}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{naira(UNIT_PRICE_NGN)} each</p>
    </div>
  );
}

function Summary({
  quantity,
  shipping,
  total,
}: {
  quantity: number;
  shipping: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl bg-secondary p-4 text-sm">
      <div className="flex justify-between py-1">
        <span className="text-muted-foreground">
          Mesh Tag × {quantity} (includes MeshApp access)
        </span>
        <span>{naira(quantity * UNIT_PRICE_NGN)}</span>
      </div>
      <div className="flex justify-between py-1">
        <span className="text-muted-foreground">Delivery</span>
        <span className={shipping === 0 ? "text-success" : undefined}>
          {shipping === 0 ? "Free" : naira(shipping)}
        </span>
      </div>
      <div className="mt-2 flex justify-between border-t border-border pt-3 font-display text-base font-semibold">
        <span>Total</span>
        <span>{naira(total)}</span>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      {error}
    </p>
  );
}

function GoogleOption({
  busy,
  disabled,
  onClick,
}: {
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={busy || disabled}
        onClick={onClick}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.87Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.27a12 12 0 0 0 0 10.76l4-3.09Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
            />
          </svg>
        )}
        {busy ? "Opening Google…" : "Continue with Google"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Your Google email is used as the verified email for this order.
      </p>
    </div>
  );
}

function TrustRow() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Lock className="size-3.5" /> Details kept private
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Truck className="size-3.5" /> 7–14 day delivery
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="size-3.5" /> 1-year warranty
      </span>
    </div>
  );
}

const FAQS = [
  {
    q: "How does the Mesh Tag network work?",
    a: "Each tag broadcasts an encrypted signal picked up by nearby Mesh Tags and MeshApp phones, which relay your latest position back to you as you move.",
  },
  {
    q: "Do I need to enter card details?",
    a: "No. Checkout collects only your confirmed email and delivery details — our team contacts you to complete the order.",
  },
  {
    q: "Where do you deliver?",
    a: "All 36 states and the FCT. Lagos and Abuja typically arrive in 2 working days; other states take 3–5.",
  },
  {
    q: "Why do I have to confirm my email?",
    a: "We email you a secure sign-in link (or 6-digit code) instead of a password. It confirms the order is genuine, keeps your order private to you, and gives us a reliable channel for your receipt, warranty and MeshApp setup link.",
  },
];

function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <h2 className="text-2xl font-semibold md:text-3xl">Questions, answered</h2>
      <div className="mt-6 space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
            <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-surface text-surface-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <LeagueTechLogo tone="light" />
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} League Technologies Ltd.
        </p>
      </div>
    </footer>
  );
}
