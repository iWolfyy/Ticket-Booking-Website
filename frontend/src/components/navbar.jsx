import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Search, 
  Hexagon, 
  Clapperboard, 
  Trophy, 
  Drama, 
  Guitar 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar"; 
import { cn } from "@/lib/utils";
// CHANGED: Imported the correct ModeToggle component
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true); 
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Store the last scroll position to determine direction
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 1. GLASS EFFECT LOGIC
      // If we are not at the very top, enable the glass effect background
      setIsScrolled(currentScrollY > 10);

      // 2. SMART REVEAL LOGIC
      // Always show navbar if we are at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } 
      // If we are scrolling UP, show the navbar
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } 
      // If we are scrolling DOWN, hide the bottom part
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }

      // Update ref for next event
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Movies", icon: Clapperboard },
    { label: "Concerts", icon: Guitar },
    { label: "Sports", icon: Trophy },
    { label: "Theatre", icon: Drama },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex flex-col w-full transition-all duration-500 ease-in-out border-b",
        // Only apply glass effect and shadow when scrolled down
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-border/40" 
          : "bg-background border-border"
      )}
    >
      {/* --- TOP ROW (Always Visible) --- */}
      <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] h-16 items-center px-4 md:px-8 gap-4">
        
        {/* LEFT: Logo Section */}
        <div className="flex items-center gap-3 md:gap-4 justify-self-start">
          <SidebarTrigger className="hover:bg-accent/50 transition-colors" />
          <Separator orientation="vertical" className="h-6 hidden sm:block opacity-30" />
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transition-all">
              <Hexagon size={18} fill="currentColor" />
            </div>
            <span className="hidden lg:inline-block font-bold tracking-tight text-lg">Ticket Ready</span>
          </div>
        </div>

        {/* CENTER (DESKTOP): Navigation Buttons */}
        <nav className="hidden md:flex items-center justify-center">
          <div className="grid grid-cols-4 gap-4">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href="#" 
                className="group flex items-center justify-center gap-2.5 px-4 py-2 w-28 lg:w-32 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent/50 rounded-md"
              >
                <link.icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center justify-end space-x-2 md:space-x-4 justify-self-end">
          {/* CHANGED: Replaced AnimatedThemeToggler with ModeToggle */}
          <ModeToggle />
          
          <Button variant="ghost" size="icon" className="relative group hover:bg-accent/50 rounded-full hidden sm:flex">
            <Bell size={20} className="text-muted-foreground transition-colors group-hover:text-foreground" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background animate-pulse"></span>
          </Button>

          <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-border/50 transition-all cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Separator: Visible if top of page OR if bottom bar is visible */}
      {(isVisible || !isScrolled) && <Separator className="opacity-30" />}

      {/* --- BOTTOM ROW (Collapsible) --- */}
      <div className={cn(
        "flex items-center px-4 md:px-8 transition-all duration-500 ease-in-out overflow-hidden",
        // If !isVisible, collapse height and opacity. Otherwise show full height.
        !isVisible ? "h-0 opacity-0 pointer-events-none" : "h-14 md:h-12 bg-muted/20 opacity-100"
      )}>
        
        {/* MOBILE ONLY: Horizontal Categories */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto no-scrollbar w-full pr-4 py-2 mask-linear-fade">
          {navLinks.map((link) => (
             <button
               key={link.label}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border/60 text-xs font-medium whitespace-nowrap shadow-sm active:scale-95 transition-transform"
             >
               <link.icon size={14} />
               {link.label}
             </button>
          ))}
        </div>

        {/* DESKTOP ONLY: Secondary Links */}
        <nav className="hidden md:flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          {["Projects", "Sales", "Team", "Tasks", "Blog"].map((item) => (
            <a key={item} href="#" className="hover:text-foreground transition-colors duration-200">{item}</a>
          ))}
        </nav>

        {/* FLUID SEARCH: Mobile-Aware */}
        <div className="hidden md:flex ml-auto items-center gap-3">
          <div className={cn(
            "relative transition-all duration-500 ease-in-out",
            isSearchFocused ? "w-72" : "w-48"
          )}>
            <Input 
              type="text" 
              placeholder="Search everything..." 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="h-8 text-xs bg-background/40 border-border/50 transition-all" 
            />
          </div>
          <Button size="icon" className="h-8 w-8 rounded-md bg-foreground text-background">
            <Search size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}