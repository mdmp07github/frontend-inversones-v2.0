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
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button, ButtonProps } from "../../ui/button"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { ButtonGroup } from "../../ui/button-group"
import { es } from "react-day-picker/locale"
import { Label } from "../../ui/label"
import { BrushCleaning } from "lucide-react"

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
  format?: string
  locale?: Partial<import("react-day-picker").Locale>
  type?: "single" | "range" | "multiple"
  variant?: ButtonProps["variant"]
  disableDays?: {
    day?: Date | string
    past?: boolean
    future?: boolean
    weekends?: boolean
  }
  disableRanges?: { from: Date | string; to: Date | string }[]
  enableRanges?: { from: Date | string; to: Date | string }[]
  disableSpecificDays?: (Date | string)[]
  enableSpecificDays?: (Date | string)[]
}

export default function InputPicker({
  form,
  name,
  loading = false,
  disable,
  binding,
  label,
  placeholder,
  info,
  format = "yyyy-mm-dd",
  type = "single",
  variant = "default",
  locale = es,
  disableDays = { day: new Date(), past: false, future: false, weekends: false },
  disableRanges = [],
  enableRanges = [],
  disableSpecificDays = [],
  enableSpecificDays = [],
}: VDMInputProps) {

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<any>() // puede ser Date | Date[] | { from: Date; to: Date }
  const [month, setMonth] = useState<Date | undefined>()
  const [inputText, setInputText] = useState("")
  const hasError = !!name && !!form.formState.errors[name]

  if (!name) return null

  const isDayDisabled = (day: Date) => {

    const base = disableDays.day ? toLocalDate(disableDays.day) : toLocalDate(new Date());

    const baseNum = toDateNumber(base);
    const dayNum = toDateNumber(day);

    if (disableDays.past && dayNum < baseNum) return true;

    if (disableDays.future && dayNum > baseNum) return true;

    if (disableDays.weekends) {
      const dow = day.getDay();
      if (dow === 0 || dow === 6) return true;
    }

    // 🚫 Deshabilitar varios rangos
    if (disableRanges && disableRanges.length > 0) {
      for (const range of disableRanges) {
        const fromNum = toDateNumber(toLocalDate(range.from));
        const toNum = toDateNumber(toLocalDate(range.to));
        if (dayNum >= fromNum && dayNum <= toNum) return true;
      }
    }

    // ✅ Solo habilitar dentro de los rangos permitidos (varios)
    if (enableRanges && enableRanges.length > 0) {
      let isInsideAnyRange = false;
      for (const range of enableRanges) {
        const fromNum = toDateNumber(toLocalDate(range.from));
        const toNum = toDateNumber(toLocalDate(range.to));
        if (dayNum >= fromNum && dayNum <= toNum) {
          isInsideAnyRange = true;
          break;
        }
      }
      // Si no está dentro de ningún rango permitido → deshabilitar
      if (!isInsideAnyRange) return true;
    }

    // 🚫 Deshabilitar días específicos (por ejemplo 2025-11-15, 2025-11-18, etc.)
    if (disableSpecificDays && disableSpecificDays.length > 0) {
      const currentNum = toDateNumber(day);
      for (const d of disableSpecificDays) {
        const dNum = toDateNumber(toLocalDate(d));
        if (currentNum === dNum) return true;
      }
    }

    // ✅ Solo habilitar días específicos
    if (enableSpecificDays && enableSpecificDays.length > 0) {
      const dayNum = toDateNumber(day);
      const isEnabled = enableSpecificDays.some((d) => toDateNumber(toLocalDate(d)) === dayNum);
      return !isEnabled; // si no está en la lista, deshabilita
    }

    return false;
  };

  function toLocalDate(d: Date | string): Date {

    if (typeof d === "string") {
      const [y, m, day] = d.split("-").map(Number);
      return new Date(y, m - 1, day);
    }
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function toDateNumber(d: Date): number {
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  useEffect(() => {
    const raw = form?.getValues(name)
    if (!raw) return
    if (type === "range" && raw?.from) {
      setDate({ from: new Date(raw.from), to: raw.to ? new Date(raw.to) : undefined })
    } else if (type === "multiple" && Array.isArray(raw)) {
      setDate(raw.map((d: any) => new Date(d)))
    } else {
      const initial = raw instanceof Date ? raw : new Date(raw)
      if (isValidDate(initial)) {
        setDate(initial)
        setMonth(initial)
      }
    }
  }, [form, name, type])

  useEffect(() => {
    if (type === "range") {
      if (!date?.from) return setInputText("")
      const from = formatDate(date.from)
      const to = date.to ? formatDate(date.to) : ""
      setInputText(to ? `${from} - ${to}` : from)
    } else if (type === "multiple") {
      if (!Array.isArray(date)) return setInputText("")
      setInputText(date.map((d: Date) => formatDate(d)).join(", "))
    } else {
      setInputText(formatDate(date))
    }
  }, [date, type])

  useEffect(() => {
    const defaultValue = form.getValues(name);

    if (!defaultValue) {
      setDate(undefined);
      setMonth(undefined);
      setInputText("");
      return;
    }

    if (type === "range") {
      setDate({
        from: defaultValue.from ? new Date(defaultValue.from) : undefined,
        to: defaultValue.to ? new Date(defaultValue.to) : undefined
      });
    } else if (type === "multiple") {
      setDate(defaultValue.map((d: any) => new Date(d)));
    } else {
      setDate(new Date(defaultValue));
      setMonth(new Date(defaultValue));
    }
  }, [form.formState]);

  function formatDate(date: Date | undefined) {

    if (!date) return ""
    const y = String(date.getFullYear())
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    if (format === "large") {
      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
      return `${dias[date.getDay()]} ${d} de ${meses[date.getMonth()]} del ${y}`
    }
    return format.replace("yyyy", y).replace("mm", m).replace("dd", d)
  }

  function isValidDate(date: Date | undefined) {
    return !!date && !isNaN(date.getTime())
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
                  {label}{binding ? <Label className="text-[#ff6467]">*</Label> : ""}
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

  return (
    <div className="w-full">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <div className={`${label ? "flex justify-between" : "flex justify-end"}`}>
              {label && (
                <FormLabel className="text-md -mb-1!">
                  <div className="flex gap-2">
                    {label}{binding ? <span className="text-[#ff6467]">*</span> : ""}
                  </div>
                </FormLabel>
              )}
              {info && (
                <Popover>
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
                </Popover>
              )}
            </div>

            <div className="relative">
              <FormControl>
                <ButtonGroup className="w-full">
                  <Input
                    className={`min-w-52 ${disable ? "pointer-events-none bg-neutral-100 dark:bg-input/10" : ""} ${label ? "" : "-mt-2"} ${hasError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    name={field.name}
                    ref={field.ref}
                    value={inputText || ""}
                    placeholder={placeholder}
                    readOnly={type !== "single"}
                    onChange={(e) => {
                      if (type !== "single") return
                      const nextDate = new Date(e.target.value)
                      setInputText(e.target.value)
                      if (isValidDate(nextDate)) {
                        field.onChange(nextDate)
                      } else {
                        field.onChange(undefined)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant={variant}
                    disabled={disable}
                    className={`${label ? "" : "-mt-2"}`}
                    onClick={() => {
                      setInputText("")
                      setDate(undefined)
                      field.onChange(undefined)
                    }}
                  >
                    <BrushCleaning />
                  </Button>
                </ButtonGroup>
              </FormControl>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    disabled={disable}
                    variant="ghost"
                    className={`absolute mr-8 z-10 ${label ? "top-1/2" : "top-2.5"} right-3 size-6 -translate-y-1/2`}
                  >
                    <CalendarIcon className="size-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="end" sideOffset={10}>
                  <Calendar
                    mode={type}
                    selected={date}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    locale={{ ...locale, options: { ...es.options, weekStartsOn: 0 } }}
                    onSelect={(selected: any) => {
                      setDate(selected)
                      field.onChange(selected)
                      if (type === "single") setOpen(false)
                    }}
                    {...(type === "range" ? { required: false } : {})}
                    disabled={isDayDisabled}
                    modifiersClassNames={{
                      booked: "[&>button]:line-through opacity-100",
                    }}
                    modifiers={{
                      booked: isDayDisabled,
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
