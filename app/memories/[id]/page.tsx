"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, Trash2, MapPin, CalendarDays } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MemoryCard } from "@/components/memories/MemoryCard";
import { useMemories } from "@/lib/utils/useMemories";
import { createClient } from "@/lib/supabase/client";
import { formatDatePt, formatMonthYear } from "@/lib/utils/date";
import { CATEGORY_LABELS } from "@/types";

export default function MemoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const { memories, loading, reload } = useMemories();

  const memory = memories.find((m) => m.id === params.id);

  const related = useMemo(() => {
    if (!memory) return [];
    const month = memory.date.slice(0, 7);
    return memories.filter((m) => m.id !== memory.id && m.date.slice(0, 7) === month).slice(0, 6);
  }, [memories, memory]);

  async function toggleFavorite() {
    if (!memory) return;
    await supabase.from("memories").update({ is_favorite: !memory.isFavorite } as never).eq("id", memory.id);
    reload();
  }

  async function handleDelete() {
    if (!memory) return;
    if (!confirm("Eliminar esta memória? Esta ação não pode ser desfeita.")) return;
    await supabase.storage.from("memories").remove([memory.storagePath]);
    await supabase.from("memories").delete().eq("id", memory.id);
    router.push("/memories");
  }

  if (loading) {
    return (
      <AppShell>
        <div className="pt-10 h-64 rounded-2xl bg-white/[0.04] animate-pulse" />
      </AppShell>
    );
  }

  if (!memory) {
    return (
      <AppShell>
        <div className="pt-16 text-center">
          <p className="font-serif text-xl">Memória não encontrada.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell onMemoryCreated={reload}>
      <div className="pt-8 sm:pt-10 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink-primary mb-6"
        >
          <ArrowLeft size={15} /> Voltar
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-accent text-xs mb-2">{CATEGORY_LABELS[memory.category]}</p>
          <h1 className="font-serif text-2xl sm:text-3xl mb-3">{memory.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-ink-secondary mb-6">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} /> {formatDatePt(memory.date)}
            </span>
            {memory.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {memory.location}
              </span>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden bg-bg-card mb-6">
            {memory.mediaType === "image" ? (
              <img src={memory.url} alt={memory.title} className="w-full h-auto" />
            ) : (
              <video src={memory.url} controls className="w-full h-auto" />
            )}
          </div>

          {memory.description && (
            <p className="text-ink-primary/90 leading-relaxed mb-6 font-serif text-lg italic">
              &ldquo;{memory.description}&rdquo;
            </p>
          )}

          <div className="flex gap-3 mb-12">
            <button
              onClick={toggleFavorite}
              className="flex items-center gap-2 text-sm rounded-full border border-white/10 px-4 py-2 text-ink-secondary hover:text-ink-primary"
            >
              <Heart size={15} className={memory.isFavorite ? "text-accent" : ""} fill={memory.isFavorite ? "currentColor" : "none"} />
              {memory.isFavorite ? "Favorito" : "Marcar favorito"}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm rounded-full border border-red-500/20 px-4 py-2 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={15} /> Eliminar
            </button>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="font-serif text-lg mb-4">
                Outras memórias de {formatMonthYear(memory.date)}
              </h2>
              <div className="masonry">
                {related.map((m) => (
                  <MemoryCard key={m.id} memory={m} onClick={() => router.push(`/memories/${m.id}`)} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
