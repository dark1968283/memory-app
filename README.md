# Memory — o vosso álbum privado

Álbum de memórias digital para casal, construído com Next.js 14, TypeScript, Tailwind CSS, Supabase e Framer Motion.

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar o Supabase

1. Cria um projeto em https://supabase.com
2. Vai a **Project Settings → API** e copia:
   - `Project URL`
   - `anon public key`
3. Cria o ficheiro `.env.local` na raiz (usa `.env.example` como modelo):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxx
```

### Migração da base de dados

No **SQL Editor** do Supabase, corre o conteúdo de:

```
supabase/migrations/0001_init.sql
```

Isto cria:
- Tabelas `profiles`, `couples`, `memories`
- Row Level Security (RLS) em todas as tabelas — cada casal só vê as suas memórias
- O bucket de Storage `memories` (**privado**, não público)
- Políticas de Storage — só membros do casal podem ler/escrever/apagar ficheiros
- Um trigger que cria automaticamente `profile` + `couple` quando alguém regista uma conta

### Ativar o login com Google

1. No Supabase: **Authentication → Providers → Google** → ativa
2. Na Google Cloud Console, cria credenciais OAuth 2.0 e adiciona como redirect URI:
   ```
   https://xxxx.supabase.co/auth/v1/callback
   ```
3. Copia o Client ID / Client Secret para o Supabase
4. Em **Authentication → URL Configuration**, adiciona `http://localhost:3000/auth/callback` e o domínio de produção

## 3. Correr localmente

```bash
npm run dev
```

Abre http://localhost:3000

## 4. Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Ou liga o repositório diretamente no dashboard da Vercel. Adiciona lá as mesmas duas variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) em **Project Settings → Environment Variables**.

Depois, em **Authentication → URL Configuration** no Supabase, adiciona o domínio de produção (`https://teu-dominio.vercel.app/auth/callback`) como redirect URL permitido.

## Estado atual (P0 implementado)

- Login (email/password) + Google OAuth
- Rotas protegidas (middleware)
- Dashboard com contador de relacionamento e memórias recentes
- Upload de fotos/vídeos → Supabase Storage (bucket privado, URLs assinadas)
- Galeria em masonry grid + Lightbox (favoritar, eliminar, navegar)
- Timeline "Nossa História" agrupada por ano
- Favoritos, filtros por categoria, pesquisa
- Página de memória individual
- Configurações (perfil, nome do casal, data de início, tema claro/escuro, logout)
- RLS completo + políticas de Storage
- Responsivo mobile-first, com bottom navigation e botão flutuante "+"

## Por implementar (P1, conforme o pedido original)

- Edição de memórias já criadas
- Upload múltiplo / drag-and-drop de vários ficheiros de uma vez
- Compressão/otimização adicional de imagens antes do upload
- Convite do segundo membro do casal (atualmente `partner_2` fica por preencher manualmente na tabela `couples`, ou via um fluxo de convite a construir)

## Nota técnica

O cliente Supabase (`lib/supabase/client.ts` e `server.ts`) não usa tipagem estrita via `Database` genérico — houve incompatibilidade de tipos entre as versões instaladas de `@supabase/ssr` e `@supabase/supabase-js`. Os tipos de domínio (`Memory`, `MemoryCategory`, etc.) continuam fortemente tipados em `types/`. `npm run build` corre sem erros de TypeScript.
