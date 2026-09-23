"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, Heart, CalendarDays } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MemoryCard } from "@/components/memories/MemoryCard";
import { useMemories } from "@/lib/utils/useMemories";
import { formatDatePt, getRelationshipDuration } from "@/lib/utils/date";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const { memories, loading, reload } = useMemories();
  const supabase = createClient();
  const [startDate, setStartDate] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("couples")
        .select("start_date")
        .or(`partner_1.eq.${user.id},partner_2.eq.${user.id}`)
        .limit(1)
        .maybeSingle();
      setStartDate(data?.start_date ?? null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recent = memories.slice(0, 6);
  const lastDate = memories[0]?.date;

  const duration = useMemo(
    () => (startDate ? getRelationshipDuration(startDate) : null),
    [startDate]
  );

  return (
    <AppShell onMemoryCreated={reload}>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-8 sm:pt-10 mb-8"
      >
        <p className="text-accent text-sm mb-2 font-medium">MEMORY</p>
        <h1 className="font-serif text-3xl sm:text-4xl mb-2">Os nossos momentos</h1>
        <p className="text-ink-secondary text-sm max-w-md">
          Alguns momentos passam. Outros ficam para sempre.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <StatPill icon={<Camera size={14} />} label={`${memories.length} momentos`} />
          {duration && (
            <StatPill
              icon={<Heart size={14} fill="currentColor" />}
              label={`${duration.years > 0 ? `${duration.years} ano${duration.years > 1 ? "s" : ""} · ` : ""}${duration.totalDays} dias juntos`}
            />
          )}
          {lastDate && (
            <StatPill
              icon={<CalendarDays size={14} />}
              label={`Última memória: ${formatDatePt(lastDate)}`}
            />
          )}
        </div>
      </motion.section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg">Memórias recentes</h2>
          <Link href="/memories" className="text-xs text-accent hover:underline">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="masonry">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-xl mb-2">Ainda não existem memórias.</p>
            <p className="text-ink-secondary text-sm">Vamos guardar o primeiro momento?</p>
          </div>
        ) : (
          <div className="masonry">
            {recent.map((m) => (
              <div key={m.id}>
                <MemoryCard memory={m} onClick={() => (window.location.href = `/memories/${m.id}`)} />
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-ink-secondary bg-white/[0.04] border border-white/5 rounded-full px-3.5 py-1.5">
      <span className="text-accent">{icon}</span>
      {label}
    </div>
  );
}
