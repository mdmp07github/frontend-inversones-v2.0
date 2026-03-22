import Icons from "@/images/icons/icons"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

function getSystemTheme(): "dark" | "light" {
   return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
}

export function ModeToggle() {

   const { setTheme, theme } = useTheme()
   const effectiveTheme = theme === "system" ? getSystemTheme() : theme;

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant={effectiveTheme === "dark" ? "purple" : "yellow"} size="icon">
               {effectiveTheme === "dark" ? <Icons icon="moon" /> : <Icons icon="sun" />}
               <span className="sr-only">Toggle theme</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
               <Icons icon="sun" />
               Iluminado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
               <Icons icon="moon" />
               Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
               <Icons icon="monitor" />
               Sistema
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}