-- =========================================================
-- MEMORY — schema inicial + Row Level Security
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- profiles: 1 linha por utilizador autenticado
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: utilizador vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: utilizador atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles: utilizador cria o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ---------------------------------------------------------
-- couples: par de utilizadores (o "casal")
-- ---------------------------------------------------------
create table if not exists public.couples (
  id uuid primary key default uuid_generate_v4(),
  name text,
  partner_1 uuid not null references auth.users(id) on delete cascade,
  partner_2 uuid references auth.users(id) on delete set null,
  start_date date,
  created_at timestamptz not null default now()
);

alter table public.couples enable row level security;

create policy "couples: membros veem o próprio casal"
  on public.couples for select
  using (auth.uid() = partner_1 or auth.uid() = partner_2);

create policy "couples: criador pode criar"
  on public.couples for insert
  with check (auth.uid() = partner_1);

create policy "couples: membros podem atualizar"
  on public.couples for update
  using (auth.uid() = partner_1 or auth.uid() = partner_2);

-- ---------------------------------------------------------
-- memories: cada memória pertence a um couple_id
-- ---------------------------------------------------------
create table if not exists public.memories (
  id uuid primary key default uuid_generate_v4(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  title text not null,
  description text,
  date date not null,
  location text,
  category text not null default 'outros' check (
    category in ('encontro','viagem','aniversario','passeio','comida','familia','especial','outros')
  ),
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memories_couple_id_idx on public.memories (couple_id);
create index if not exists memories_date_idx on public.memories (date desc);

alter table public.memories enable row level security;

-- Só membros do casal correspondente podem ver/gerir as memórias
create policy "memories: membros do casal veem"
  on public.memories for select
  using (
    exists (
      select 1 from public.couples c
      where c.id = memories.couple_id
        and (auth.uid() = c.partner_1 or auth.uid() = c.partner_2)
    )
  );

create policy "memories: membros do casal inserem"
  on public.memories for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.couples c
      where c.id = memories.couple_id
        and (auth.uid() = c.partner_1 or auth.uid() = c.partner_2)
    )
  );

create policy "memories: membros do casal atualizam"
  on public.memories for update
  using (
    exists (
      select 1 from public.couples c
      where c.id = memories.couple_id
        and (auth.uid() = c.partner_1 or auth.uid() = c.partner_2)
    )
  );

create policy "memories: membros do casal eliminam"
  on public.memories for delete
  using (
    exists (
      select 1 from public.couples c
      where c.id = memories.couple_id
        and (auth.uid() = c.partner_1 or auth.uid() = c.partner_2)
    )
  );

-- Trigger para manter updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists memories_set_updated_at on public.memories;
create trigger memories_set_updated_at
  before update on public.memories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Storage: bucket privado "memories"
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('memories', 'memories', false)
on conflict (id) do nothing;

-- Ficheiros são guardados em: memories/{couple_id}/{filename}
-- Política: só membros do respetivo casal podem ler/escrever/apagar
create policy "storage: membros do casal leem"
  on storage.objects for select
  using (
    bucket_id = 'memories'
    and exists (
      select 1 from public.couples c
      where c.id::text = (storage.foldername(name))[1]
        and (auth.uid() = c.partner_1 or auth.uid() = c.partner_2)
    )
  );

create policy "storage: membros do casal enviam"
  on storage.objects for insert
  with check (
    bucket_id = 'memories'
    and exists (
      select 1 from public.couples c
      where c.id::text = (storage.foldername(name))[1]
        and (auth.uid() = c.partner_1 or auth.uid() = c.partner_2)
    )
  );

create policy "storage: membros do casal apagam"
  on storage.objects for delete
  using (
    bucket_id = 'memories'
    and exists (
      select 1 from public.couples c
      where c.id::text = (storage.foldername(name))[1]
        and (auth.uid() = c.partner_1 or auth.uid() = c.partner_2)
    )
  );

-- ---------------------------------------------------------
-- Cria automaticamente profile + couple ao registar
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));

  insert into public.couples (partner_1)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
