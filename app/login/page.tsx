"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou password incorretos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
            <Heart size={22} className="text-accent" fill="currentColor" />
          </div>
          <h1 className="font-serif text-3xl">Memory</h1>
          <p className="text-ink-secondary text-sm mt-2">
            Cada momento nosso merece ser lembrado.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-ink-secondary">ou</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          size="lg"
          onClick={handleGoogleLogin}
        >
          Continuar com Google
        </Button>

        <p className="text-center text-sm text-ink-secondary mt-8">
          Ainda não têm conta?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Criar espaço
          </Link>
        </p>

        <p className="flex items-center justify-center gap-1.5 text-xs text-ink-secondary/60 mt-10">
          🔒 As nossas memórias são privadas.
        </p>
      </motion.div>
    </main>
  );
}
