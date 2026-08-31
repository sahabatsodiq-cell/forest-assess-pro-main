import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  isLoading?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, isLoading = false, placeholder = "Cari data...", ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-border bg-slate-50/80 py-2 pl-9 pr-8 text-xs text-charcoal placeholder:text-muted-foreground transition-all focus:border-forest-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/20 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:bg-zinc-900 dark:focus:border-forest-500 shadow-2xs",
            className
          )}
          {...props}
        />
        {isLoading ? (
          <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : hasValue && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-slate-200 hover:text-charcoal dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors"
            title="Bersihkan pencarian"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
