import React, { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Search, X } from "lucide-react"
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import {
   MultiSelect,
   MultiSelectContent,
   MultiSelectGroup,
   MultiSelectItem,
   MultiSelectLabel,
   MultiSelectTrigger,
   MultiSelectValue,
} from "@/components/ui/multi-select"
import Icons from "@/images/icons/icons"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"

interface VDMInputProps {
   form?: any
   name?: string
   loading?: boolean
   disable?: boolean
   binding?: boolean
   label?: string
   placeholder?: string
   info?: {
      width?: "sm" | "md" | "lg" | string
      data?: {
         info: string
      }[]
   }
   selGroup?: boolean
   selIcon?: boolean
   selCode?: boolean
   view?: "both" | "code" | "desc",
   filter?: boolean
   data?: Array<{
      label: string
      options: Array<{
         cod: string
         des: string
         ico?: React.ReactElement
      }>
   }>
   maxVisible?: number
   popoverAlign?: "start" | "center" | "end"
   variant?: "blue" | "purple" | "green" | "yellow" | "red" | "orange" | "black"
}

export default function InputMultiSelect({
   form,
   name,
   loading = false,
   disable,
   binding,
   label,
   placeholder,
   info,
   selGroup,
   selIcon,
   selCode,
   view,
   filter,
   data,
   maxVisible = 2,
   popoverAlign = "start",
   variant
}: VDMInputProps) {

   const [strainer, setStrainer] = useState("") // Estado de filtro
   const inputRef = useRef<HTMLInputElement>(null)
   const hasError = !!name && !!form.formState.errors[name]

   if (!name) return null

   if (loading) {
      return (
         <div className="w-full">
            <FormField
               control={form.control}
               name={name}
               render={({ field }) => (
                  <FormItem>
                     {label && (<FormLabel className="flex justify-between text-md !-mb-1">
                        <div className="flex gap-2">
                           {label}
                           {binding && <span className="text-[#ff6467]">*</span>}
                        </div>
                     </FormLabel>)}
                     <FormControl>
                        <InputGroup>
                           <InputGroupInput
                              className={disable ? "pointer-events-none bg-neutral-100 dark:bg-input/10" : ""}
                              placeholder={loading ? "Cargando..." : placeholder}
                              disabled={loading}
                              clear={loading}
                              {...field}
                           />
                           {loading && (
                              <InputGroupAddon align="inline-end">
                                 <Spinner className="size-5 text-purple-500" />
                              </InputGroupAddon>
                           )}
                        </InputGroup>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
      )
   }

   let filteredData: Array<{
      label: string
      options: Array<{
         cod: string
         des: string
         ico?: React.ReactElement
      }>
   }> = []
   if (data) {
      const term = strainer.toLowerCase()
      filteredData = data
         .map((group) => ({
            ...group,
            options: group.options.filter(
               (opt) =>
                  opt.des.toLowerCase().includes(term) ||
                  opt.cod.toLowerCase().includes(term)
            ),
         }))
         .filter((g) => g.options.length > 0)
   }

   return (
      <div className="w-full">
         <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
               <FormItem>
                  <div className={`${label ? "flex justify-between" : "flex justify-end"}`}>
                     {label && <FormLabel className="text-md !-mb-1">
                        <div className="flex gap-2">
                           {label}{binding ? <span className="text-[#ff6467]">*</span> : ""}
                        </div>
                     </FormLabel>}
                     {info && <Popover>
                        <PopoverTrigger asChild>
                           <Icons icon="info1" className={`"hover:opacity-80 active:opacity-70 h-4 cursor-pointer " ${label ? "" : "mb-3"}`} />
                        </PopoverTrigger>
                        <PopoverContent className={`mt-1 mx-3 ${info.width === "md" ? "w-64" : info.width === "lg" ? "w-80" : "w-48"}`}>
                           <div className="flex flex-col gap-2">
                              <span className="font-bold underline flex gap-1"><Icons icon="info1" /> Información</span>
                              {info.data?.map((item, idx) => (
                                 <span key={idx} className="text-xs">
                                    • {item.info}
                                 </span>
                              ))}
                           </div>
                        </PopoverContent>
                     </Popover>}
                  </div>
                  <FormControl>
                     <MultiSelect
                        value={Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])}
                        onChange={(val) => {

                           if (!Array.isArray(val)) {
                              field.onChange([])
                              form.setValue(`${name}_des`, "")
                              return
                           }

                           const filteredVal = val.filter(v => v !== "none")

                           if (filteredVal.length === 0) {
                              field.onChange([])
                              form.setValue(`${name}_des`, "")
                              return
                           }

                           field.onChange(filteredVal)

                           const selectedItems = data
                              ?.flatMap((group) => group.options)
                              .filter((opt) => filteredVal.includes(opt.cod))

                           if (selectedItems && selectedItems.length > 0) {
                              const descriptions = selectedItems.map(item => item.des).join(", ")
                              form.setValue(`${name}_des`, descriptions)
                              setStrainer("")
                           }
                        }}
                     >
                        <MultiSelectTrigger
                           className={`hover:bg-input/40 w-full overflow-hidden text-ellipsis whitespace-nowrap ${label ? "" : "-mt-2"} ${disable
                              ? "pointer-events-none bg-neutral-100 dark:bg-input/10"
                              : ""
                              } ${hasError
                                 ? "border-destructive focus-visible:ring-destructive"
                                 : ""
                              } ${disable && "opacity-95"}`}
                        >
                           <MultiSelectValue placeholder={placeholder} visibleCount={0}>
                              {(() => {
                                 const valueArray = Array.isArray(field.value)
                                    ? field.value
                                    : field.value
                                       ? [field.value]
                                       : [];

                                 if (valueArray.length === 0) {
                                    return (
                                       <span className="block truncate opacity-50">
                                          {placeholder}
                                       </span>
                                    );
                                 }

                                 const selectedItems =
                                    data
                                       ?.flatMap((g) => g.options)
                                       .filter((opt) => valueArray.includes(opt.cod)) || [];

                                 const firstTwo = selectedItems.slice(0, maxVisible);
                                 const extraCount = selectedItems.length - maxVisible;

                                 return (
                                    <div className="flex items-center gap-1 -ml-2 overflow-hidden">
                                       {firstTwo.map((item) => (
                                          <div
                                             key={item.cod}
                                             className="flex gap-1 items-center px-2 py-1 rounded-xl border border-input text-xs max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis"
                                          >
                                             <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                                                {view === "both"
                                                   ? `${item.cod} - ${item.des}`
                                                   : view === "code"
                                                      ? item.cod
                                                      : item.des}
                                             </span>

                                             <span
                                                role="button"
                                                tabIndex={0}
                                                className="hover:opacity-80 active:opacity-70 cursor-pointer inline-flex items-center"
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   const newValues = valueArray.filter((v) => v !== item.cod);

                                                   field.onChange(newValues);

                                                   const updated = selectedItems
                                                      .filter((i) => i.cod !== item.cod)
                                                      .map((i) => i.des)
                                                      .join(", ");

                                                   form.setValue(`${name}_des`, updated);
                                                }}
                                                onKeyDown={(e) => {
                                                   if (e.key === 'Enter' || e.key === ' ') {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      const newValues = valueArray.filter((v) => v !== item.cod);
                                                      field.onChange(newValues);
                                                      const updated = selectedItems
                                                         .filter((i) => i.cod !== item.cod)
                                                         .map((i) => i.des)
                                                         .join(", ");
                                                      form.setValue(`${name}_des`, updated);
                                                   }
                                                }}
                                             >
                                                <X />
                                             </span>
                                          </div>
                                       ))}

                                       {extraCount > 0 && (
                                          <div className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs border shrink-0">
                                             +{extraCount} más
                                          </div>
                                       )}
                                    </div>
                                 );
                              })()}
                           </MultiSelectValue>
                        </MultiSelectTrigger>

                        <MultiSelectContent align={popoverAlign}
                           className="max-h-80 overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                           onKeyDownCapture={(e: React.KeyboardEvent) => e.stopPropagation()}
                        >
                           {filter && <div
                              className="px-1 py-2 sticky top-0 bg-background dark:bg-[#18181B] border-b z-50"
                              onKeyDownCapture={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              style={{ position: "sticky", top: 0, zIndex: 50 }}
                           >
                              <div className="flex items-center gap-2 mx-1">
                                 <Search className="opacity-50" />
                                 <Input
                                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none !border !border-input"
                                    ref={inputRef}
                                    value={strainer}
                                    onChange={(e) => setStrainer(e.target.value)}
                                    placeholder="Buscar..."
                                    autoFocus
                                    onFocus={(e) => e.stopPropagation()}
                                    onBlur={() => {
                                       requestAnimationFrame(() => {
                                          if (document.activeElement !== inputRef.current) {
                                             inputRef.current?.focus()
                                          }
                                       })
                                    }}
                                 />
                              </div>
                           </div>}

                           <MultiSelectItem
                              className={`mx-1 cursor-pointer hover:bg-input/50 data-[state=checked]:bg-input dark:hover:bg-input/20 dark:data-[state=checked]:bg-input/50 mt-1 ${selGroup ? "" : "ml-1"} mb-1`}
                              value="none"
                              showCheckbox={false}
                           >
                              <span className="text-muted-foreground italic">— Sin seleccionar —</span>
                           </MultiSelectItem>

                           {filteredData.length ? (
                              filteredData.map((group) => (
                                 <MultiSelectGroup className={`${selGroup ? "" : "-mt-2"}`} key={group.label}>
                                    {selGroup && (
                                       <MultiSelectLabel className="-mb-2">{group.label}</MultiSelectLabel>
                                    )}
                                    {group.options.map((item) => (
                                       <MultiSelectItem
                                          key={item.cod}
                                          value={item.cod}
                                          variant={variant}
                                          className="cursor-pointer hover:bg-input/50 data-[state=checked]:bg-input dark:hover:bg-input/20 dark:data-[state=checked]:bg-input/50 mt-1"
                                       >
                                          <div className="flex gap-1 items-center">
                                             {selIcon && (
                                                <div className="border p-1 rounded-full text-center">
                                                   {item.ico}
                                                </div>
                                             )}
                                             <div className="flex flex-col">
                                                {selCode && <span>{item.cod}</span>}
                                                <span
                                                   className={`${selCode ? "text-xs text-muted-foreground" : ""}`}
                                                >
                                                   {item.des}
                                                </span>
                                             </div>
                                          </div>
                                       </MultiSelectItem>
                                    ))}

                                 </MultiSelectGroup>
                              ))
                           ) : (
                              <div className="p-3 text-center text-sm text-muted-foreground">
                                 No se encontraron resultados
                              </div>
                           )}
                        </MultiSelectContent>
                     </MultiSelect>
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </div>
   )
}
