-- FutarchyVC — Supabase / PostgreSQL schema
--
-- Run manually in the Supabase SQL editor (or via your migration workflow).
-- Do not commit secrets. Pair with EXPO_PUBLIC_SUPABASE_URL and
-- EXPO_PUBLIC_SUPABASE_ANON_KEY in the Expo app (.env).
--
-- Table order respects foreign-key dependencies.

-- ---------------------------------------------------------------------------
-- profiles
-- Campus investor personas: display identity, reputation stats, badges,
-- recent activity feed items, and default investing thesis for the Profile tab.
-- id typically matches the auth user id (e.g. Supabase auth.uid()::text).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id text primary key,
  username text not null,
  campus text not null default '',
  avatar_initials text not null default '??',
  bio text not null default '',
  reputation_score integer not null default 0,
  forecasts_made integer not null default 0,
  investment_decisions_made integer not null default 0,
  watchlist_count integer not null default 0,
  accuracy_rate integer not null default 0 check (accuracy_rate between 0 and 100),
  rank integer not null default 0,
  badges jsonb not null default '[]'::jsonb,
  recent_activity jsonb not null default '[]'::jsonb,
  default_thesis text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'App users: username, campus, reputation, badges, activity, and investing thesis.';

-- ---------------------------------------------------------------------------
-- startups
-- Founder-submitted or seeded companies shown in the Feed and detail screens.
-- status controls visibility and lifecycle (draft vs live vs archived).
-- Community aggregates (percent_invest, averages) support card UI metrics.
-- ---------------------------------------------------------------------------
create table if not exists public.startups (
  id text primary key,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  website_url text not null default '',
  logo_url text not null default '',
  industry text not null default '',
  stage text not null default 'mvp' check (
    stage in ('idea', 'mvp', 'pre-seed', 'seed', 'early-revenue')
  ),
  status text not null default 'active' check (
    status in ('draft', 'pending_review', 'pending', 'analyzed', 'active', 'archived')
  ),
  amount_raising numeric not null default 0 check (amount_raising >= 0),
  valuation numeric not null default 0 check (valuation >= 0),
  traction text not null default '',
  founder_name text not null default '',
  founder_email text,
  ai_score numeric not null default 0 check (ai_score between 0 and 100),
  percent_invest numeric not null default 0 check (percent_invest between 0 and 100),
  percent_pass numeric not null default 0 check (percent_pass between 0 and 100),
  average_conviction numeric not null default 0 check (average_conviction between 0 and 100),
  average_forecast numeric not null default 0 check (average_forecast between 0 and 100),
  created_at timestamptz not null default now()
);

comment on table public.startups is
  'Campus startups in the feed: founder info, fundraising, AI/community scores, and publication status.';
comment on column public.startups.status is
  'Lifecycle: pending (submitted), analyzed (diligence ready), active (feed-visible), archived.';

-- ---------------------------------------------------------------------------
-- diligence_reports
-- AI-generated diligence memos tied 1:1 to a startup (accordion on detail screen).
-- risks and suggested_questions are JSON arrays for flexible list lengths.
-- ---------------------------------------------------------------------------
create table if not exists public.diligence_reports (
  id text primary key,
  startup_id text not null references public.startups (id) on delete cascade,
  executive_summary text not null default '',
  market_analysis text not null default '',
  competitor_analysis text not null default '',
  bull_case text not null default '',
  bear_case text not null default '',
  risks jsonb not null default '[]'::jsonb,
  investment_memo text not null default '',
  suggested_questions jsonb not null default '[]'::jsonb,
  ai_score numeric not null default 0 check (ai_score between 0 and 100),
  generated_at timestamptz not null default now(),
  constraint diligence_reports_startup_id_unique unique (startup_id)
);

comment on table public.diligence_reports is
  'AI diligence output per startup: summary, market/competitor analysis, bull/bear, risks, memo.';

