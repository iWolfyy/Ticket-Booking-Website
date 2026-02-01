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

  // 1. Determine the raw image source
  const rawImageSrc = (event.category === 'concert' && event.bannerImage) 
    ? event.bannerImage 
    : (event.posterImage || event.bannerImage);

  // 2. Create a stable versioned URL to fix flickering and CORS issues
  const stableSrc = rawImageSrc ? `${rawImageSrc}?v=${event._id}` : null;

  return (
    <div className="h-full">
      {/* 3. HIDDEN PRELOADER: Only renders if a valid source exists */}
      {stableSrc && (
        <img 
          src={stableSrc}
          alt="preload"
          className="hidden"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)} // Fail-safe: show content even if image breaks
        />
      )}

      {/* 4. SKELETON STATE: Shows while loading or if no source exists */}
      {(!isLoaded || !stableSrc) && (
        <div className="h-full rounded-xl p-2 space-y-3">
          <Skeleton className={`w-full ${aspectRatio} rounded-lg`} />
          <div className="space-y-2 px-1">
            <Skeleton className="h-4 w-3/4" />   {/* Title */}
            <Skeleton className="h-3 w-1/2" />   {/* Venue */}
            <div className="pt-1">
               <Skeleton className="h-3 w-1/3" /> {/* Price */}
            </div>
          </div>
        </div>
      )}

      {/* 5. REVEAL STATE: Rendered only if source exists and is loaded */}
      {stableSrc && isLoaded && (
        <BlurFade duration={0.4} inView className="h-full">
           <Card className="h-full border-0 bg-transparent hover:bg-zinc-100 dark:hover:bg-accent/50 shadow-none group cursor-pointer transition-colors duration-300 rounded-xl p-2">
             
             <div className={`relative ${aspectRatio} rounded-lg overflow-hidden mb-2 bg-muted shadow-sm`}>
                <img 
                  src={stableSrc} 
                  alt={event.title}
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://images.unsplash.com/photo-1540039155733-5bb30b7568ed?q=80&w=1000"; // Generic event fallback
                  }}
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