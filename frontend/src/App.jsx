import React from 'react'
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/Navbar"
import { Spinner } from "@/components/ui/spinner"
import EmblaCarousel from '@/components/embla/EmblaCarousel' 
import TicketCarousel from '@/components/TicketCarousel'     
import { useEvents } from '@/hooks/useEvents'
import '@/components/embla/css/base.css'
import '@/components/embla/css/embla.css'
import Footer from '@/components/Footer'

// Import Mock Data
import { MOCK_EVENTS } from '@/data/mockData'

const SectionLoader = ({ title, loading, children }) => (
  // TicketCarousel handles its own width/centering, so we use w-full here
  <section className="w-full mb-10"> 
    {/* Header is centered to match the TicketCarousel width */}
    <div className="max-w-6xl mx-auto px-8 flex items-center justify-between mb-6">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
      <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">View All</a>
    </div>
    
    <div className="min-h-[200px]">
      {loading ? (
        <div className="max-w-6xl mx-auto px-8 w-full h-[200px]">
           <div className="w-full h-full bg-muted/30 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">
             <Spinner className="mr-2" /> Loading Events...
           </div>
        </div>
      ) : children}
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
    <SidebarProvider defaultOpen={false}>
      <div className="relative z-[100]"><AppSidebar /></div>
      <SidebarBackdrop />
      
      <div className="flex flex-col w-full min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
        <Navbar />
        
        <main className="flex-1 py-10 pt-32 md:pt-36">
           
           {/* SECTION 1: HERO (Embla Carousel) - REVERTED TO DEFAULT */}
           <section className="w-full mb-12">
              <div className="px-6 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Featured Events</h1>
              </div>
              <div className="w-full min-h-[400px] flex items-center justify-center"> 
                {loadingFeatured ? (
                   <div className="w-[90%] h-[50vh] bg-muted animate-pulse rounded-3xl" />
                ) : (
                  // FULL WIDTH (Default)
                  <EmblaCarousel 
                    slides={getData(featuredData, 'featured')} 
                    options={{ loop: true }} 
                  />
                )}
              </div>
           </section>

           {/* SECTION 2: MOVIES */}
           <SectionLoader title="Trending Movies" loading={loadingMovies}>
               <TicketCarousel 
                 data={getData(movieData, 'movies')} 
                 className="basis-1/2 md:basis-1/4 lg:basis-1/5" 
                 aspectRatio="aspect-[2/3]" 
               />
           </SectionLoader>

           {/* SECTION 3: THEATRE */}
           <SectionLoader title="Theatre & Drama" loading={loadingTheatre}>
               <TicketCarousel 
                 data={getData(theatreData, 'theatre')} 
                 className="basis-1/2 md:basis-1/4 lg:basis-1/5"
                 aspectRatio="aspect-[2/3]" 
               />
           </SectionLoader>

           {/* SECTION 4: CONCERTS */}
           <SectionLoader title="Upcoming Concerts" loading={loadingConcerts}>
               <TicketCarousel 
                 data={getData(concertData, 'concerts')} 
                 className="basis-1/1 md:basis-1/3 lg:basis-1/4" 
                 aspectRatio="aspect-video" 
               />
           </SectionLoader>

           {/* SECTION 5: SPORTS */}
           <SectionLoader title="Sports Events" loading={loadingSports}>
               <TicketCarousel 
                 data={getData(sportsData, 'sports')} 
                 className="basis-1/1 md:basis-1/3 lg:basis-1/4"
                 aspectRatio="aspect-video" 
               />
           </SectionLoader>
        </main>
        {/* ADD FOOTER HERE */}
        <Footer />
      </div>
    </SidebarProvider>
  )
}