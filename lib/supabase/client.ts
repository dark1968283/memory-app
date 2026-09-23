import { createBrowserClient } from "@supabase/ssr";

// Tipagem forte via Database causa incompatibilidades entre as versões
// instaladas de @supabase/ssr e @supabase/supabase-js (mismatch de generics).
// O cliente fica sem tipagem estrita; os tipos de domínio (Memory, etc.)
// continuam a viver em types/index.ts e types/database.ts para o resto do app.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
