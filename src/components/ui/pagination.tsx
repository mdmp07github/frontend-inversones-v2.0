import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, EllipsisIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
   return (
      <nav
         role="navigation"
         aria-label="pagination"
         data-slot="pagination"
         className={cn("mx-auto flex w-full", className)}
         {...props}
      />
   )
}

function PaginationContent({
   className,
   ...props
}: React.ComponentProps<"ul">) {
   return (
      <ul
         data-slot="pagination-content"
         className={cn("flex flex-row items-center gap-1", className)}
         {...props}
      />
   )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
   return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
   isActive?: boolean
   variant?: React.ComponentProps<typeof Button>["variant"]
} & Pick<React.ComponentProps<typeof Button>, "size"> &
   React.ComponentProps<"a">

function PaginationLink({
   className,
   isActive,
   size = "icon",
   variant,
   ...props
}: PaginationLinkProps) {
   return (
      <Button
         asChild
         variant={variant ?? (isActive ? "orange" : "black")}
         size={size}
         className={cn(className, isActive && "font-bold underline")}
      >
         <a
            aria-current={isActive ? "page" : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            {...props}
         />
      </Button>
   )
}

function PaginationPrevious({
   className,
   ...props
}: React.ComponentProps<typeof PaginationLink>) {
   return (
      <PaginationLink
         aria-label="Ir a la anterior página"
         size="default"
         variant="green"
         className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
         {...props}
      >
         <ChevronLeftIcon />
         <span className="hidden sm:block">Anterior</span>
      </PaginationLink>
   )
}

function PaginationNext({
   className,
   ...props
}: React.ComponentProps<typeof PaginationLink>) {
   return (
      <PaginationLink
         aria-label="Ir a la siguiente página"
         size="default"
         variant="green"
         className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
         {...props}
      >
         <span className="hidden sm:block">Siguiente</span>
         <ChevronRightIcon />
      </PaginationLink>
   )
}

const PaginationEllipsis = React.forwardRef<
   HTMLSpanElement,
   React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
   const [isHover, setIsHover] = React.useState(false)

   return (
      <span
         ref={ref}
         data-slot="pagination-ellipsis"
         className={cn("flex size-9 items-center justify-center", className)}
         {...props}
      >
         <Button size="icon" variant="purple" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            {isHover ? (
               <ChevronsRightIcon />
            ) : (
               <EllipsisIcon />
            )}
            <span className="sr-only">Más páginas</span>
         </Button>
      </span>
   )
})
PaginationEllipsis.displayName = "PaginationEllipsis"

const PaginationEllipsisLeft = React.forwardRef<
   HTMLSpanElement,
   React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
   const [isHover, setIsHover] = React.useState(false)

   return (
      <span
         ref={ref}
         data-slot="pagination-ellipsis"
         className={cn("flex size-9 items-center justify-center", className)}
         {...props}
      >
         <Button size="icon" variant="purple" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            {isHover ? (
               <ChevronsLeftIcon />
            ) : (
               <EllipsisIcon />
            )}
            <span className="sr-only">Más páginas</span>
         </Button>
      </span>
   )
})
PaginationEllipsisLeft.displayName = "PaginationEllipsisLeft"

const PaginationEllipsisRight = React.forwardRef<
   HTMLSpanElement,
   React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
   const [isHover, setIsHover] = React.useState(false)

   return (
      <span
         ref={ref}
         data-slot="pagination-ellipsis"
         className={cn("flex size-9 items-center justify-center", className)}
         {...props}
      >
         <Button size="icon" variant="purple" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            {isHover ? (
               <ChevronsRightIcon />
            ) : (
               <EllipsisIcon />
            )}
            <span className="sr-only">Más páginas</span>
         </Button>
      </span>
   )
})
PaginationEllipsisRight.displayName = "PaginationEllipsisRight"

export {
   Pagination,
   PaginationContent,
   PaginationLink,
   PaginationItem,
   PaginationPrevious,
   PaginationNext,
   PaginationEllipsis,
   PaginationEllipsisLeft,
   PaginationEllipsisRight,
}
