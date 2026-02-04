import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Search, 
  Hexagon, 
  Clapperboard, 
  Trophy, 
  Drama, 
  Guitar,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar"; 
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; //

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth(); //
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true); 
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY < 10 || currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Movies", icon: Clapperboard, to: "/movies" },
    { label: "Concerts", icon: Guitar, to: "/concerts" },
    { label: "Sports", icon: Trophy, to: "/sports" },
    { label: "Theatre", icon: Drama, to: "/theatre" },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex flex-col w-full transition-all duration-500 ease-in-out border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-border/80" 
          : "bg-background border-border"
      )}
    >
      {/* TOP SECTION */}
      <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] h-16 items-center px-4 md:px-8 gap-4">
        
        <div className="flex items-center gap-3 md:gap-4 justify-self-start">
          <SidebarTrigger className="hover:bg-accent/50 transition-colors" />
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transition-all">
              <Hexagon size={18} fill="currentColor" />
            </div>
            <span className="hidden lg:inline-block font-bold tracking-tight text-lg">Ticket Ready</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center">
          <div className="grid grid-cols-4 gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                to={link.to || "#"} 
                className="group flex items-center justify-center gap-2.5 px-4 py-2 w-28 lg:w-32 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent/50 rounded-md"
              >
                <link.icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center justify-end space-x-2 md:space-x-4 justify-self-end">
          <ModeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative group hover:bg-accent/50 rounded-full hidden sm:flex">
                <Bell size={20} className="text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background animate-pulse"></span>
              </Button>
              
              <div className="hidden lg:flex flex-col items-end mr-1">
                <p className="text-xs font-bold leading-none">{user?.name}</p>
                <p className="text-[9px] uppercase tracking-tighter text-muted-foreground">{user?.role}</p>
              </div>

              <Avatar className="h-8 w-8 border border-border/50 transition-all cursor-pointer">
                {/* Priority 1: User's actual profile pic from DB/Cloudinary */}
                {/* Priority 2: Fallback to DiceBear initials if no pic exists */}
                <AvatarImage 
                  src={user?.profilepic || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                  alt={user?.name}
                  className="object-cover"
                />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:text-destructive">
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION - Separator and Links */}
      {(isVisible || !isScrolled) && <Separator />}

      <div className={cn(
        "flex items-center px-4 md:px-8 transition-all duration-500 ease-in-out overflow-hidden",
        !isVisible ? "h-0 opacity-0 pointer-events-none" : "h-14 md:h-12 bg-muted/30 opacity-100"
      )}>
        
        {/* Mobile Nav Scroller */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto no-scrollbar w-full pr-4 py-2">
          {navLinks.map((link) => (
             <Link
               key={link.label}
               to={link.to || "#"}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium whitespace-nowrap"
             >
               <link.icon size={14} />
               {link.label}
             </Link>
          ))}
        </div>

        {/* The links that disappeared */}
        <nav className="hidden md:flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          {["Projects", "Sales", "Team", "Tasks", "Blog"].map((item) => (
            <a key={item} href="#" className="hover:text-foreground transition-colors duration-200">{item}</a>
          ))}
        </nav>

        {/* Search Bar */}
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
              className="h-8 text-xs bg-muted/50 border-border/50 transition-all focus:bg-background" 
            />
          </div>
          <Button size="icon" className="h-8 w-8 rounded-md bg-foreground text-background hover:bg-foreground/90">
            <Search size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}