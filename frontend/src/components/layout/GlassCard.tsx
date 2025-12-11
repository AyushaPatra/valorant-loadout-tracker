import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel p-6 animate-scale-in",
        hover && "transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,70,85,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
