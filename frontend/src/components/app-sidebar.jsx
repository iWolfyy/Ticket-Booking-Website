import { Home, Settings, Ticket, Film, X } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Now Showing", url: "#", icon: Film },
  { title: "My Tickets", url: "#", icon: Ticket },
  { title: "Settings", url: "#", icon: Settings },
]

export function AppSidebar() {
  // FIX: Destructure 'isMobile' and 'openMobile' to handle phone state
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar()

  // Determine which state to use based on screen width
  const isOpen = isMobile ? openMobile : open

  return (
    <Sidebar 
      collapsible="none" 
      className={cn(
        "fixed top-0 left-0 z-[100] h-screen w-[280px] border-r bg-background shadow-2xl transition-transform duration-300 ease-in-out",
        // Logic: Use the unified 'isOpen' variable for the CSS class
        !isOpen ? "-translate-x-full" : "translate-x-0"
      )}
    >
      <SidebarHeader className="h-16 flex flex-row items-center justify-between border-b px-4">
        <span className="font-bold text-lg">Menu</span>
        {/* Close Button */}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <X className="h-4 w-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ticket.io</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}