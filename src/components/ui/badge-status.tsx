import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "ACTIVE"
  | "INACTIVE"
  | "DRAFT"
  | "PUBLISHED"
  | "PASSED"
  | "FAILED"
  | "PENDING"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "USER"
  | string;

interface BadgeStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: string;
  showDot?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BadgeStatus({
  status,
  label,
  showDot = true,
  size = "md",
  className,
  ...props
}: BadgeStatusProps) {
  const normalized = (status || "").toString().toUpperCase();

  let styleClasses = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  let dotColor = "bg-gray-400";
  let displayLabel = label || normalized;

  switch (normalized) {
    case "ACTIVE":
    case "PUBLISHED":
    case "PASSED":
      styleClasses = "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50";
      dotColor = "bg-emerald-500 animate-pulse";
      if (!label) displayLabel = normalized === "ACTIVE" ? "Aktif" : normalized === "PASSED" ? "Lulus" : "Diterbitkan";
      break;

    case "INACTIVE":
    case "FAILED":
      styleClasses = "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50";
      dotColor = "bg-rose-500";
      if (!label) displayLabel = normalized === "INACTIVE" ? "Nonaktif" : "Tidak Lulus";
      break;

    case "DRAFT":
    case "PENDING":
      styleClasses = "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50";
      dotColor = "bg-amber-500 animate-pulse";
      if (!label) displayLabel = normalized === "DRAFT" ? "Draft" : "Menunggu";
      break;

    case "SUPER_ADMIN":
      styleClasses = "bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/50";
      dotColor = "bg-purple-500";
      if (!label) displayLabel = "Super Admin";
      break;

    case "ADMIN":
      styleClasses = "bg-blue-50 text-blue-800 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50";
      dotColor = "bg-blue-500";
      if (!label) displayLabel = "Admin";
      break;

    case "USER":
      styleClasses = "bg-teal-50 text-teal-800 border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/50";
      dotColor = "bg-teal-500";
      if (!label) displayLabel = "Peserta";
      break;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tracking-wide transition-all shadow-xs",
        sizeClasses[size],
        styleClasses,
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}
