import React from 'react'
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/Navbar"
import EmblaCarousel from '@/components/embla/EmblaCarousel'
import { useEvents } from '@/hooks/useEvents'
import '@/components/embla/css/base.css'
import '@/components/embla/css/embla.css'
import { Spinner } from "@/components/ui/spinner"

// MOCK DATA: Matches your Mongoose Schema Structure
const STATIC_TICKET_EVENTS = [
  { 
    _id: '1',
    url: 'https://www.milanopera-tickets.com/imagini-w/1920/63480aab09a2990294a5aac2ea44806382d94.jpg', 
    title: 'The Weeknd: After Hours', 
    category: 'concert',
    price: 15000,
    rating: 4.9,
    location: 'Sugathadasa Stadium',
    metadata: {
      artists: ['The Weeknd', 'Kaytranada'],
      discography: [{ title: 'After Hours', year: '2020' }]
    }
  },
  { 
    _id: '2',
    url: 'https://media.themoviedb.org/t/p/original/8mnXR9rey5uQ08rZAvzojKWbDQS.jpg', 
    title: 'Spider Man: Into the Spider Verse', 
    category: 'movie',
    price: 1200,
    rating: 8.8,
    location: 'PVR Cinemas, One Galle Face',
    metadata: {
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Jake Johnson'],
      director: 'Bob Persichetti'
    }
  },
  { 
    _id: '3',
    url: 'https://thetheatretimes.com/wp-content/uploads/2018/05/Nine-Night-Photo-Helen-Murray-1000x640.jpg', 
    title: 'Nine Night', 
    category: 'theatre',
    price: 5000,
    rating: 4.7,
    location: 'Lionel Wendt Theatre',
    metadata: {
      cast: ['Lin-Manuel Miranda', 'Leslie Odom Jr.']
    }
  },
  {
    _id: '4',
    url: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop',
    title: 'LPL Finals 2026',
    category: 'sports',
    price: 2500,
    rating: 4.5,
    location: 'R. Premadasa Stadium',
    metadata: {
      teams: { home: 'Colombo Strikers', away: 'Dambulla Aura' },
      league: 'Lanka Premier League'
    }
  }
]

function SidebarBackdrop() {
  const { open, isMobile, toggleSidebar } = useSidebar()
  if (!open || !isMobile) return null
  return (
    <div onClick={toggleSidebar} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" />
  )
}

export default function App() {
  const { events, loading } = useEvents();

  // Logic: Use DB events if available, otherwise use Static mock data
  const slides = events.length > 0 ? events : STATIC_TICKET_EVENTS;

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative z-[100]"><AppSidebar /></div>
      <SidebarBackdrop />
      
      <div className="flex flex-col w-full min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
        <Navbar />
        
        <main className="flex-1 py-10 pt-32 md:pt-36">
           <section className="w-full mb-12">
              <div className="px-6 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Featured Events</h1>
              </div>
              
              <div className="w-full min-h-[400px] flex items-center justify-center"> 
                {loading ? (
                  <div className="w-[90%] h-[50vh] bg-muted animate-pulse rounded-3xl flex items-center justify-center text-muted-foreground">
                    <Spinner className="mr-2" />Loading Events...
                  </div>
                ) : (
                  <EmblaCarousel slides={slides} options={{ loop: true }} />
                )}
              </div>
              <br></br>
              <br></br>
              <div className="px-6 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Featured Events</h2>
              </div>
           </section>

           <div className="container mx-auto px-4 text-center mt-10 text-muted-foreground">
             <h3 className="text-xl">Dashboard & Analytics</h3>
             <p>This section is ready for your admin panels.</p>
           </div>
        </main>
      </div>
    </SidebarProvider>
  )
}