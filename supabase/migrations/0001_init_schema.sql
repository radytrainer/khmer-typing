-- Khmer Typing Game Platform — initial schema.
-- Mirrors prisma/schema.prisma exactly (same table/column names) so Prisma Client can query
-- this database without ever running `prisma migrate` against it. Apply via the Supabase SQL
-- editor or `supabase db push`, in order (0001, 0002, 0003, ...).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type role as enum ('student', 'teacher', 'admin');
create type difficulty as enum ('easy', 'medium', 'hard');
create type letter_category as enum ('consonant', 'independent_vowel', 'dependent_vowel', 'number', 'symbol');
create type word_category as enum ('animals', 'food', 'school', 'technology', 'daily_life', 'family', 'colors', 'nature');
create type achievement_rarity as enum ('common', 'rare', 'epic', 'legendary');

-- ---------------------------------------------------------------------------
-- profiles — one row per auth.users row, created by the trigger in 0002.
-- ---------------------------------------------------------------------------
create table profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  username         text unique not null,
  full_name        text,
  avatar_url       text,
  role             role not null default 'student',
  xp               integer not null default 0,
  coins            integer not null default 0,
  level            integer not null default 1,
  current_streak   integer not null default 0,
  longest_streak   integer not null default 0,
  last_played_at   timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- classes / class_students — teacher-managed classrooms.
-- ---------------------------------------------------------------------------
create table classes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references profiles (id) on delete cascade,
  name        text not null,
  join_code   text unique not null,
  created_at  timestamptz not null default now()
);

create table class_students (
  class_id    uuid not null references classes (id) on delete cascade,
  student_id  uuid not null references profiles (id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (class_id, student_id)
);

-- ---------------------------------------------------------------------------
-- games — catalog of the 10 game modes.
-- ---------------------------------------------------------------------------
create table games (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text not null,
  icon        text not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0
);

-- ---------------------------------------------------------------------------
-- letters / words — dictionaries used by Falling Letters, Falling Words, Learning Mode.
-- ---------------------------------------------------------------------------
create table letters (
  id            uuid primary key default gen_random_uuid(),
  char          text not null,
  romanization  text not null,
  category      letter_category not null,
  difficulty    difficulty not null default 'easy',
  sort_order    integer not null default 0,
  unique (char, category)
);

create table words (
  id               uuid primary key default gen_random_uuid(),
  word             text not null,
  romanization     text not null,
  english_meaning  text not null,
  category         word_category not null,
  difficulty       difficulty not null default 'easy',
  unique (word, category)
);

-- ---------------------------------------------------------------------------
-- game_sessions — one row per completed game round; source of truth for stats & leaderboards.
-- ---------------------------------------------------------------------------
create table game_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles (id) on delete cascade,
  game_id           uuid not null references games (id) on delete cascade,
  difficulty        difficulty not null default 'easy',
  score             integer not null default 0,
  kpm               numeric(6, 2) not null default 0,
  accuracy          numeric(5, 2) not null default 0,
  correct_count     integer not null default 0,
  wrong_count       integer not null default 0,
  max_combo         integer not null default 0,
  duration_seconds  integer not null default 0,
  xp_earned         integer not null default 0,
  coins_earned      integer not null default 0,
  played_at         timestamptz not null default now()
);

create index game_sessions_game_id_score_idx on game_sessions (game_id, score desc);
create index game_sessions_user_id_played_at_idx on game_sessions (user_id, played_at desc);

-- ---------------------------------------------------------------------------
-- achievements / user_achievements
-- ---------------------------------------------------------------------------
create table achievements (
  code            text primary key,
  name            text not null,
  description     text not null,
  icon            text not null,
  rarity          achievement_rarity not null default 'common',
  criteria_type   text not null,
  criteria_value  integer not null,
  meta            text,
  xp_reward       integer not null default 0,
  coin_reward     integer not null default 0
);

create table user_achievements (
  user_id           uuid not null references profiles (id) on delete cascade,
  achievement_code  text not null references achievements (code) on delete cascade,
  unlocked_at       timestamptz not null default now(),
  primary key (user_id, achievement_code)
);

-- ---------------------------------------------------------------------------
-- daily_progress — one row per user per day; weekly/monthly are derived views (see 0004).
-- ---------------------------------------------------------------------------
create table daily_progress (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles (id) on delete cascade,
  date              date not null,
  xp_earned         integer not null default 0,
  games_played      integer not null default 0,
  minutes_played    integer not null default 0,
  correct_letters   integer not null default 0,
  wrong_letters     integer not null default 0,
  unique (user_id, date)
);
