import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-4 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-sky-950 text-sky-50 [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        pending_approval:
          "border-transparent bg-yellow-400 text-black [a&]:hover:bg-yellow-400/90",
        refused:
          "border-transparent bg-red-700 text-red-50 [a&]:hover:bg-red-400/90",
        expired:
          "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-500/90",
        closed:
          "border-transparent bg-stone-300 text-black [a&]:hover:bg-stone-300/90",
        approved:
          "border-transparent bg-green-600 text-green-50 [a&]:hover:bg-green-600/90",
        payment_pending:
          "border-transparent bg-orange-600 text-orange-50 [a&]:hover:bg-orange-600/90",
        cancelled:
          "border-transparent bg-pink-700 text-pink-50 [a&]:hover:bg-pink-700/90",
        preferential:
          "border-transparent bg-sky-700 text-sky-50 [a&]:hover:bg-sky-700/90",
        incomplete:
          "border-transparent bg-violet-700 text-violet-50 [a&]:hover:bg-violet-700/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
