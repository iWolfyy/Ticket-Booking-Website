import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from 'lucide-react'

const TicketCarousel = ({ 
  data = [], 
  className = "basis-1/2 md:basis-1/3 lg:basis-1/5", 
  aspectRatio = "aspect-[2/3]" 
}) => {

  if (!data || data.length === 0) return null;

  return (
    <Carousel
      opts={{ align: "start", dragFree: false, containScroll: "trimSnaps" }}
      className="w-full max-w-6xl mx-auto px-8" 
    >
      <CarouselContent className="-ml-4 pb-4">
        {data.map((event, index) => (
          <CarouselItem key={event._id || index} className={`pl-4 ${className}`}>
             <div className="h-full">
                {/* UPDATED STYLES:
                   - hover:bg-accent/50: Adds a subtle background color on hover
                   - p-2: Adds internal spacing so the background doesn't touch the image
                   - rounded-xl: Smooths the corners of the hover effect
                   - transition-colors: Makes the highlight fade in/out smoothly
                */}
                <Card className="h-full border-0 bg-transparent hover:bg-accent/50 shadow-none group cursor-pointer transition-colors duration-300 rounded-xl p-2">
                   
                   <div className={`relative ${aspectRatio} rounded-lg overflow-hidden mb-2 bg-muted shadow-sm`}>
                      <img 
                        src={
                          (event.category === 'concert' && event.bannerImage) 
                            ? event.bannerImage 
                            : (event.posterImage || event.bannerImage)
                        } 
                        alt={event.title}
                        loading="lazy"
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-2 right-2">
                         <Badge className="bg-black/80 hover:bg-black uppercase text-[10px] px-2 h-5 border-none text-white tracking-wide shadow-sm">
                            {event.category}
                         </Badge>
                      </div>
                   </div>
                   
                   <div className="space-y-1 px-1">
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1" title={event.title}>
                        {event.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 line-clamp-1">
                         <MapPin className="w-3 h-3" /> {event.venue?.name || 'Venue TBA'}
                      </p>
                      <p className="font-bold text-sm text-primary">
                        Rs. {event.basePrice?.toLocaleString()}
                      </p>
                   </div>
                </Card>
             </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <CarouselPrevious className="-left-4 lg:-left-12 h-9 w-9 bg-background border border-input hover:bg-accent hover:text-accent-foreground shadow-md" />
      <CarouselNext className="-right-4 lg:-right-12 h-9 w-9 bg-background border border-input hover:bg-accent hover:text-accent-foreground shadow-md" />
    </Carousel>
  )
}

export default TicketCarousel