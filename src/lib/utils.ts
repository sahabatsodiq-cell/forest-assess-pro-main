import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CompetencyStatus {
  label: "PAHAM" | "KURANG PAHAM" | "TIDAK PAHAM";
  badgeClass: string;
  dotClass: string;
  type: "PAHAM" | "KURANG_PAHAM" | "TIDAK_PAHAM";
}

export function getCompetencyStatus(score: number, passingGrade: number = 61): CompetencyStatus {
  const numScore = Number(score || 0);
  const numPassing = Number(passingGrade || 61);

  if (numScore >= numPassing) {
    return {
      label: "PAHAM",
      badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50",
      dotClass: "bg-emerald-500",
      type: "PAHAM",
    };
  } else if (numScore > 51) {
    return {
      label: "KURANG PAHAM",
      badgeClass: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50",
      dotClass: "bg-amber-500",
      type: "KURANG_PAHAM",
    };
  } else {
    return {
      label: "TIDAK PAHAM",
      badgeClass: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-700/50",
      dotClass: "bg-red-500",
      type: "TIDAK_PAHAM",
    };
  }
}

