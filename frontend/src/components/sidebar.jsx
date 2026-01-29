import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Video, Ticket, Settings, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  return (
    <Sheet>
      {/* The Hamburger Menu Trigger */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      {/* The Sidebar Content */}
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background border-r">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="bg-black text-white p-1 rounded-md dark:bg-white dark:text-black">
              <Ticket size={20} />
            </div>
            TICKET.IO
          </SheetTitle>
          <SheetDescription>
            Manage your bookings and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-1">
          <SidebarLink icon={<Home size={18} />} label="Home" active />
          <SidebarLink icon={<Video size={18} />} label="Now Showing" />
          <SidebarLink icon={<Ticket size={18} />} label="My Tickets" />
          <SidebarLink icon={<Settings size={18} />} label="Settings" />
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-1">
          <SidebarLink icon={<HelpCircle size={18} />} label="Help Center" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper component for links
function SidebarLink({ icon, label, active }) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start gap-3 h-10 font-normal"
    >
      {icon}
      {label}
    </Button>
  );
}