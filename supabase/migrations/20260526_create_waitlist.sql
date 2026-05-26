-- Create waitlist table for MarketNera pre-launch signups
create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  role text not null check (role in ('customer', 'shopkeeper', 'delivery', 'other')),
  suggestions text,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Allow anyone to insert (public signups)
create policy "Anyone can join waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- Only service role / admin can read waitlist entries
create policy "Service role can read waitlist"
  on public.waitlist
  for select
  to service_role
  using (true);
