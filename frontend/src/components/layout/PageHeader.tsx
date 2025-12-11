import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
      <div className="animate-slide-in-left">
        <h1 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wide text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="animate-fade-in-up">{action}</div>
      )}
    </div>
  );
}
