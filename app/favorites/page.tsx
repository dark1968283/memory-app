"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MemoryGrid } from "@/components/memories/MemoryGrid";
import { useMemories } from "@/lib/utils/useMemories";

export default function FavoritesPage() {
  const { memories, loading, reload } = useMemories();
  const favorites = useMemo(() => memories.filter((m) => m.isFavorite), [memories]);

  return (
    <AppShell
      onMemoryCreated={reload}
      title="Nossos favoritos ❤️"
      subtitle="Os momentos que guardámos com mais carinho"
    >
      {loading ? (
        <div className="masonry">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <MemoryGrid
          memories={favorites}
          onChanged={reload}
          emptyMessage="Marca uma memória com ❤️ para a veres aqui."
        />
      )}
    </AppShell>
  );
}
