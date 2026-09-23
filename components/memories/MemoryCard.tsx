"use client";

import { motion } from "framer-motion";
import { Heart, PlayCircle } from "lucide-react";
import type { Memory } from "@/types";
import { formatDatePt } from "@/lib/utils/date";

export function MemoryCard({
  memory,
  onClick,
}: {
  memory: Memory;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="relative block w-full rounded-2xl overflow-hidden bg-bg-card text-left group"
    >
      {memory.mediaType === "video" ? (
        <div className="relative">
          <video src={memory.url} className="w-full h-auto object-cover" muted />
          <PlayCircle
            size={30}
            className="absolute inset-0 m-auto text-white drop-shadow"
          />
        </div>
      ) : (
        <img
          src={memory.url}
          alt={memory.title}
          loading="lazy"
          className="w-full h-auto object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      {memory.isFavorite && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
          <Heart size={13} className="text-accent" fill="currentColor" />
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs font-medium line-clamp-1">{memory.title}</p>
        <p className="text-white/70 text-[11px]">{formatDatePt(memory.date)}</p>
      </div>
    </motion.button>
  );
}
