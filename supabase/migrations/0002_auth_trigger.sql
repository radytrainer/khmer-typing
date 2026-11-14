-- Auto-create a profiles row whenever a new Supabase Auth user signs up (email/password or Google).
-- username defaults to the email local-part or the OAuth display name, de-duplicated if needed.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    split_part(new.email, '@', 1),
    'player'
  );
  base_username := regexp_replace(lower(base_username), '[^a-z0-9_]+', '_', 'g');
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || '_' || suffix;
  end loop;

  -- Self-registration may only ever grant 'student' or 'teacher'. Any other value in the
  -- sign-up payload (including 'admin') is ignored and silently falls back to 'student' —
  -- admin accounts are provisioned manually, never through this trigger.
  insert into public.profiles (id, username, full_name, avatar_url, role)
  values (
    new.id,
    final_username,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    case
      when new.raw_user_meta_data ->> 'role' = 'teacher' then 'teacher'::role
      else 'student'::role
    end
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
