import * as React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  breadcrumbs?: BreadcrumbItem[];
  badgeText?: string | number;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs = [],
  badgeText,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-3", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/admin" className="hover:text-forest-900 dark:hover:text-forest-300 transition-colors font-medium">
            Admin
          </Link>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              {item.to ? (
                <Link to={item.to} className="hover:text-forest-900 dark:hover:text-forest-300 transition-colors font-medium">
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-charcoal dark:text-forest-100">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-900/10 text-forest-900 shadow-xs border border-forest-900/15 dark:bg-forest-900/40 dark:text-forest-300 dark:border-forest-700/50">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl font-bold tracking-tight text-charcoal dark:text-forest-50">
                {title}
              </h1>
              {badgeText !== undefined && (
                <span className="inline-flex items-center rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-bold text-forest-900 dark:bg-forest-950 dark:text-forest-300 border border-forest-700/20">
                  {badgeText}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">{actions}</div>}
      </div>
    </div>
  );
}
