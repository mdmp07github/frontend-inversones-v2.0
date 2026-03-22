import React, { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import Icons from "@/images/icons/icons"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Search } from "lucide-react"

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
   popoverAlign?: "start" | "center" | "end"
   onChange?: (value: string) => void;
}

export default function InputSingleSelect({
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
   popoverAlign = "start",
   onChange,
}: VDMInputProps) {

   const [strainer, setStrainer] = useState("")
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
                     {label && (<FormLabel className="flex justify-between text-md -mb-1!">
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
                     {label && <FormLabel className="text-md -mb-1!">
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
                     <Select
                        value={field.value || "none"}
                        onOpenChange={(open) => {
                           if (open) setTimeout(() => inputRef.current?.focus(), 50)
                        }}
                        onValueChange={(val) => {
                           if (val === "none") {
                              field.onChange("")
                              form.setValue(`${name}_des`, "")
                              return
                           }
                           field.onChange(val)
                           const selected = data
                              ?.flatMap((group) => group.options)
                              .find((opt) => opt.cod === val)
                           if (selected) {
                              form.setValue(`${name}_des`, selected.des)
                              setStrainer("")
                              if (onChange) onChange(val)
                           }
                        }}
                     >
                        <SelectTrigger
                           className={`hover:bg-input/40 w-full overflow-hidden text-ellipsis whitespace-nowrap ${label ? "" : "-mt-2"} ${disable
                              ? "pointer-events-none bg-neutral-100 dark:bg-input/10"
                              : ""
                              } ${hasError
                                 ? "border-destructive focus-visible:ring-destructive"
                                 : ""
                              }`}
                        >
                           <SelectValue placeholder={placeholder}>
                              {(() => {
                                 const selected = data
                                    ?.flatMap((group) => group.options)
                                    .find((opt) => opt.cod === field.value)
                                 return (
                                    <span className={`block truncate ${!selected && "opacity-50"} `}>
                                       {selected
                                          ? view === "both"
                                             ? `${selected.cod} - ${selected.des}`
                                             : view === "code"
                                                ? selected.cod
                                                : view === "desc"
                                                   ? selected.des
                                                   : selected.des
                                          : placeholder}
                                    </span>
                                 )
                              })()}
                           </SelectValue>
                        </SelectTrigger>

                        <SelectContent align={popoverAlign}
                           className="max-h-80 overflow-y-auto relative"
                           onKeyDownCapture={(e) => e.stopPropagation()}
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
                                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border! border-input!"
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

                           <SelectItem className="cursor-pointer hover:bg-input/50 data-[state=checked]:bg-input dark:hover:bg-input/20 dark:data-[state=checked]:bg-input/50 mt-1" value="none">
                              <span className="text-muted-foreground italic">— Sin seleccionar —</span>
                           </SelectItem>

                           {filteredData.length ? (
                              filteredData.map((group) => (
                                 <SelectGroup key={group.label}>
                                    {selGroup && (
                                       <SelectLabel className="mt-1 -mb-1">{group.label}</SelectLabel>
                                    )}
                                    {group.options.map((item) => (
                                       <SelectItem
                                          key={item.cod}
                                          value={item.cod}
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
                                       </SelectItem>
                                    ))}

                                 </SelectGroup>
                              ))
                           ) : (
                              <div className="p-3 text-center text-sm text-muted-foreground">
                                 No se encontraron resultados
                              </div>
                           )}
                        </SelectContent>

                     </Select>
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </div>
   )
}
