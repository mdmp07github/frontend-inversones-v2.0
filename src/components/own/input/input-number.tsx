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
   allowInteger?: boolean
   maxInteger?: number
   maxDecimal?: number
   range?: {
      min?: number
      step?: number
      max?: number
   }
   fixed?: boolean
}

export default function InputNumber({
   form,
   name,
   loading = false,
   disable,
   binding,
   label,
   placeholder,
   info,
   allowInteger = false,
   maxInteger = 25,
   maxDecimal = 25,
   range,
   fixed = false
}:
   VDMInputProps) {

   const hasError = !!name && !!form.formState.errors[name]

   if (!name) return null

   const stepForKeyboard = range?.step || 1;

   const handleStepChange = (
      field: any,
      e: React.KeyboardEvent<HTMLInputElement>,
      direction: 1 | -1
   ) => {
      e.preventDefault();

      const value = e.currentTarget.value;

      // Usamos el paso fijo de 1 (stepForKeyboard) para el teclado
      const stepValue = stepForKeyboard;

      // 2. Limpiar y obtener el valor numérico
      // Si el valor está vacío o es solo "-", el punto de partida es 0.
      let numericValue = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
      if (value === "-" || value === "") {
         numericValue = 0;
      }

      // 3. Calcular el nuevo valor
      let newValue = numericValue + direction * stepValue;

      // Si se permiten solo enteros, forzar el redondeo
      if (allowInteger) {
         newValue = Math.round(newValue);
      }

      // 4. Aplicar límites (CORRECCIÓN CLAVE AQUÍ)
      if (range?.min !== undefined && newValue < range.min) {
         // Si el resultado de decrementar es MENOR que el mínimo,
         // establece el valor AL MÍNIMO, no lo ignores.
         newValue = range.min;
      }

      if (range?.max !== undefined && newValue > range.max) {
         // Si el resultado de incrementar es MAYOR que el máximo,
         // establece el valor AL MÁXIMO.
         newValue = range.max;
      }

      // 5. Actualizar el valor del campo
      field.onChange(String(newValue));
   };

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
                           {label}{binding ? <span className="text-[#ff6467]">*</span> : ""}
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
   } else {
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
                        <Input
                           type="text"
                           inputMode="decimal"   // <-- permite "-", ".", números
                           className={`${disable ? "pointer-events-none bg-neutral-100 dark:bg-input/10" : ""} ${label ? "" : "-mt-2"} ${hasError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                           placeholder={placeholder}
                           {...field}
                           step={allowInteger ? "any" : "1"}

                           onBlur={(e) => {
                              if (!fixed) return; // si no se usa fixed, salir

                              let v = e.target.value;

                              // Permitir vacío o solo "-"
                              if (v === "" || v === "-") return;

                              // Reparar puntos finales
                              if (v.endsWith(".")) v = v.slice(0, -1);

                              const num = parseFloat(v);
                              if (isNaN(num)) return;

                              // aplicar min-max antes del format
                              let numFinal = num;

                              if (range?.min !== undefined && numFinal < range.min) {
                                 numFinal = range.min;
                              }
                              if (range?.max !== undefined && numFinal > range.max) {
                                 numFinal = range.max;
                              }

                              // 🔥 Formato fijo
                              e.target.value = numFinal.toFixed(maxDecimal ?? 0);
                           }}

                           onKeyDown={(e) => {
                              // ----------------------------------------------------
                              // 1. PERMITIR TECLAS DE NAVEGACIÓN Y BORRADO
                              // ----------------------------------------------------
                              if (e.key === "Backspace" || e.key === "Delete" ||
                                 e.key === "ArrowLeft" || e.key === "ArrowRight" ||
                                 e.key === "Tab" || e.key === "Home" || e.key === "End") {
                                 return;
                              }

                              // ----------------------------------------------------
                              // 💥 1b. MANEJAR ARRIBA/ABAJO (STEP) 💥
                              // ----------------------------------------------------
                              if (e.key === "ArrowUp") {
                                 handleStepChange(field, e, 1); // Llama a la función para incrementar
                                 return;
                              }
                              if (e.key === "ArrowDown") {
                                 handleStepChange(field, e, -1); // Llama a la función para decrementar
                                 return;
                              }

                              // 2. bloquear letras (Tu lógica existente)
                              if (/[a-zA-Z]/.test(e.key)) {
                                 e.preventDefault();
                                 return;
                              }

                              // 3. permitir "-" solo al inicio (Tu lógica corregida)
                              if (e.key === "-") {
                                 const isCursorAtStart = e.currentTarget.selectionStart === 0;
                                 const hasMinusSign = e.currentTarget.value.includes("-");

                                 // 1. Si el cursor NO está al inicio O 
                                 // 2. Si ya hay un signo negativo,
                                 // Bloqueamos la acción por defecto (digitar el signo).
                                 if (!isCursorAtStart || hasMinusSign) {
                                    e.preventDefault();
                                    return;
                                 }

                                 // Si la condición pasa (cursor al inicio y no hay signo), se permite que se digite el "-".
                                 return;
                              }

                              if (e.key === ".") {
                                 // Si NO se permiten enteros (es decir, SÍ se permiten decimales), aplica la restricción de solo un punto.
                                 if (!allowInteger) {
                                    if (e.currentTarget.value.includes(".")) {
                                       e.preventDefault();
                                       return;
                                    }
                                    // Si aún no hay punto y no es solo entero, permite que el evento continúe para que el punto se digite
                                    return;
                                 }

                                 // Si allowInteger es TRUE, bloquea el punto (e.key === ".")
                                 e.preventDefault();
                                 return;
                              }
                           }}

                           onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              let v = e.currentTarget.value;

                              // Si termina en ".", se permite (para que el usuario escriba los decimales)
                              if (v.endsWith(".")) {
                                 return;
                              }

                              // -----------------------------------------------------
                              // 2) NORMALIZAR SIGNO "-"
                              // -----------------------------------------------------
                              // ... (Tu lógica existente para normalizar el signo)
                              const minusCount = (v.match(/-/g) || []).length;
                              if (minusCount > 1) {
                                 v = "-" + v.replace(/-/g, "");
                              }

                              if (v.includes("-") && v[0] !== "-") {
                                 v = "-" + v.replace(/-/g, "");
                              }

                              const isNegative = v.startsWith("-");
                              const clean = isNegative ? v.slice(1) : v;

                              // -----------------------------------------------------
                              // 3) SEPARAR ENTERA Y DECIMAL
                              // -----------------------------------------------------
                              let [entera, decimal] = clean.split(".");

                              if (!/^\d*$/.test(entera)) {
                                 entera = entera.replace(/\D/g, "");
                              }

                              if (decimal && !/^\d*$/.test(decimal)) {
                                 decimal = decimal.replace(/\D/g, "");
                              }

                              // -----------------------------------------------------
                              // 4) APLICAR LÍMITES
                              // -----------------------------------------------------
                              // ... (Tu lógica existente para aplicar límites)
                              if (entera && entera.length > maxInteger) {
                                 entera = entera.slice(0, maxInteger);
                              }

                              if (decimal && decimal.length > maxDecimal) {
                                 decimal = decimal.slice(0, maxDecimal);
                              }

                              // -----------------------------------------------------
                              // 5) RECONSTRUIR VALUE (💥 CORRECCIÓN AQUÍ 💥)
                              // -----------------------------------------------------
                              let finalValue = entera;

                              if (decimal !== undefined) {
                                 // Si hay decimal (escribió un punto)
                                 if (entera === "") {
                                    finalValue = "0"; // Si es ".5", la parte entera es 0
                                 }
                                 finalValue += "." + decimal;
                              } else if (entera === "") {
                                 finalValue = ""; // Permite el borrado total
                              }

                              if (isNegative && finalValue === "") {
                                 finalValue = "-"; // Si es negativo y el valor está vacío, permite solo "-"
                              } else if (isNegative) {
                                 finalValue = "-" + finalValue;
                              }

                              // ---------------------- 🔥 APLICAR min / max AQUÍ 🔥 ----------------------
                              if (range?.min !== undefined && finalValue !== "-" && finalValue !== "") {
                                 if (parseFloat(finalValue) < range.min) finalValue = String(range.min);
                              }

                              if (range?.max !== undefined && finalValue !== "-" && finalValue !== "") {
                                 if (parseFloat(finalValue) > range.max) finalValue = String(range.max);
                              }

                              e.currentTarget.value = finalValue;
                           }}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
      )
   }
}
