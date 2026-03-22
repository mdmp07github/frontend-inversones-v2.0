import { SignupForm } from "./Componente/SignupForm"
import imgPokeball from "../../images/images/pokeball.png"
import { ModeToggle } from "@/components/mode-toggle"

export default function SignupPage() {
  /* https://img.freepik.com/foto-gratis/analisis-datos-mercado-valores_23-2151937273.jpg?semt=ais_rp_progressive&w=740&q=80 */
   return (
      <div className="grid min-h-svh lg:grid-cols-2">
         <div className="bg-muted relative hidden lg:block">
            <img
               src="https://pbs.twimg.com/media/Ex0RcMsWQAgISv8.jpg:large"
               alt="Image"
               className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
         </div>
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-between gap-2">
               <a href="#" className="flex items-center gap-2 font-medium">
                  <div className="text-primary-foreground flex size-6 items-center justify-center">
                     <img src={imgPokeball} alt="Imagen Pokeball" />
                  </div>
                  PokeControl
               </a>
               <ModeToggle />
            </div>
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-md">
                  <SignupForm />
               </div>
            </div>
         </div>
      </div>
   )
}
