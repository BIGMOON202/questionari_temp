-- Run in Supabase → SQL Editor. Adjust policies for your security model (anon insert from the app).

-- Super-Pharm (default name matches legacy VITE_SUPABASE_SUBMISSIONS_TABLE / questionnaire_submissions)
create table if not exists public.questionnaire_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  id_number text not null,
  phone text not null,
  email text not null,
  birth_date text not null,
  accepted_terms boolean not null default false,
  answers jsonb not null,
  elapsed_seconds integer not null,
  reference_number text not null,
  invoice_storage_path text not null,
  invoice_public_url text not null
);

-- Rami Levy / Good Pharm
create table if not exists public.questionnaire_submissions_ramilevy_good_pharm (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  id_number text not null,
  phone text not null,
  email text not null,
  birth_date text not null,
  accepted_terms boolean not null default false,
  answers jsonb not null,
  elapsed_seconds integer not null,
  reference_number text not null,
  invoice_storage_path text not null,
  invoice_public_url text not null,
  network text null
);

-- Yochananof (no network column — only ramilevygoodpharm collects רשת)
create table if not exists public.questionnaire_submissions_yochananof (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  id_number text not null,
  phone text not null,
  email text not null,
  birth_date text not null,
  accepted_terms boolean not null default false,
  answers jsonb not null,
  elapsed_seconds integer not null,
  reference_number text not null,
  invoice_storage_path text not null,
  invoice_public_url text not null
);

-- Example RLS: allow anonymous inserts from the browser (tighten for production if needed)
alter table public.questionnaire_submissions enable row level security;
alter table public.questionnaire_submissions_ramilevy_good_pharm enable row level security;
alter table public.questionnaire_submissions_yochananof enable row level security;

create policy "Allow public insert questionnaire_submissions"
  on public.questionnaire_submissions for insert to anon with check (true);

create policy "Allow public insert questionnaire_submissions_ramilevy_good_pharm"
  on public.questionnaire_submissions_ramilevy_good_pharm for insert to anon with check (true);

create policy "Allow public insert questionnaire_submissions_yochananof"
  on public.questionnaire_submissions_yochananof for insert to anon with check (true);

-- If you already created superpharm / yochananof tables with a network column, drop it:
-- alter table public.questionnaire_submissions drop column if exists network;
-- alter table public.questionnaire_submissions_yochananof drop column if exists network;
