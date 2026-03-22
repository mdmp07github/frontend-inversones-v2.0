import * as React from "react"
import { Check, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover"

import { Command, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const MultiSelectContext = React.createContext<{
   value: string[]
   onChange: (values: string[]) => void
} | null>(null)

function MultiSelect({
   value,
   onChange,
   children,
}: {
   value: string[]
   onChange: (values: string[]) => void
   children: React.ReactNode
}) {
   const [open, setOpen] = React.useState(false)

   const injectProps = (node: React.ReactNode, insideContent = false): React.ReactNode => {
      if (!React.isValidElement(node)) return node

      const componentName = (node.type as any)?.displayName || (node.type as any)?.name || ''
      const isMultiSelectValue = componentName === 'MultiSelectValue'
      const isMultiSelectTrigger = componentName === 'MultiSelectTrigger'
      const isMultiSelectContent = componentName === 'MultiSelectContent'

      const { selectedValues: _sv, onChange: _oc, ...baseProps } = node.props

      if (node.props.children) {
         const nextInsideContent = insideContent || isMultiSelectContent
         const processedChildren = React.Children.map(node.props.children, (child) => injectProps(child, nextInsideContent))

         if (!insideContent && (isMultiSelectValue || isMultiSelectTrigger)) {
            const propsToInject: any = {
               ...baseProps,
               children: processedChildren,
            }
            if (isMultiSelectValue) {
               propsToInject.value = value
               propsToInject.onChange = onChange
            }
            if (isMultiSelectTrigger) {
               propsToInject.open = open
               propsToInject.setOpen = setOpen
               propsToInject.value = value
               propsToInject.onChange = onChange
            }
            return React.cloneElement(node, propsToInject)
         }

         return React.cloneElement(node, {
            ...baseProps,
            children: processedChildren,
         })
      }

      return React.cloneElement(node, baseProps)
   }

   return (
      <MultiSelectContext.Provider value={{ value, onChange }}>
         <Popover open={open} onOpenChange={setOpen}>
            {React.Children.map(children, (child) => injectProps(child, false))}
         </Popover>
      </MultiSelectContext.Provider>
   )
}

function MultiSelectTrigger({
   children,
   className,
   value,
   onChange,
   open,
   setOpen,
   ...props
}: any) {
   return (
      <PopoverTrigger asChild>
         <button
            type="button"
            className={cn(
               "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-[36px]",
               className
            )}
            {...props}
         >
            {children}
            <ChevronDownIcon className="w-4 h-4 opacity-50" />
         </button>
      </PopoverTrigger>
   )
}
MultiSelectTrigger.displayName = "MultiSelectTrigger"

function MultiSelectValue({
   value,
   placeholder,
   options,
   visibleCount = 1,
   children,
   open: _open,
   setOpen: _setOpen,
   onChange: _onChange,
}: any) {
   if (children) {
      return <>{children}</>
   }

   const valueArray = Array.isArray(value) ? value : (value ? [value] : [])

   if (!valueArray || valueArray.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>
   }

   if (!options || !Array.isArray(options)) {
      return <span className="text-muted-foreground">{placeholder}</span>
   }

   const selectedOptions = valueArray
      .map((v: any) => options.find((o: any) => o.value === v))
      .filter(Boolean)

   const visible = selectedOptions.slice(0, visibleCount)
   const hiddenCount = selectedOptions.length - visibleCount

   return (
      <div className="flex flex-wrap gap-1 items-center">
         {visible.map((item: any) => (
            <Badge key={item.value} variant="secondary">
               {item.label}
            </Badge>
         ))}

         {hiddenCount > 0 && (
            <span className="text-muted-foreground text-sm">
               +{hiddenCount} más
            </span>
         )}
      </div>
   )
}
MultiSelectValue.displayName = "MultiSelectValue"

function MultiSelectContent({ children, className, selectedValues: _selectedValues, onChange: _onChange, ...props }: any) {
   return (
      <PopoverContent className={cn("p-0 w-full min-w-[var(--radix-select-trigger-width)]", className)} {...props}>
         <Command>
            <CommandEmpty>No hay resultados</CommandEmpty>
            {children}
         </Command>
      </PopoverContent>
   )
}
MultiSelectContent.displayName = "MultiSelectContent"
MultiSelectContent.displayName = "MultiSelectContent"

function MultiSelectGroup({ children, selectedValues: _selectedValues, onChange: _onChange, ...props }: any) {
   return <CommandGroup {...props}>{children}</CommandGroup>
}
MultiSelectGroup.displayName = "MultiSelectGroup"

function MultiSelectLabel({ children }: any) {
   return (
      <div className="px-2 py-1 text-xs font-medium text-muted-foreground opacity-70">
         {children}
      </div>
   )
}
MultiSelectLabel.displayName = "MultiSelectLabel"

function MultiSelectItem({
   value,
   label,
   children,
   className,
   showCheckbox = true,
   variant
}: {
   value: string
   label?: string
   children?: React.ReactNode
   className?: string
   showCheckbox?: boolean
   variant?: "purple" | "blue" | "green" | "yellow" | "red" | "orange" | "black"
}) {
   const context = React.useContext(MultiSelectContext)
   if (!context) {
      return null
   }
   const values = context.value ?? []
   const handleChange = context.onChange

   const selected = values.includes(value)

   const toggle = () => {
      if (!handleChange) return
      if (value === "none") {
         handleChange([])
         return
      }
      if (selected) {
         handleChange(values.filter(v => v !== value))
      } else {
         handleChange([...values, value])
      }
   }

   const displayLabel = children || label || value

   return (
      <CommandItem
         value={value}
         onSelect={toggle}
         className={`flex items-center justify-between cursor-pointer ${className}`}
      >
         <div className="flex items-center gap-2">
            {showCheckbox && <Checkbox checked={selected} variant={variant} onCheckedChange={toggle} />}
            {displayLabel}
         </div>

         {showCheckbox && (
            <Check
               className={`w-4 h-4 transition-opacity text-neutral-700 dark:text-neutral-200 ${selected ? "opacity-70" : "opacity-0"
                  }`}
            />
         )}
      </CommandItem>
   )
}
MultiSelectItem.displayName = "MultiSelectItem"

export {
   MultiSelect,
   MultiSelectTrigger,
   MultiSelectValue,
   MultiSelectContent,
   MultiSelectGroup,
   MultiSelectLabel,
   MultiSelectItem,
}