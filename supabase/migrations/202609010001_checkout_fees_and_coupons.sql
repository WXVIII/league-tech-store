alter table public.orders
  add column if not exists discount_ngn integer not null default 0,
  add column if not exists transaction_fee_ngn integer not null default 0;

create table if not exists public.coupons (
  code text primary key,
  discount_type text not null default 'percentage' check (discount_type = 'percentage'),
  discount_value integer not null check (discount_value between 1 and 100),
  active boolean not null default true,
  expires_at timestamptz
);

grant all on public.coupons to service_role;
alter table public.coupons enable row level security;
