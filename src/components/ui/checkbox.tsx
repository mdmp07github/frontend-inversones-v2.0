import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const variants = {
   blue: `
    border bg-blue/30 border-blue hover:bg-blue/50 active:bg-blue/40
    dark:bg-blue/30 dark:border-blue dark:hover:bg-blue/40 dark:active:bg-blue/40
    data-[state=checked]:!bg-blue data-[state=checked]:border-blue
    data-[state=checked]:dark:text-blue-950 data-[state=checked]:text-white
  `,
   purple: `
    border bg-purple/30 border-purple hover:bg-purple/50 active:bg-purple/40
    dark:bg-purple/30 dark:border-purple dark:hover:bg-purple/40 dark:active:bg-purple/40
    data-[state=checked]:!bg-purple data-[state=checked]:border-purple
    data-[state=checked]:dark:text-purple-950 data-[state=checked]:text-white
  `,
   green: `
    border bg-green/30 border-green hover:bg-green/50 active:bg-green/40
    dark:bg-green/30 dark:border-green dark:hover:bg-green/40 dark:active:bg-green/40
    data-[state=checked]:!bg-green data-[state=checked]:border-green
    data-[state=checked]:dark:text-green-950 data-[state=checked]:text-white
  `,
   yellow: `
    border bg-yellow/30 border-yellow hover:bg-yellow/50 active:bg-yellow/40
    dark:bg-yellow/30 dark:border-yellow dark:hover:bg-yellow/40 dark:active:bg-yellow/40
    data-[state=checked]:!bg-yellow data-[state=checked]:border-yellow
    data-[state=checked]:dark:text-yellow-950 data-[state=checked]:text-white
  `,
   red: `
    border bg-red/30 border-red hover:bg-red/50 active:bg-red/40
    dark:bg-red/30 dark:border-red dark:hover:bg-red/40 dark:active:bg-red/40
    data-[state=checked]:!bg-red data-[state=checked]:border-red
    data-[state=checked]:dark:text-red-950 data-[state=checked]:text-white
  `,
   orange: `
    border bg-orange/30 border-orange hover:bg-orange/50 active:bg-orange/40
    dark:bg-orange/30 dark:border-orange dark:hover:bg-orange/40 dark:active:bg-orange/40
    data-[state=checked]:!bg-orange data-[state=checked]:border-orange
    data-[state=checked]:dark:text-orange-950 data-[state=checked]:text-white
  `,
   black: `
    border bg-black/30 border-black hover:bg-black/50 active:bg-black/40
    dark:bg-black/30 dark:border-black dark:hover:bg-black/40 dark:active:bg-black/40
    data-[state=checked]:!bg-black data-[state=checked]:border-black
    data-[state=checked]:dark:text-orange-950 data-[state=checked]:text-white
  `,
}

function Checkbox({
   className,
   variant,
   ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
   variant?: keyof typeof variants
}) {

   const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget
      const ripple = document.createElement("span")
      const diameter = Math.max(target.clientWidth, target.clientHeight)
      const radius = diameter / 2

      ripple.style.width = ripple.style.height = `${diameter}px`
      ripple.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`
      ripple.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`
      ripple.classList.add("ripple-checkbox")

      const existing = target.getElementsByClassName("ripple-checkbox")[0]
      if (existing) existing.remove()

      target.appendChild(ripple)
   }

   return (
      <CheckboxPrimitive.Root
         data-slot="checkbox"
         onClick={handleRipple}
         className={cn(
            "relative overflow-hidden peer border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-all outline-none focus-visible:ring-[3px]disabled:cursor-not-allowed disabled:opacity-50",
            variant && variants[variant],
            className
         )}
         {...props}
      >
         <CheckboxPrimitive.Indicator
            data-slot="checkbox-indicator"
            className="flex items-center justify-center text-current transition-none"
         >
            <CheckIcon className="size-3.5 text-current" />
         </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
   )
}

export { Checkbox }
