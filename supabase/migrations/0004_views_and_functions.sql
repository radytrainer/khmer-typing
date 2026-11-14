-- Derived views/functions. Weekly and monthly progress are computed on the fly from
-- daily_progress rather than stored redundantly, so there is exactly one place that can drift.

create or replace view weekly_progress as
select
  user_id,
  date_trunc('week', date)::date as week_start,
  sum(xp_earned)       as xp_earned,
  sum(games_played)    as games_played,
  sum(minutes_played)  as minutes_played,
  sum(correct_letters) as correct_letters,
  sum(wrong_letters)   as wrong_letters
from daily_progress
group by user_id, date_trunc('week', date);

create or replace view monthly_progress as
select
  user_id,
  date_trunc('month', date)::date as month_start,
  sum(xp_earned)       as xp_earned,
  sum(games_played)    as games_played,
  sum(minutes_played)  as minutes_played,
  sum(correct_letters) as correct_letters,
  sum(wrong_letters)   as wrong_letters
from daily_progress
group by user_id, date_trunc('month', date);

-- Per-game leaderboard, filterable by period. Ties are broken by the earliest play (rewards
-- consistency over a lucky last-second score).
create or replace function public.leaderboard(
  game_slug text,
  period text default 'all_time', -- 'daily' | 'weekly' | 'monthly' | 'all_time'
  limit_count int default 20
)
returns table (
  rank bigint,
  user_id uuid,
  username text,
  avatar_url text,
  best_score int,
  played_at timestamptz
)
language sql
stable
as $$
  with window_start as (
    select case period
      when 'daily' then now() - interval '1 day'
      when 'weekly' then now() - interval '7 days'
      when 'monthly' then now() - interval '30 days'
      else '-infinity'::timestamptz
    end as ts
  ),
  best_per_user as (
    select distinct on (gs.user_id)
      gs.user_id, gs.score as best_score, gs.played_at
    from game_sessions gs
    join games g on g.id = gs.game_id
    where g.slug = game_slug
      and gs.played_at >= (select ts from window_start)
    order by gs.user_id, gs.score desc, gs.played_at asc
  )
  select
    (row_number() over (order by bpu.best_score desc, bpu.played_at asc))::int as rank,
    bpu.user_id,
    p.username,
    p.avatar_url,
    bpu.best_score,
    bpu.played_at
  from best_per_user bpu
  join profiles p on p.id = bpu.user_id
  order by bpu.best_score desc, bpu.played_at asc
  limit limit_count;
$$;

-- Ranking of students within a single class, by total XP earned from sessions played while
-- enrolled. Used by the Teacher Portal's "Class Ranking" view.
-- rank/total_xp/games_played are cast to int — a single class will never approach the 2^31
-- range, and it keeps the JS side working with plain numbers instead of BigInt.
create or replace function public.class_leaderboard(
  target_class_id uuid,
  limit_count int default 50
)
returns table (
  rank int,
  user_id uuid,
  username text,
  avatar_url text,
  total_xp int,
  games_played int
)
language sql
stable
as $$
  select
    (row_number() over (order by coalesce(sum(gs.xp_earned), 0) desc))::int as rank,
    p.id as user_id,
    p.username,
    p.avatar_url,
    coalesce(sum(gs.xp_earned), 0)::int as total_xp,
    count(gs.id)::int as games_played
  from class_students cs
  join profiles p on p.id = cs.student_id
  left join game_sessions gs on gs.user_id = p.id
  where cs.class_id = target_class_id
  group by p.id, p.username, p.avatar_url
  order by total_xp desc
  limit limit_count;
$$;
