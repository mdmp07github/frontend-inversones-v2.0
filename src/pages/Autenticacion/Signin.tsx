import { SigninForm } from "./Componente/SigninForm"
import imgPokeball from "../../images/images/pokeball.png"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
   return (
      <div className="grid min-h-svh lg:grid-cols-2">
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
                  <SigninForm />
               </div>
            </div>
         </div>
         <div className="bg-muted relative hidden lg:block">
            <img
               src="https://i.pinimg.com/736x/18/8e/a6/188ea685559ff1bd99001459e9a23985.jpg"
               alt="Image"
               className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
         </div>
      </div>
   )
}
