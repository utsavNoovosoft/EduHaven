// Client/src/components/ui/button.jsx
import * as React from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Variants required by the issue:
 * - primary   → background uses theme token --btn; text is white (matches Timer card)
 * - secondary → text uses --txt; background is the same color with ~30% opacity
 * - danger    → red background; white text
 * Built-in framer-motion hover/tap interaction.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-[var(--btn)] hover:brightness-95 active:brightness-90 shadow-sm",
        secondary:
          "text-[var(--txt)] bg-[var(--txt)]/30 hover:bg-[var(--txt)]/40 active:bg-[var(--txt)]/50",
        danger:
          "text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

const motionByVariant = (v) => {
  switch (v) {
    case "secondary":
      return { whileHover: { y: -1, scale: 1.02 }, whileTap: { scale: 0.98 } };
    case "danger":
      return { whileHover: { y: -1, scale: 1.03 }, whileTap: { scale: 0.97 } };
    case "primary":
    default:
      return { whileHover: { y: -1, scale: 1.03 }, whileTap: { scale: 0.98 } };
  }
};

const Button = React.forwardRef(
  ({ className, variant = "primary", size, type = "button", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        {...motionByVariant(variant)}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
