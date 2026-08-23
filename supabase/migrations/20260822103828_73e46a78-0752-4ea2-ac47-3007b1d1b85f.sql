CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  buyer_name text NOT NULL,
  buyer_email text NOT NULL,
  buyer_phone text NOT NULL,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 50),
  unit_price_ngn integer NOT NULL,
  shipping_fee_ngn integer NOT NULL DEFAULT 0,
  total_ngn integer NOT NULL,
  address_line text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  landmark text,
  delivery_note text,
  status text NOT NULL DEFAULT 'pending',
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code_hash text NOT NULL,
  provider text NOT NULL DEFAULT 'internal',
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX email_verifications_email_idx ON public.email_verifications (email, created_at DESC);

GRANT ALL ON public.email_verifications TO service_role;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;