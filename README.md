# Rapé da Floresta — Loja + Painel Admin

Loja pronta para publicar, com painel administrativo separado (login próprio) onde você edita
produtos, fotos, preços, origem e os textos da página inicial — sem mexer em código.

---

## O que você vai fazer, em ordem

1. Criar uma conta grátis no **Supabase** (banco de dados + fotos + login do admin)
2. Rodar um arquivo SQL pronto (cria as tabelas automaticamente)
3. Criar seu usuário administrador
4. Publicar o site no **Vercel** (grátis)
5. Testar tudo

Tempo estimado: 20–30 minutos, sem precisar escrever código.

---

## Passo 1 — Criar o projeto no Supabase

1. Acesse **https://supabase.com** e crie uma conta (dá para usar login do Google).
2. Clique em **New project**.
3. Escolha um nome (ex: `rape-da-floresta`), crie uma senha para o banco (guarde essa senha) e
   selecione a região mais próxima do Brasil (ex: `South America (São Paulo)`, se disponível).
4. Aguarde alguns minutos até o projeto ficar pronto.

## Passo 2 — Rodar o SQL que cria as tabelas

1. No menu lateral do Supabase, clique em **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo `supabase/schema.sql` (está dentro desta pasta que você recebeu), copie **todo o
   conteúdo** e cole no editor do Supabase.
4. Clique em **Run**. Isso cria todas as tabelas (produtos, categorias, fotos, textos da home,
   configurações da loja) já com as permissões de segurança corretas.

## Passo 3 — Criar o local onde as fotos ficam guardadas

1. No menu lateral, clique em **Storage**.
2. Clique em **Create bucket**.
3. Nome do bucket: `product-images` (exatamente assim, com hífen).
4. Marque a opção **Public bucket** (para as fotos aparecerem na loja).
5. Clique em **Create bucket**.

## Passo 4 — Criar seu usuário administrador

1. No menu lateral, clique em **Authentication** → **Users**.
2. Clique em **Add user** → **Create new user**.
3. Digite o e-mail e a senha que você vai usar para entrar no painel admin. Marque a opção para
   confirmar o e-mail automaticamente (**Auto Confirm User**), se aparecer.
4. Clique em **Create user**.
5. Volte no **SQL Editor**, abra uma **New query** e rode o comando abaixo, trocando pelo e-mail
   que você acabou de cadastrar:

```sql
insert into admin_users (email) values ('seuemail@exemplo.com');
```

Pronto — esse e-mail agora é o único autorizado a entrar em `/admin`. Você pode repetir esse
comando com outros e-mails no futuro, se quiser dar acesso a mais pessoas.

## Passo 5 — Pegar as chaves de conexão

1. No Supabase, vá em **Project Settings** (ícone de engrenagem) → **API**.
2. Copie dois valores:
   - **Project URL**
   - **anon public key**

Você vai usar os dois no próximo passo.

## Passo 6 — Publicar no Vercel

1. Acesse **https://vercel.com** e crie uma conta (pode ser com GitHub).
2. Suba esta pasta do projeto para um repositório no **GitHub** (crie um repositório novo e
   envie os arquivos — o Vercel também aceita arrastar a pasta diretamente em alguns fluxos, mas
   o mais confiável é via GitHub).
3. No Vercel, clique em **Add New → Project**, selecione o repositório.
4. Antes de publicar, clique em **Environment Variables** e adicione:

   | Nome | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | a Project URL que você copiou |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a anon public key que você copiou |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | seu número de WhatsApp, só números com DDI+DDD (ex: 5548999999999) |

5. Clique em **Deploy**. Em 1–2 minutos o site estará no ar em um link `.vercel.app`.
6. (Opcional) Em **Settings → Domains**, você pode conectar seu próprio domínio.

## Passo 7 — Testar

- Acesse o link do site: essa é a **loja pública**, para os clientes.
- Acesse `SEULINK.vercel.app/admin/login`: essa é a **área administrativa**, só para você,
  protegida por e-mail e senha.
- No admin, cadastre uma categoria, depois um produto, adicione fotos, defina a origem e o
  preço. Salve e veja aparecendo automaticamente na loja pública.
- Configure seu número de WhatsApp em **Configurações da loja** dentro do admin (isso substitui
  a variável de ambiente para todos os botões de compra do site).
- Teste o fluxo completo: adicionar produto ao carrinho → ir para o carrinho → preencher dados →
  clicar em "Finalizar pedido via WhatsApp" → confirmar que abre o WhatsApp com a mensagem
  correta.

---

## O que já está pronto

- **Loja pública**: home com hero, produtos em destaque, categorias, seção de origem, manifesto,
  listagem de produtos, página de produto com galeria e ficha de origem, carrinho, checkout via
  WhatsApp.
- **Painel admin** (`/admin`), separado da loja, com login próprio:
  - CRUD completo de produtos (nome, preço, promoção, estoque, peso, categoria, status
    ativo/pausado)
  - Upload de múltiplas fotos por produto, escolha de foto principal, reordenar, excluir
  - Campos de origem real (região, comunidade/povo, produtor, ingredientes, processo, história) —
    nada é preenchido automaticamente, só o que você digitar
  - Gerenciador de categorias
  - Edição dos textos da home (hero e manifesto) sem precisar mexer em código
  - Configurações da loja (WhatsApp, nome, Instagram, texto de entrega)
- Design com identidade amazônica (verde floresta, madeira, dourado), mobile-first, sem neon
  exagerado e sem estética indígena genérica ou inventada.

## O que você pode querer adicionar depois

- Fotografia real da floresta e dos produtos (o hero atual usa apenas gradiente e luz, de
  propósito — veja a nota abaixo sobre imagens).
- Uma seção de "Produtores" com fotos reais das comunidades parceiras, quando você tiver esse
  material.
- Um blog/editorial (a tabela `posts` já existe no banco, pronta para isso, mas as páginas ainda
  não foram construídas).
- Notificação por e-mail quando um pedido é gerado (hoje o fluxo é 100% via WhatsApp, como
  pedido).

### Nota importante sobre imagens

O hero da home foi construído só com gradientes, luz e textura em CSS — **sem foto de banco de
imagens genérica** — porque fotos de terceiros protegidas por direitos autorais não podem ser
usadas na sua loja sem licença. Quando você tiver fotografia própria (do produto, da floresta, dos
produtores), é só subir pelo painel admin em cada produto; para trocar a imagem de fundo do hero,
me avise que ajudo a plugar isso na Home.

---

## Rodando localmente (opcional, para quem tem Node.js instalado)

```bash
npm install
cp .env.local.example .env.local
# edite .env.local com suas chaves do Supabase
npm run dev
```

Acesse `http://localhost:3000`.
