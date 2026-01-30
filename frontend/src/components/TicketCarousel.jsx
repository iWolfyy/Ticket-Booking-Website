import React, { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlurFade } from "@/components/ui/blur-fade"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from 'lucide-react'

// --- SINGLE TICKET CARD COMPONENT ---
const TicketCard = ({ event, aspectRatio }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  // Determine the correct image source
  const imageSrc = (event.category === 'concert' && event.bannerImage) 
    ? event.bannerImage 
    : (event.posterImage || event.bannerImage);

  return (
    <div className="h-full">
      {/* 1. HIDDEN PRELOADER: Triggers the switch when image is ready */}
      <img 
        src={imageSrc}
        alt="preload"
        className="hidden"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)} // Fail-safe: show content even if image breaks
      />

      {/* 2. SKELETON STATE: Shows immediately (No blur, no delay) */}
      {!isLoaded && (
        <div className="h-full rounded-xl p-2 space-y-3">
          {/* Matches the Image Aspect Ratio */}
          <Skeleton className={`w-full ${aspectRatio} rounded-lg`} />
          
          {/* Matches the Text Content */}
          <div className="space-y-2 px-1">
            <Skeleton className="h-4 w-3/4" />   {/* Title */}
            <Skeleton className="h-3 w-1/2" />   {/* Venue */}
            <div className="pt-1">
               <Skeleton className="h-3 w-1/3" /> {/* Price */}
            </div>
          </div>
        </div>
      )}

      {/* 3. REVEAL STATE: Blurs in ONLY after image is loaded */}
      {isLoaded && (
        <BlurFade duration={0.4} inView className="h-full">
           <Card className="h-full border-0 bg-transparent hover:bg-zinc-100 dark:hover:bg-accent/50 shadow-none group cursor-pointer transition-colors duration-300 rounded-xl p-2">
             
             <div className={`relative ${aspectRatio} rounded-lg overflow-hidden mb-2 bg-muted shadow-sm`}>
                <img 
                  src={imageSrc} 
                  alt={event.title}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 z-10">
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
        </BlurFade>
      )}
    </div>
  )
}

// --- MAIN CAROUSEL ---
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
             {/* Render the smart card directly */}
             <TicketCard event={event} aspectRatio={aspectRatio} />
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <CarouselPrevious className="-left-4 lg:-left-12 h-9 w-9 bg-background border border-input hover:bg-accent hover:text-accent-foreground shadow-md" />
      <CarouselNext className="-right-4 lg:-right-12 h-9 w-9 bg-background border border-input hover:bg-accent hover:text-accent-foreground shadow-md" />
    </Carousel>
  )
}

export default TicketCarousel