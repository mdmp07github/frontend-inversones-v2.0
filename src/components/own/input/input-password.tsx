import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Icons from "@/images/icons/icons"
import { useState } from "react"
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
}

export default function InputPassword({ form, name, loading = false, disable, binding, label, placeholder, info }: VDMInputProps) {

  const [valueEye, setValueEye] = useState(false)
  const hasError = !!name && !!form.formState.errors[name]

  if (!name) return null

  const on_click_eye = () => {
    if (valueEye) {
      setValueEye(false)
    } else {
      setValueEye(true)
    }
  }

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
                  {label}{binding ? <span className="text-[#ff6467]">*</span> : ""}
                </div>
              </FormLabel>)}
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    type="password"
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
  } else {
    return (
      <div className="relative w-full">
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
                <Input type={valueEye ? "text" : "password"}
                  className={`
                                 ${disable ? "pointer-events-none bg-neutral-100 dark:bg-input/10" : ""}
                                 ${hasError ? "border-destructive focus-visible:ring-destructive" : ""} ${label ? "" : "-mt-2"}
                              `}
                  placeholder={placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Icons icon={valueEye ? "eye-close" : "eye-open"} className={`absolute top-0 right-0 ${label ? "mt-[33.5px]" : "mt-[6.5px]"} ${info ? "mt-[33.5px]" : "mt-[6.5px]"} mr-2 hover:opacity-80 active:opacity-70 cursor-pointer ${disable ? "pointer-events-none opacity-70" : ""}`} onClick={() => on_click_eye()} />
      </div>
    )
  }
}
