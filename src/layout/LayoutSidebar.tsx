import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import LayoutHeader from "./LayoutHeader"
import LayoutFooter from "./LayoutFooter"
import { Outlet } from "react-router-dom"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <div className="flex flex-col h-screen">
          <LayoutHeader />
          <main className="flex-1 p-4 bg-background overflow-hidden">
            <div className="bg-muted/50 w-full h-full rounded-md p-4 flex flex-col overflow-hidden">
              <div className="flex flex-col justify-start items-start ml-1 mt-1 min-w-0 scroll-shadcn">
                <Outlet />
              </div>
            </div>
          </main>
          <LayoutFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}