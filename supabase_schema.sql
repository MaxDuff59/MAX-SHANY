-- ============================================================
-- Schéma Supabase pour "Max & Shany"
-- À exécuter dans Supabase > SQL Editor > New query
-- ============================================================

-- Table Courses (liste de courses simple)
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  checked boolean not null default false,
  created_at timestamptz not null default now()
);

-- Table Todos (à faire, avec date, priorité et qui s'en occupe)
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  done boolean not null default false,
  due_date date,
  priority text not null default 'normale' check (priority in ('basse', 'normale', 'haute')),
  -- Qui fait la tâche : {} (personne), {max}, {shany} ou {max,shany}.
  assignees text[] not null default '{}' check (assignees <@ array['max', 'shany']::text[]),
  created_at timestamptz not null default now()
);

-- Active la sécurité au niveau des lignes (bonne pratique Supabase)
alter table courses enable row level security;
alter table todos enable row level security;

-- Politique simple : autorise tout (lecture/écriture) via la clé "anon".
-- Suffisant pour un petit projet perso à 2 utilisateurs.
-- ⚠️ Si un jour tu ouvres l'app publiquement, remplace ça par une vraie
-- politique liée à l'utilisateur connecté (auth.uid()).
create policy "Allow all on courses" on courses
  for all using (true) with check (true);

create policy "Allow all on todos" on todos
  for all using (true) with check (true);

-- Index utile pour trier les todos par date
create index if not exists todos_due_date_idx on todos (due_date);
