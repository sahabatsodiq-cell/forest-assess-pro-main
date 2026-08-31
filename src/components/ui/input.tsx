import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-border bg-slate-50/80 px-3 py-1.5 text-xs text-charcoal shadow-2xs transition-all placeholder:text-muted-foreground focus-visible:border-forest-700 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus-visible:bg-zinc-900 dark:focus-visible:border-forest-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
