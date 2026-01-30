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
import { NavLink } from "react-router-dom"

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Now Showing", url: "/showing", icon: Film },
  { title: "My Tickets", url: "/tickets", icon: Ticket },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { open, openMobile, isMobile, toggleSidebar, setOpenMobile } = useSidebar()

  const isOpen = isMobile ? openMobile : open

  // Logic to close sidebar on mobile after clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false) // This closes the mobile sheet
    }
  }

  return (
    <Sidebar 
      collapsible="none" 
      className={cn(
        "fixed top-0 left-0 z-[100] h-screen w-[280px] border-r bg-background shadow-2xl transition-transform duration-300 ease-in-out",
        !isOpen ? "-translate-x-full" : "translate-x-0"
      )}
    >
      <SidebarHeader className="h-16 flex flex-row items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-[10px] text-primary-foreground font-black shadow-sm">
            T
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">Ticket Ready</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <X className="h-4 w-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      onClick={handleLinkClick} // Trigger close on click
                      className={({ isActive }) => 
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full",
                          isActive ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
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