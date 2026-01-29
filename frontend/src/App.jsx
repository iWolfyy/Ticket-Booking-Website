import React from 'react'
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/Navbar"
// REMOVED: Spinner import
import { Skeleton } from "@/components/ui/skeleton"
import EmblaCarousel from '@/components/embla/EmblaCarousel' 
import TicketCarousel from '@/components/TicketCarousel'     
import Footer from '@/components/Footer'
import { useEvents } from '@/hooks/useEvents'
import '@/components/embla/css/embla.css'

import { ThemeProvider } from "@/components/theme-provider"
import { MOCK_EVENTS } from '@/data/mockData'

// --- 1. Featured Carousel Skeleton ---
const FeaturedSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center py-4">
    {/* Matches the carousel dimensions */}
    <Skeleton className="w-[85%] h-[40vh] md:w-[60%] md:h-[65vh] rounded-[1.8rem] shadow-sm" />
  </div>
)

// --- 2. List (Ticket) Skeleton ---
const ListSkeleton = ({ count = 5, className, aspectRatio }) => (
  <div className="w-full max-w-6xl mx-auto px-8 overflow-hidden">
    <div className="-ml-4 flex">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`pl-4 flex-none ${className}`}>
           <div className="space-y-3">
             {/* Image Placeholder */}
             <Skeleton className={`w-full ${aspectRatio} rounded-xl`} />
             {/* Text Placeholders */}
             <div className="space-y-2 px-1">
               <Skeleton className="h-4 w-3/4" />
               <Skeleton className="h-3 w-1/2" />
               <div className="flex justify-between items-center pt-1">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-10 rounded-full" />
               </div>
             </div>
           </div>
        </div>
      ))}
    </div>
  </div>
)

// --- 3. Updated SectionLoader ---
const SectionLoader = ({ title, loading, fallback, children }) => (
  <section className="w-full mb-10"> 
    <div className="max-w-6xl mx-auto px-8 flex items-center justify-between mb-6">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
      <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">View All</a>
    </div>
    
    <div className="min-h-[200px]">
      {loading ? fallback : children}
    </div>
  </section>
)

function SidebarBackdrop() {
  const { open, isMobile, toggleSidebar } = useSidebar()
  if (!open || !isMobile) return null
  return (
    <div onClick={toggleSidebar} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" />
  )
}

export default function App() {
  const { events: featuredData, loading: loadingFeatured } = useEvents(); 
  const { events: movieData, loading: loadingMovies } = useEvents('movie');
  const { events: theatreData, loading: loadingTheatre } = useEvents('theatre');
  const { events: concertData, loading: loadingConcerts } = useEvents('concert');
  const { events: sportsData, loading: loadingSports } = useEvents('sports');

  const getData = (apiData, categoryKey) => {
    if (apiData && apiData.length > 0) return apiData;
    return MOCK_EVENTS[categoryKey] || [];
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={false}>
        <div className="relative z-[100]"><AppSidebar /></div>
        <SidebarBackdrop />
        
        <div className="flex flex-col w-full min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
          <Navbar />
          
          <main className="flex-1 py-10 pt-32 md:pt-36">
             {/* ... Featured Section ... */}
             <section className="w-full mb-12">
                <div className="px-6 mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">Featured Events</h1>
                </div>
                <div className="w-full min-h-[40vh] md:min-h-[65vh] flex items-center justify-center"> 
                  {loadingFeatured ? (
                     <FeaturedSkeleton />
                  ) : (
                    <EmblaCarousel 
                      slides={getData(featuredData, 'featured')} 
                      options={{ loop: true }} 
                    />
                  )}
                </div>
             </section>

             {/* ... Lists with Skeletons ... */}
             <SectionLoader 
               title="Trending Movies" 
               loading={loadingMovies}
               fallback={<ListSkeleton count={5} className="basis-1/2 md:basis-1/4 lg:basis-1/5" aspectRatio="aspect-[2/3]" />}
             >
                 <TicketCarousel 
                   data={getData(movieData, 'movies')} 
                   className="basis-1/2 md:basis-1/4 lg:basis-1/5" 
                   aspectRatio="aspect-[2/3]" 
                 />
             </SectionLoader>

             <SectionLoader 
               title="Theatre & Drama" 
               loading={loadingTheatre}
               fallback={<ListSkeleton count={5} className="basis-1/2 md:basis-1/4 lg:basis-1/5" aspectRatio="aspect-[2/3]" />}
             >
                 <TicketCarousel 
                   data={getData(theatreData, 'theatre')} 
                   className="basis-1/2 md:basis-1/4 lg:basis-1/5"
                   aspectRatio="aspect-[2/3]" 
                 />
             </SectionLoader>

             <SectionLoader 
               title="Upcoming Concerts" 
               loading={loadingConcerts}
               fallback={<ListSkeleton count={4} className="basis-1/1 md:basis-1/3 lg:basis-1/4" aspectRatio="aspect-video" />}
             >
                 <TicketCarousel 
                   data={getData(concertData, 'concerts')} 
                   className="basis-1/1 md:basis-1/3 lg:basis-1/4" 
                   aspectRatio="aspect-video" 
                 />
             </SectionLoader>

             <SectionLoader 
               title="Sports Events" 
               loading={loadingSports}
               fallback={<ListSkeleton count={4} className="basis-1/1 md:basis-1/3 lg:basis-1/4" aspectRatio="aspect-video" />}
             >
                 <TicketCarousel 
                   data={getData(sportsData, 'sports')} 
                   className="basis-1/1 md:basis-1/3 lg:basis-1/4"
                   aspectRatio="aspect-video" 
                 />
             </SectionLoader>

             <div className="container mx-auto px-4 text-center mt-6 text-muted-foreground pb-10">
               <h3 className="text-lg font-medium">End of Results</h3>
             </div>
          </main>
          
          <Footer />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}