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
    <footer className="w-full bg-black text-white border-t border-white/10 pt-16 pb-8">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              <span className="text-primary">Ticket</span>Booking
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
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
            <ul className="space-y-2 text-sm text-gray-400">
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
            <ul className="space-y-2 text-sm text-gray-400">
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
            <Card className="bg-white/5 border-white/10 text-white shadow-none backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold tracking-tight">Stay Updated</CardTitle>
                <CardDescription className="text-gray-400 text-xs">
                  Subscribe to get early access to tickets, exclusive offers, and event news.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary h-10 transition-all focus:bg-black/60"
                  />
                  <Button className="w-full font-bold h-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
                    Subscribe Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        <Separator className="bg-white/10 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 TicketBooking. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ icon, label }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-primary hover:text-black transition-all duration-300 border border-transparent hover:border-primary/20">
        {icon}
      </a>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="bg-white text-black text-xs font-bold">
      <p>{label}</p>
    </TooltipContent>
  </Tooltip>
)

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="hover:text-primary transition-colors flex items-center gap-1 group px-2 py-1.5 rounded-md hover:bg-white/5">
      <span className="w-0 group-hover:w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100"></span>
      {children}
    </a>
  </li>
)

export default Footer