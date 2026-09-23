"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, Trash2, Info } from "lucide-react";
import { useState } from "react";
import type { Memory } from "@/types";
import { formatDatePt } from "@/lib/utils/date";
import { CATEGORY_LABELS } from "@/types";

interface LightboxProps {
  memories: Memory[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onToggleFavorite: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
}

export function Lightbox({
  memories,
  index,
  onClose,
  onNavigate,
  onToggleFavorite,
  onDelete,
}: LightboxProps) {
  const [showInfo, setShowInfo] = useState(false);
  const memory = memories[index];
  if (!memory) return null;

  const goNext = () => onNavigate((index + 1) % memories.length);
  const goPrev = () => onNavigate((index - 1 + memories.length) % memories.length);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "ArrowRight") goNext();
          if (e.key === "ArrowLeft") goPrev();
        }}
        tabIndex={-1}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
        >
          <button
            aria-label="Fechar"
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:bg-white/10"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-1">
            <button
              aria-label="Favorito"
              onClick={() => onToggleFavorite(memory)}
              className="p-2 rounded-full text-white/80 hover:bg-white/10"
            >
              <Heart
                size={19}
                className={memory.isFavorite ? "text-accent" : ""}
                fill={memory.isFavorite ? "currentColor" : "none"}
              />
            </button>
            <button
              aria-label="Informações"
              onClick={() => setShowInfo((v) => !v)}
              className="p-2 rounded-full text-white/80 hover:bg-white/10"
            >
              <Info size={19} />
            </button>
            <button
              aria-label="Eliminar"
              onClick={() => onDelete(memory)}
              className="p-2 rounded-full text-white/80 hover:bg-white/10"
            >
              <Trash2 size={19} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center px-2 overflow-hidden">
          <button
            aria-label="Anterior"
            onClick={goPrev}
            className="hidden sm:flex absolute left-3 p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={26} />
          </button>

          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="max-h-full max-w-full"
          >
            {memory.mediaType === "video" ? (
              <video
                src={memory.url}
                controls
                autoPlay
                className="max-h-[75dvh] max-w-full rounded-lg"
              />
            ) : (
              <img
                src={memory.url}
                alt={memory.title}
                className="max-h-[75dvh] max-w-full object-contain rounded-lg"
              />
            )}
          </motion.div>

          <button
            aria-label="Seguinte"
            onClick={goNext}
            className="hidden sm:flex absolute right-3 p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ChevronRight size={26} />
          </button>
        </div>

        <div className="sm:hidden flex justify-between px-8 pb-2">
          <button onClick={goPrev} className="p-3 text-white/70"><ChevronLeft size={22} /></button>
          <button onClick={goNext} className="p-3 text-white/70"><ChevronRight size={22} /></button>
        </div>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="px-6 pb-8 pt-2 text-white"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}
            >
              <p className="text-xs text-accent mb-1">{CATEGORY_LABELS[memory.category]}</p>
              <h3 className="font-serif text-lg mb-1">{memory.title}</h3>
              <p className="text-white/60 text-sm">
                {formatDatePt(memory.date)}
                {memory.location ? ` · ${memory.location}` : ""}
              </p>
              {memory.description && (
                <p className="text-white/80 text-sm mt-2">{memory.description}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