-- ---------------------------------------------------------------------------
-- investment_decisions
-- User invest/pass choices with conviction and optional reasoning (Decision modal).
-- At most one decision per user per startup (enforced by unique constraint).
-- ---------------------------------------------------------------------------
create table if not exists public.investment_decisions (
  id text primary key,
  startup_id text not null references public.startups (id) on delete cascade,
  user_id text not null references public.profiles (id) on delete cascade,
  decision text not null check (decision in ('invest', 'pass')),
  conviction integer not null default 50 check (conviction between 1 and 100),
  reasoning text,
  created_at timestamptz not null default now(),
  constraint investment_decisions_user_startup_unique unique (user_id, startup_id)
);

comment on table public.investment_decisions is
  'Invest or pass decisions per user per startup; one row per (user_id, startup_id).';

-- ---------------------------------------------------------------------------
-- forecasts
-- One row per forecast question per user per startup (probability + reasoning).
-- resolved tracks outcome settlement; defaults to false until scored.
-- ---------------------------------------------------------------------------
create table if not exists public.forecasts (
  id text primary key,
  startup_id text not null references public.startups (id) on delete cascade,
  user_id text not null references public.profiles (id) on delete cascade,
  question text not null check (
    question in ('next-round-18m', 'arr-1m-24m', 'exit-100m-5y')
  ),
  probability integer not null check (probability between 0 and 100),
  reasoning text,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint forecasts_user_startup_question_unique unique (user_id, startup_id, question)
);

comment on table public.forecasts is
  'Per-question probability forecasts; one row per (user_id, startup_id, question).';

-- ---------------------------------------------------------------------------
-- leaderboard_entries
-- Denormalized rows for Leaderboard tabs: top forecasters, most active, campus rankings.
-- category discriminates which UI tab/columns apply; nullable fields used per category.
-- ---------------------------------------------------------------------------
create table if not exists public.leaderboard_entries (
  id text primary key,
  category text not null check (
    category in ('top_forecaster', 'most_active', 'campus')
  ),
  rank integer not null default 0 check (rank > 0),
  username text,
  campus text not null default '',
  reputation_score integer,
  forecast_count integer,
  accuracy_placeholder text,
  badge text check (
    badge is null
    or badge in ('Top Scout', 'High Conviction', 'Rising Analyst')
  ),
  total_reputation integer,
  forecaster_count integer,
  avg_accuracy_placeholder text,
  top_forecaster text,
  weekly_momentum text,
  created_at timestamptz not null default now()
);

comment on table public.leaderboard_entries is
  'Leaderboard seed/display rows: forecaster ranks, activity leaders, and campus aggregates.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_startups_status_created
  on public.startups (status, created_at desc);

create index if not exists idx_diligence_reports_startup_id
  on public.diligence_reports (startup_id);

create index if not exists idx_investment_decisions_user_id
  on public.investment_decisions (user_id);

create index if not exists idx_investment_decisions_startup_id
  on public.investment_decisions (startup_id);

create index if not exists idx_forecasts_user_id
  on public.forecasts (user_id);

create index if not exists idx_forecasts_startup_id
  on public.forecasts (startup_id);

create index if not exists idx_leaderboard_entries_category_rank
  on public.leaderboard_entries (category, rank);

-- ---------------------------------------------------------------------------
-- updated_at helper (profiles, forecasts)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists forecasts_set_updated_at on public.forecasts;
create trigger forecasts_set_updated_at
  before update on public.forecasts
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Migration: allow submission statuses on existing projects
-- ---------------------------------------------------------------------------
-- alter table public.startups drop constraint if exists startups_status_check;
-- alter table public.startups add constraint startups_status_check check (
--   status in ('draft', 'pending_review', 'pending', 'analyzed', 'active', 'archived')
-- );

-- Migration: per-question forecasts (replaces jsonb answers model)
-- drop table if exists public.forecasts cascade;
-- then re-run the forecasts create table block above.
