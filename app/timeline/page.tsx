"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Timeline } from "@/components/timeline/Timeline";
import { useMemories } from "@/lib/utils/useMemories";

export default function TimelinePage() {
  const { memories, loading, reload } = useMemories();
  const sorted = [...memories].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <AppShell onMemoryCreated={reload} title="Nossa História" subtitle="Cada foto conta uma parte da nossa história.">
      {loading ? (
        <div className="space-y-4 max-w-2xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <Timeline memories={sorted} />
      )}
    </AppShell>
  );
}
