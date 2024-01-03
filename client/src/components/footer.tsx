import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mt-auto flex items-center justify-center w-full bg-border/80 p-2 text-sm font-bold",
        className,
      )}
    >
      vi-word. 2024
    </div>
  );
}
