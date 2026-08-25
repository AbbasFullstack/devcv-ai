-- Applied to the isolated DevCV AI Supabase project on 2026-08-25.
-- Resume content is saved only through an explicit authenticated user action.

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
  resume_version_id uuid not null references public.resume_versions(id) on delete cascade,
  target_role text not null,
  overall_score integer check (overall_score between 0 and 100),
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists resume_versions_user_updated_idx on public.resume_versions (user_id, updated_at desc);
create index if not exists analysis_runs_user_created_idx on public.analysis_runs (user_id, created_at desc);

create or replace function public.set_resume_version_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_resume_version_updated_at on public.resume_versions;
create trigger set_resume_version_updated_at
before update on public.resume_versions
for each row execute function public.set_resume_version_updated_at();

alter table public.profiles enable row level security;
alter table public.resume_versions enable row level security;
alter table public.analysis_runs enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.resume_versions to authenticated;
grant select, insert, update, delete on public.analysis_runs to authenticated;

revoke all on public.profiles from anon;
revoke all on public.resume_versions from anon;
revoke all on public.analysis_runs from anon;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create policy "resume_versions_select_own" on public.resume_versions for select to authenticated using ((select auth.uid()) = user_id);
create policy "resume_versions_insert_own" on public.resume_versions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "resume_versions_update_own" on public.resume_versions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "resume_versions_delete_own" on public.resume_versions for delete to authenticated using ((select auth.uid()) = user_id);

create policy "analysis_runs_select_own" on public.analysis_runs for select to authenticated using ((select auth.uid()) = user_id);
create policy "analysis_runs_insert_own" on public.analysis_runs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "analysis_runs_update_own" on public.analysis_runs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "analysis_runs_delete_own" on public.analysis_runs for delete to authenticated using ((select auth.uid()) = user_id);
