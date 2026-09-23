"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (done) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-serif text-2xl mb-2">Quase lá 💌</h1>
          <p className="text-ink-secondary text-sm">
            Enviámos um email de confirmação para {email}.
          </p>
        </div>
      </main>
    );
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
          <h1 className="font-serif text-3xl">Criar o nosso espaço</h1>
          <p className="text-ink-secondary text-sm mt-2">
            Um lugar só para os dois.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <Input
            type="text"
            placeholder="O teu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            minLength={6}
            autoComplete="new-password"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Criar conta"}
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
          Já têm conta?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Entrar
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
