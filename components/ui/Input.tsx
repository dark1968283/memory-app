"use client";

import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-ink-primary placeholder:text-ink-secondary/70 outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.06]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-ink-primary placeholder:text-ink-secondary/70 outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.06] resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
