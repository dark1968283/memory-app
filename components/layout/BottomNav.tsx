"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Images, Heart, BookHeart, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/memories", icon: Images, label: "Memórias" },
  { href: "__fab__", icon: Plus, label: "Adicionar" },
  { href: "/favorites", icon: Heart, label: "Favoritos" },
  { href: "/timeline", icon: BookHeart, label: "História" },
];

export function BottomNav({ onAdd }: { onAdd: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass-card border-t border-white/5 px-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-between px-2 py-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          if (href === "__fab__") {
            return (
              <button
                key="fab"
                aria-label="Adicionar memória"
                onClick={onAdd}
                className="w-12 h-12 -mt-6 rounded-full bg-accent text-white flex items-center justify-center shadow-soft active:scale-95 transition-transform"
              >
                <Icon size={22} />
              </button>
            );
          }
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-xl",
                active ? "text-accent" : "text-ink-secondary"
              )}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
