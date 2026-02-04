import React, { lazy, useState, useRef } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import EmblaCarousel from '@/components/embla/EmblaCarousel';
import { SectionLoader } from '@/components/common/SectionLoader';
import { useFetch } from '@/hooks/useFetch';
import { eventService } from '@/services/eventService';
import '@/components/embla/css/embla.css';

// Shadcn Pagination Components
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TicketCarousel = lazy(() => import('@/components/TicketCarousel'));

const CarouselSkeleton = ({ className, aspectRatio }) => (
  <div className="w-full max-w-6xl mx-auto px-8 overflow-hidden">
    <div className="flex -ml-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`pl-4 shrink-0 ${className}`}>
          <div className="h-full rounded-xl p-2 space-y-3">
            <Skeleton className={`w-full ${aspectRatio} rounded-lg`} />
            <div className="space-y-2 px-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="pt-1">
                 <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef(null); // Reference to scroll back to
  const itemsPerPage = 2; 

  const { data: featuredData, loading: loadingFeatured } = useFetch(eventService.getFeatured);
  const { data: movieData, loading: loadingMovies } = useFetch(eventService.getMovies);
  const { data: theatreData, loading: loadingTheatre } = useFetch(eventService.getTheatre);
  const { data: concertData, loading: loadingConcerts } = useFetch(eventService.getConcerts);
  const { data: sportsData, loading: loadingSports } = useFetch(eventService.getSports);

  const allSections = [
    { title: "Trending Movies", data: movieData, loading: loadingMovies, aspect: "aspect-[2/3]", cls: "basis-1/2 md:basis-1/4 lg:basis-1/5" },
    { title: "Theatre & Drama", data: theatreData, loading: loadingTheatre, aspect: "aspect-[2/3]", cls: "basis-1/2 md:basis-1/4 lg:basis-1/5" },
    { title: "Upcoming Concerts", data: concertData, loading: loadingConcerts, aspect: "aspect-video", cls: "basis-1/1 md:basis-1/3 lg:basis-1/4" },
    { title: "Sports Events", data: sportsData, loading: loadingSports, aspect: "aspect-video", cls: "basis-1/1 md:basis-1/3 lg:basis-1/4" }
  ];

  // Logic to show only the sections for the current page
  const totalPages = Math.ceil(allSections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSections = allSections.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll back to the start of the lists so the user sees the new data
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="w-full mb-12">
        <div className="px-6 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Featured Events</h1>
        </div>
        <div className="w-full min-h-[40vh] md:min-h-[65vh] flex items-center justify-center"> 
          {loadingFeatured ? <Skeleton className="w-[85%] h-[40vh] md:w-[60%] md:h-[65vh] rounded-[1.8rem]" /> : (
            <EmblaCarousel slides={featuredData} options={{ loop: true }} />
          )}
        </div>
      </section>

      {/* This invisible div acts as an anchor for scrolling when changing pages */}
      <div ref={scrollRef} className="scroll-mt-32" />

      <div className="min-h-[700px]">
        {currentSections.map((sec) => (
          <SectionLoader 
            key={sec.title} 
            title={sec.title} 
            loading={sec.loading} 
            fallback={<CarouselSkeleton className={sec.cls} aspectRatio={sec.aspect} />}
          >
            <TicketCarousel data={sec.data} className={sec.cls} aspectRatio={sec.aspect} />
          </SectionLoader>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="py-12 border-t mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}