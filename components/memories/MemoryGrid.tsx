"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Memory } from "@/types";
import { MemoryCard } from "./MemoryCard";
import { Lightbox } from "./Lightbox";
import { createClient } from "@/lib/supabase/client";

export function MemoryGrid({
  memories,
  onChanged,
  emptyMessage,
}: {
  memories: Memory[];
  onChanged: () => void;
  emptyMessage?: string;
}) {
  const supabase = createClient();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  async function toggleFavorite(memory: Memory) {
    await supabase
      .from("memories")
      .update({ is_favorite: !memory.isFavorite } as never)
      .eq("id", memory.id);
    onChanged();
  }

  async function deleteMemory(memory: Memory) {
    if (!confirm("Eliminar esta memória? Esta ação não pode ser desfeita.")) return;
    await supabase.storage.from("memories").remove([memory.storagePath]);
    await supabase.from("memories").delete().eq("id", memory.id);
    setActiveIndex(null);
    onChanged();
  }

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 px-6">
        <p className="font-serif text-xl mb-2">Ainda não existem memórias.</p>
        <p className="text-ink-secondary text-sm">
          {emptyMessage ?? "Vamos guardar o primeiro momento?"}
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="masonry"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.03 } } }}
      >
        {memories.map((m, i) => (
          <motion.div
            key={m.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <MemoryCard memory={m} onClick={() => setActiveIndex(i)} />
          </motion.div>
        ))}
      </motion.div>

      {activeIndex !== null && (
        <Lightbox
          memories={memories}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteMemory}
        />
      )}
    </>
  );
}
