-- ============================================================
-- Doka — Sorteio Ovo Especial de Páscoa 2026
-- Migration: create table and storage bucket
-- ============================================================

-- 1. Table: sorteio_pascoa
create table if not exists public.sorteio_pascoa (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  whatsapp   text not null,
  email      text not null,
  print_url  text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.sorteio_pascoa enable row level security;

-- Allow anonymous inserts (public giveaway form)
create policy "Allow anon insert"
  on public.sorteio_pascoa
  for insert
  to anon
  with check (true);

-- Only authenticated users (admins) can read
create policy "Allow authenticated read"
  on public.sorteio_pascoa
  for select
  to authenticated
  using (true);

-- 2. Storage bucket: sorteio-prints
insert into storage.buckets (id, name, public)
values ('sorteio-prints', 'sorteio-prints', true)
on conflict (id) do nothing;

-- Allow anonymous uploads to the bucket
create policy "Allow anon uploads"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'sorteio-prints');

-- Public read access for uploaded images
create policy "Public read sorteio-prints"
  on storage.objects
  for select
  to public
  using (bucket_id = 'sorteio-prints');
