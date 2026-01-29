import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone 
} from 'lucide-react'

const Footer = () => {
  return (
    // CHANGED: bg-black -> bg-background, text-white -> text-foreground, border-white/10 -> border-border
    <footer className="w-full bg-background text-foreground border-t border-border pt-16 pb-8">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              <span className="text-primary">Ticket</span>Booking
            </h2>
            {/* CHANGED: text-gray-400 -> text-muted-foreground */}
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your premier destination for movies, concerts, and live events. 
              Experience the magic of entertainment with seamless booking.
            </p>
            
            <div className="flex gap-4 pt-2">
              <TooltipProvider delayDuration={100}>
                <SocialIcon label="Facebook" icon={<Facebook className="w-4 h-4" />} />
                <SocialIcon label="Twitter" icon={<Twitter className="w-4 h-4" />} />
                <SocialIcon label="Instagram" icon={<Instagram className="w-4 h-4" />} />
                <SocialIcon label="YouTube" icon={<Youtube className="w-4 h-4" />} />
              </TooltipProvider>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold pl-1">Explore</h3>
            {/* CHANGED: text-gray-400 -> text-muted-foreground */}
            <ul className="space-y-2 text-sm text-muted-foreground">
              <FooterLink href="#">Movies</FooterLink>
              <FooterLink href="#">Concerts</FooterLink>
              <FooterLink href="#">Sports Events</FooterLink>
              <FooterLink href="#">Theatre & Arts</FooterLink>
              <FooterLink href="#">Upcoming Deals</FooterLink>
            </ul>
          </div>

          {/* 3. Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold pl-1">Support</h3>
            {/* CHANGED: text-gray-400 -> text-muted-foreground */}
            <ul className="space-y-2 text-sm text-muted-foreground">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Ticket Policy</FooterLink>
              <FooterLink href="#">Refunds & Returns</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
              <li className="flex items-center gap-2 pt-2 px-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2 px-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@ticketbooking.lk</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div className="flex flex-col">
            {/* CHANGED: bg-white/5 -> bg-card/50 or bg-muted/30, border-white/10 -> border-border, text-white -> text-card-foreground */}
            <Card className="bg-muted/30 border-border text-card-foreground shadow-none backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold tracking-tight">Stay Updated</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  Subscribe to get early access to tickets, exclusive offers, and event news.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {/* CHANGED: bg-black/40 -> bg-background, border-white/10 -> border-input */}
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-10 transition-all"
                  />
                  <Button className="w-full font-bold h-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
                    Subscribe Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* CHANGED: bg-white/10 -> bg-border */}
        <Separator className="bg-border my-8" />

        {/* CHANGED: text-gray-500 -> text-muted-foreground */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 TicketBooking. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ icon, label }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {/* CHANGED: bg-white/5 -> bg-muted, hover:text-black -> hover:text-primary-foreground */}
      <a href="#" className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-transparent hover:border-primary/20 text-foreground">
        {icon}
      </a>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="bg-popover text-popover-foreground text-xs font-bold border-border">
      <p>{label}</p>
    </TooltipContent>
  </Tooltip>
)

const FooterLink = ({ href, children }) => (
  <li>
    {/* CHANGED: hover:bg-white/5 -> hover:bg-muted */}
    <a href={href} className="hover:text-primary transition-colors flex items-center gap-1 group px-2 py-1.5 rounded-md hover:bg-muted">
      <span className="w-0 group-hover:w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100"></span>
      {children}
    </a>
  </li>
)

export default Footer