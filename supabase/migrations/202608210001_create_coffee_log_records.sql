create table if not exists public.coffee_log_records (
  user_id uuid not null references auth.users (id) on delete cascade,
  collection text not null check (
    collection in ('beans', 'equipments', 'recipes', 'brew_logs')
  ),
  record_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, collection, record_id)
);

alter table public.coffee_log_records enable row level security;

revoke all on table public.coffee_log_records from anon;
grant select, insert, update, delete on table public.coffee_log_records to authenticated;

create policy "Users can read their own coffee log records"
on public.coffee_log_records
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own coffee log records"
on public.coffee_log_records
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own coffee log records"
on public.coffee_log_records
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own coffee log records"
on public.coffee_log_records
for delete
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists coffee_log_records_set_updated_at
on public.coffee_log_records;

create trigger coffee_log_records_set_updated_at
before update on public.coffee_log_records
for each row
execute function public.set_updated_at();
