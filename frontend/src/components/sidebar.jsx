import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose, // Required to close sidebar on click
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Video, Ticket, Settings, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <Sheet>
      {/* Mobile Hamburger Trigger */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      {/* Sidebar Panel */}
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background border-r border-muted/50">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {/* Branding Link */}
            <SheetClose asChild>
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-[10px] text-primary-foreground font-black shadow-sm">
                  T
                </div>
                <span className="font-bold tracking-tight text-xl">Ticket Ready</span>
              </Link>
            </SheetClose>
          </SheetTitle>
          <SheetDescription className="text-xs">
            Manage your bookings and preferences.
          </SheetDescription>
        </SheetHeader>

        {/* Main Navigation Links */}
        <div className="flex flex-col gap-1">
          <SidebarLink to="/" icon={<Home size={18} />} label="Home" />
          <SidebarLink to="/showing" icon={<Video size={18} />} label="Now Showing" />
          <SidebarLink to="/tickets" icon={<Ticket size={18} />} label="My Tickets" />
          <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
        </div>

        <Separator className="my-6 opacity-50" />

        {/* Secondary Links */}
        <div className="flex flex-col gap-1">
          <SidebarLink to="/help" icon={<HelpCircle size={18} />} label="Help Center" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * SidebarLink Helper
 * Uses NavLink for automatic "active" styling and SheetClose to 
 * ensure the sidebar shuts when a user navigates.
 */
function SidebarLink({ icon, label, to }) {
  return (
    <SheetClose asChild>
      <NavLink to={to} className="w-full">
        {({ isActive }) => (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 h-10 font-normal transition-all ${
              isActive ? "text-primary font-semibold" : "text-muted-foreground"
            }`}
          >
            {icon}
            <span>{label}</span>
          </Button>
        )}
      </NavLink>
    </SheetClose>
  );
}