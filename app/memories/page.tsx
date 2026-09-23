"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MemoryGrid } from "@/components/memories/MemoryGrid";
import { useMemories } from "@/lib/utils/useMemories";
import { CATEGORY_LABELS } from "@/types";
import type { MemoryCategory } from "@/types/database";
import { cn } from "@/lib/utils/cn";

const FILTERS: { key: "todas" | "favoritas" | MemoryCategory; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "favoritas", label: "Favoritas ❤️" },
  { key: "viagem", label: "Viagens ✈️" },
  { key: "encontro", label: "Encontros ❤️" },
  { key: "passeio", label: "Passeios" },
  { key: "aniversario", label: "Aniversários" },
  { key: "outros", label: "Outros" },
];

export default function MemoriesPage() {
  const { memories, loading, reload } = useMemories();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("todas");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = memories;
    if (filter === "favoritas") list = list.filter((m) => m.isFavorite);
    else if (filter !== "todas") list = list.filter((m) => m.category === filter);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.location ?? "").toLowerCase().includes(q) ||
          (m.description ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [memories, filter, query]);

  return (
    <AppShell onMemoryCreated={reload} title="Memórias" subtitle={`${CATEGORY_LABELS.especial ? "" : ""}${memories.length} momentos guardados`}>
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar memórias..."
          className="w-full rounded-full bg-white/[0.04] border border-white/10 pl-11 pr-4 py-3 text-sm outline-none focus:border-accent/60"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition-colors",
              filter === f.key
                ? "bg-accent text-white border-accent"
                : "border-white/10 text-ink-secondary hover:text-ink-primary"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="masonry">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <MemoryGrid memories={filtered} onChanged={reload} />
      )}
    </AppShell>
  );
}
