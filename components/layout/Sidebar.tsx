"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Images, BookHeart, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/memories", label: "Memórias", icon: Images },
  { href: "/favorites", label: "Favoritos", icon: Heart },
  { href: "/timeline", label: "Nossa História", icon: BookHeart },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-[100dvh] sticky top-0 border-r border-white/5 px-5 py-8">
      <div className="flex items-center gap-2 mb-10 px-2">
        <Heart size={18} className="text-accent" fill="currentColor" />
        <span className="font-serif text-lg">Memory</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04]"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
