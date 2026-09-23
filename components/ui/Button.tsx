"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]",
          variant === "primary" &&
            "bg-accent text-white hover:bg-accent-dim shadow-soft",
          variant === "secondary" &&
            "bg-white/[0.06] text-ink-primary hover:bg-white/[0.1] border border-white/10",
          variant === "ghost" &&
            "bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-white/[0.05]",
          variant === "danger" &&
            "bg-red-500/10 text-red-400 hover:bg-red-500/20",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
