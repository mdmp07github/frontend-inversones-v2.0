import { Separator } from "@/components/ui/separator"

function LayoutFooter() {
   return (
      <footer className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-muted/50">
         <div className="flex items-center gap-2 px-4">
            <span>Footer 1</span>
            <Separator
               orientation="vertical"
               className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span>Footer 2</span>
         </div>
      </footer>
   )
}

export default LayoutFooter