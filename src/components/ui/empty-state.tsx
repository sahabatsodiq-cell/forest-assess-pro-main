import * as React from "react";
import { LucideIcon, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/70 rounded-xl bg-slate-50/50 dark:bg-zinc-900/40 dark:border-zinc-800 space-y-3 my-2",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest-900 dark:bg-zinc-800 dark:text-forest-300 shadow-2xs border border-forest-900/10 dark:border-zinc-700">
        <Icon className="h-6 w-6" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="font-display text-sm font-bold text-charcoal dark:text-zinc-100">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
