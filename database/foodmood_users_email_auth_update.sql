alter table public.foodmood_users
add column if not exists first_name text,
add column if not exists last_name text,
add column if not exists username text;

alter table public.foodmood_users
alter column provider set default 'email';

create unique index if not exists foodmood_users_username_key
on public.foodmood_users (lower(username))
where username is not null;
