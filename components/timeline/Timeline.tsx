"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Memory } from "@/types";
import { CATEGORY_ICONS } from "@/types";
import { formatDatePt } from "@/lib/utils/date";

export function Timeline({ memories }: { memories: Memory[] }) {
  const byYear = memories.reduce<Record<string, Memory[]>>((acc, m) => {
    const year = m.date.slice(0, 4);
    acc[year] = acc[year] || [];
    acc[year].push(m);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  if (memories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-serif text-xl mb-2">A nossa história ainda não começou aqui.</p>
        <p className="text-ink-secondary text-sm">Adiciona a primeira memória para dar início à linha do tempo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {years.map((year) => (
        <div key={year} className="mb-10">
          <h2 className="font-serif text-2xl mb-6 text-ink-primary">{year}</h2>
          <div className="relative pl-8 sm:pl-10 border-l border-white/10 space-y-8">
            {byYear[year].map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="relative"
              >
                <span className="absolute -left-[calc(2rem+5px)] sm:-left-[calc(2.5rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
                <Link href={`/memories/${m.id}`} className="group flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-bg-card">
                    {m.mediaType === "image" ? (
                      <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.url} className="w-full h-full object-cover" muted />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-ink-secondary mb-0.5">
                      {CATEGORY_ICONS[m.category]} {formatDatePt(m.date)}
                      {m.location ? ` · ${m.location}` : ""}
                    </p>
                    <p className="font-medium text-sm group-hover:text-accent transition-colors">
                      {m.title}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
