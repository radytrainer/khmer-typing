-- Row Level Security. Design principles:
--   * Reference data (games/letters/words/achievements) is public read, service-role write.
--   * Gameplay facts (game_sessions, user_achievements, daily_progress) are client-insertable
--     only where noted; anything that grants XP/coins/achievements is written by server-side
--     API routes using the Supabase service role key, which bypasses RLS entirely.
--   * profiles.role/xp/coins/level are additionally protected by a trigger so an authenticated
--     user can never grant themselves admin or free currency via a direct table update.

alter table profiles enable row level security;
alter table classes enable row level security;
alter table class_students enable row level security;
alter table games enable row level security;
alter table letters enable row level security;
alter table words enable row level security;
alter table game_sessions enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table daily_progress enable row level security;

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_teacher_of(target_student_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from class_students cs
    join classes c on c.id = cs.class_id
    where cs.student_id = target_student_id
      and c.teacher_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "profiles_select_own_or_staff"
  on profiles for select
  using (
    id = auth.uid()
    or public.is_admin()
    or public.is_teacher_of(id)
  );

create policy "profiles_update_own"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
as $$
begin
  if (new.role is distinct from old.role
      or new.xp is distinct from old.xp
      or new.coins is distinct from old.coins
      or new.level is distinct from old.level)
     and auth.role() <> 'service_role' then
    raise exception 'role, xp, coins, and level can only be changed by the server.';
  end if;
  return new;
end;
$$;

create trigger protect_profile_privileged_columns
  before update on profiles
  for each row execute procedure public.prevent_profile_privilege_escalation();

-- ---------------------------------------------------------------------------
-- classes / class_students
-- ---------------------------------------------------------------------------
create policy "classes_select_teacher_or_member"
  on classes for select
  using (
    teacher_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from class_students cs where cs.class_id = id and cs.student_id = auth.uid())
  );

create policy "classes_insert_teacher"
  on classes for insert
  with check (teacher_id = auth.uid());

create policy "classes_update_owner"
  on classes for update
  using (teacher_id = auth.uid());

create policy "classes_delete_owner"
  on classes for delete
  using (teacher_id = auth.uid());

create policy "class_students_select_teacher_or_self"
  on class_students for select
  using (
    student_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from classes c where c.id = class_id and c.teacher_id = auth.uid())
  );

create policy "class_students_manage_by_teacher"
  on class_students for insert
  with check (exists (select 1 from classes c where c.id = class_id and c.teacher_id = auth.uid()));

create policy "class_students_delete_by_teacher"
  on class_students for delete
  using (exists (select 1 from classes c where c.id = class_id and c.teacher_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Reference data: games / letters / words / achievements — public read, service-role write.
-- ---------------------------------------------------------------------------
create policy "games_public_read" on games for select using (true);
create policy "letters_public_read" on letters for select using (true);
create policy "words_public_read" on words for select using (true);
create policy "achievements_public_read" on achievements for select using (true);

-- ---------------------------------------------------------------------------
-- game_sessions — insert your own, read your own (+ teacher/admin visibility). Immutable.
-- ---------------------------------------------------------------------------
create policy "game_sessions_select_own_or_staff"
  on game_sessions for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.is_teacher_of(user_id)
  );

create policy "game_sessions_insert_own"
  on game_sessions for insert
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- user_achievements — read your own; only the server (service_role) awards them.
-- ---------------------------------------------------------------------------
create policy "user_achievements_select_own_or_staff"
  on user_achievements for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.is_teacher_of(user_id)
  );

-- ---------------------------------------------------------------------------
-- daily_progress — read your own (+ teacher/admin); only the server writes aggregates.
-- ---------------------------------------------------------------------------
create policy "daily_progress_select_own_or_staff"
  on daily_progress for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.is_teacher_of(user_id)
  );
