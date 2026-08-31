import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold cursor-pointer transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] active:translate-y-0 hover:-translate-y-0.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-forest-900 text-white shadow-xs hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-500 border border-transparent",
        secondary:
          "bg-forest-100 text-forest-900 border border-forest-700/20 hover:bg-forest-50 dark:bg-forest-950 dark:text-forest-200 dark:border-forest-700/40 dark:hover:bg-forest-900/60",
        outline:
          "border border-border bg-white text-charcoal shadow-2xs hover:bg-forest-50 hover:text-forest-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
        destructive:
          "bg-rose-600 text-white shadow-xs hover:bg-rose-700 dark:bg-rose-900 dark:hover:bg-rose-800 border border-transparent",
        gold:
          "bg-earth-500 text-white shadow-xs hover:bg-earth-400 dark:bg-earth-500 dark:hover:bg-earth-400 border border-transparent font-bold",
        ghost:
          "text-charcoal hover:bg-forest-50 hover:text-forest-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        link:
          "text-forest-900 underline-offset-4 hover:underline dark:text-forest-300 p-0 h-auto font-normal hover:translate-y-0 active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-6 text-sm font-bold",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-current shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
