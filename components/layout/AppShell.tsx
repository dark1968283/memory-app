"use client";

import { ReactNode, useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { AddMemoryModal } from "@/components/memories/AddMemoryModal";

export function AppShell({
  children,
  onMemoryCreated,
  title,
  subtitle,
}: {
  children: ReactNode;
  onMemoryCreated?: () => void;
  title?: string;
  subtitle?: string;
}) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar />
      <div className="flex-1 min-w-0">
        {(title || subtitle) && (
          <header className="px-5 sm:px-8 pt-8 sm:pt-10 pb-4 flex items-center justify-between">
            <div>
              {title && <h1 className="font-serif text-2xl sm:text-3xl">{title}</h1>}
              {subtitle && <p className="text-ink-secondary text-sm mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="hidden lg:inline-flex items-center gap-2 rounded-full bg-accent text-white px-5 py-2.5 text-sm font-medium hover:bg-accent-dim transition-colors shadow-soft"
            >
              <Plus size={16} /> Adicionar memória
            </button>
          </header>
        )}
        <main className="px-5 sm:px-8 pb-28 lg:pb-12">{children}</main>
      </div>

      <BottomNav onAdd={() => setAddOpen(true)} />

      <AddMemoryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => onMemoryCreated?.()}
      />
    </div>
  );
}
