"use client";

import { useEffect, useState } from "react";
import { LogOut, Loader2, Sun, Moon } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [coupleName, setCoupleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      setFullName(profile?.full_name ?? "");

      const { data: couple } = await supabase
        .from("couples")
        .select("id, name, start_date")
        .or(`partner_1.eq.${user.id},partner_2.eq.${user.id}`)
        .limit(1)
        .maybeSingle();
      if (couple) {
        setCoupleId(couple.id);
        setCoupleName(couple.name ?? "");
        setStartDate(couple.start_date ?? "");
      }

      const savedTheme = document.body.classList.contains("light") ? "light" : "dark";
      setTheme(savedTheme);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.body.classList.toggle("light", next === "light");
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: fullName } as never).eq("id", userId);
    if (coupleId) {
      await supabase
        .from("couples")
        .update({ name: coupleName || null, start_date: startDate || null } as never)
        .eq("id", coupleId);
    }
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <AppShell title="Configurações" subtitle="Personaliza o vosso espaço">
      {loading ? (
        <div className="h-48 rounded-2xl bg-white/[0.04] animate-pulse max-w-md" />
      ) : (
        <div className="max-w-md space-y-8">
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-ink-secondary">Perfil</h2>
            <Input placeholder="O teu nome" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-medium text-ink-secondary">O nosso casal</h2>
            <Input
              placeholder="Nome do casal — ex: Fernando & ..."
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
            />
            <div>
              <label className="text-xs text-ink-secondary block mb-1.5">
                Data em que tudo começou
              </label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-medium text-ink-secondary">Aparência</h2>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm rounded-full border border-white/10 px-4 py-2.5 text-ink-primary"
            >
              {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              {theme === "dark" ? "Modo escuro" : "Modo claro"}
            </button>
          </section>

          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? <Loader2 size={16} className="animate-spin" /> : "Guardar alterações"}
          </Button>

          <div className="pt-6 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
            >
              <LogOut size={15} /> Terminar sessão
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
