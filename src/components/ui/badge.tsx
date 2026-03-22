import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
   "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
   {
      variants: {
         variant: {
            default:
               "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary:
               "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive:
               "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline:
               "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            purple: "border bg-purple/30 border-purple text-purple-900 dark:bg-purple/30 dark:border-purple dark:text-purple-300",
            blue: "border bg-blue/30 border-blue text-blue-900 dark:bg-blue/30 dark:border-blue dark:text-blue-300",
            green: "border bg-green/30 border-green text-green-900 dark:bg-green/30 dark:border-green dark:text-green-300",
            yellow: "border bg-yellow/30 border-yellow text-yellow-900 dark:bg-yellow/30 dark:border-yellow dark:text-yellow-300",
            red: "border bg-red/30 border-red text-red-900 dark:bg-red/30 dark:border-red dark:text-red-300",
            orange: "border bg-orange/30 border-orange text-orange-900 dark:bg-orange/30 dark:border-orange dark:text-orange-300",
            black: "border bg-black/30 border-black text-black-900 dark:bg-black/30 dark:border-black dark:text-black-300",
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
}: React.ComponentProps<"span"> &
   VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
   const Comp = asChild ? Slot : "span"

   return (
      <Comp
         data-slot="badge"
         className={cn(badgeVariants({ variant }), className)}
         {...props}
      />
   )
}

export { Badge, badgeVariants }
