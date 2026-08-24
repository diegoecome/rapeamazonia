-- ============================================================
-- ESQUEMA DO BANCO — Loja de Rapé Amazônico
-- Rode este arquivo inteiro no Supabase: SQL Editor > New query > Run
-- ============================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ---------- CATEGORIAS ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position int default 0,
  created_at timestamptz default now()
);

-- ---------- PRODUTOS ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  price numeric(10,2) not null default 0,
  promo_price numeric(10,2),
  category_id uuid references categories(id) on delete set null,
  stock int not null default 0,
  weight_grams int,
  -- Origem / autenticidade (só preenchido manualmente pelo admin, nunca automático)
  origin_region text,
  origin_community text,
  origin_producer text,
  ingredients text,
  process_notes text,
  origin_story text,
  status text not null default 'active' check (status in ('active','paused')),
  position int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_status on products(status);
create index if not exists idx_products_category on products(category_id);

-- ---------- IMAGENS DO PRODUTO ----------
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  position int default 0,
  is_main boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_product_images_product on product_images(product_id);

-- ---------- CONTEÚDO DA HOME (CMS) ----------
-- Estrutura chave/valor em JSON para o admin editar sem mexer em código
create table if not exists home_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ---------- CONFIGURAÇÕES DA LOJA ----------
create table if not exists store_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ---------- POSTS / EDITORIAL (histórias, origem, comunidade) ----------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_url text,
  status text not null default 'active' check (status in ('active','paused')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- ADMINISTRADORES ----------
-- Lista de e-mails autorizados a acessar o painel /admin.
-- O login em si usa o Supabase Auth (Authentication > Users).
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Regra geral: qualquer visitante pode LER produtos ativos e conteúdo público.
-- Só um e-mail cadastrado em admin_users pode CRIAR/EDITAR/EXCLUIR.
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table home_content enable row level security;
alter table store_settings enable row level security;
alter table posts enable row level security;
alter table admin_users enable row level security;

-- Função auxiliar: o usuário logado é admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users
    where email = auth.jwt() ->> 'email'
  );
$$ language sql security definer stable;

-- Leitura pública
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (status = 'active' or is_admin());
create policy "public read product_images" on product_images for select using (true);
create policy "public read home_content" on home_content for select using (true);
create policy "public read store_settings" on store_settings for select using (true);
create policy "public read posts" on posts for select using (status = 'active' or is_admin());

-- Escrita só para admin
create policy "admin write categories" on categories for all using (is_admin()) with check (is_admin());
create policy "admin write products" on products for all using (is_admin()) with check (is_admin());
create policy "admin write product_images" on product_images for all using (is_admin()) with check (is_admin());
create policy "admin write home_content" on home_content for all using (is_admin()) with check (is_admin());
create policy "admin write store_settings" on store_settings for all using (is_admin()) with check (is_admin());
create policy "admin write posts" on posts for all using (is_admin()) with check (is_admin());
-- admin_users só pode ser lido/editado por quem já é admin (evita que qualquer um se auto-promova)
create policy "admin read admin_users" on admin_users for select using (is_admin());
create policy "admin write admin_users" on admin_users for all using (is_admin()) with check (is_admin());

-- ============================================================
-- DADOS INICIAIS
-- ============================================================

insert into home_content (key, value) values
  ('hero', '{
    "eyebrow": "Amazônia — Ancestralidade — Rapé",
    "title": "Feito na floresta, para o seu centro.",
    "subtitle": "Rapés artesanais preparados por comunidades tradicionais da Amazônia, com origem rastreada e respeito à sua procedência.",
    "cta_text": "Explorar rapés"
  }'::jsonb)
on conflict (key) do nothing;

insert into home_content (key, value) values
  ('manifesto', '{
    "title": "Não é um produto. É uma tradição que chega até você.",
    "text": "Cada rapé carrega o conhecimento de quem planta, colhe e prepara com as mãos. Trabalhamos com origem declarada, sem inventar histórias — só o que é real."
  }'::jsonb)
on conflict (key) do nothing;

insert into store_settings (key, value) values
  ('store_info', '{
    "name": "Rapé da Floresta",
    "description": "Loja de rapés artesanais de origem amazônica.",
    "instagram": "",
    "email_contato": ""
  }'::jsonb)
on conflict (key) do nothing;

insert into store_settings (key, value) values
  ('whatsapp', '{
    "number": "5548999999999",
    "default_message": "Olá! Gostaria de fazer um pedido."
  }'::jsonb)
on conflict (key) do nothing;

insert into store_settings (key, value) values
  ('delivery', '{
    "text": "Enviamos para todo o Brasil via Correios/transportadora. Prazo informado no fechamento do pedido pelo WhatsApp."
  }'::jsonb)
on conflict (key) do nothing;

-- ============================================================
-- PASSO MANUAL 1: Criar o bucket de imagens
-- Vá em Storage > Create bucket > nome: "product-images" > marque "Public bucket" > Create
-- ============================================================

-- ============================================================
-- PASSO MANUAL 2: Criar seu usuário admin
-- 1. Vá em Authentication > Users > Add user > crie com seu e-mail e senha
-- 2. Depois rode este comando abaixo TROCANDO pelo seu e-mail:
-- ============================================================
-- insert into admin_users (email) values ('seuemail@exemplo.com');
