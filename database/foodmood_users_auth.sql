create table if not exists public.foodmood_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default 'Usuario',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  provider text not null default 'google',
  last_login_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists foodmood_users_email_key on public.foodmood_users (lower(email));

alter table public.foodmood_users enable row level security;

create or replace function public.set_foodmood_users_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_foodmood_users_updated_at on public.foodmood_users;
create trigger set_foodmood_users_updated_at
before update on public.foodmood_users
for each row execute function public.set_foodmood_users_updated_at();

create or replace function public.protect_foodmood_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'service_role' then
    if tg_op = 'INSERT' then
      new.role = 'user';
    else
      new.role = old.role;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_foodmood_user_role on public.foodmood_users;
create trigger protect_foodmood_user_role
before insert or update on public.foodmood_users
for each row execute function public.protect_foodmood_user_role();

drop policy if exists "Users can read own FoodMood profile" on public.foodmood_users;
create policy "Users can read own FoodMood profile"
on public.foodmood_users
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can insert own FoodMood profile" on public.foodmood_users;
create policy "Users can insert own FoodMood profile"
on public.foodmood_users
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update own FoodMood profile" on public.foodmood_users;
create policy "Users can update own FoodMood profile"
on public.foodmood_users
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
