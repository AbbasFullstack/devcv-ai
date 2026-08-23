create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled resume',
  target_role text,
  resume_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_version_id uuid references public.resume_versions(id) on delete set null,
  target_role text not null,
  overall_score integer check (overall_score between 0 and 100),
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.resume_versions enable row level security;
alter table public.analysis_runs enable row level security;

create policy "Users own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users own resume versions" on public.resume_versions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own analysis history" on public.analysis_runs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
