import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  LucideStar, LucideMapPin, LucideInfo, LucideArrowLeft, 
  LucideUser, LucideDisc, LucideChevronRight, LucideUsers
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Marquee } from "@/components/ui/marquee"; // Use named import to fix export error
import { cn } from "@/lib/utils";
import { eventService } from "@/services/eventService";



export default function ConcertDetails() {
  const { id } = useParams();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black italic uppercase text-foreground">Loading...</div>;
  if (error || !event) return <div className="p-20 text-center font-black italic uppercase text-foreground">Event Not Found</div>;

  const venues = [
    { id: "v1", name: "Sugathadasa Stadium", city: "Colombo" },
    { id: "v2", name: "Galle Face Green", city: "Colombo" }
  ];

  const dates = [
    { id: "d1", day: "FRI", date: "30", month: "JAN" },
    { id: "d2", day: "SAT", date: "31", month: "JAN" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground transition-colors duration-300">
      
      {/* HERO SECTION */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-border">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${event.bannerImage || event.artistImage || event.posterImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute top-8 left-8 z-10">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 bg-background/80 backdrop-blur-md border-border hover:bg-accent text-foreground shadow-sm">
              <LucideArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <BlurFade delay={0.1}>
            <div className="flex flex-col md:flex-row items-end gap-8">
              <img 
                src={event.posterImage || event.artistImage} 
                className="hidden md:block w-48 rounded-2xl border-4 border-background shadow-2xl aspect-[2/3] object-cover" 
                alt={event.title} 
              />
              <div className="flex-1 space-y-4 max-w-4xl">
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase italic tracking-tighter px-3 py-1">
                  {event.category}
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter italic uppercase drop-shadow-sm leading-[0.85]">
                  {event.artistName || event.title}
                </h1>
                <p className="text-xl md:text-2xl font-bold uppercase italic text-muted-foreground tracking-tight">
                  {event.title}
                </p>
                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest italic opacity-70">
                  <span className="flex items-center gap-1"><LucideStar className="w-4 h-4 text-amber-500 fill-amber-500" /> {event.rating}</span>
                  <span className="flex items-center gap-1"><LucideMapPin className="w-4 h-4 text-primary" /> {event.venue?.name || "Premium Venue"}</span>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          
          <BlurFade delay={0.2}>
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <LucideInfo className="text-primary" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Overview</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">
                {event.description}
              </p>
            </section>
          </BlurFade>

          {/* HEADLINER INFO */}
          <BlurFade delay={0.3}>
            <div className="p-8 rounded-2xl bg-accent/50 border border-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary flex items-center gap-2">
                  <LucideUser size={12} /> Artist
                </p>
                <p className="text-3xl font-black italic uppercase tracking-tighter">
                  {event.artistName || "TBA"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary flex items-center gap-2">
                  <LucideUsers size={12} /> Lineup
                </p>
                <p className="text-lg font-bold italic text-muted-foreground uppercase">
                  {[event.artistName, ...(event.metadata?.featuringArtists || [])].filter(Boolean).join(" • ")}
                </p>
              </div>
            </div>
          </BlurFade>

          {/* MAGICUI MARQUEE DISCOGRAPHY - FULL COLOR */}
          {event.metadata?.discography?.length > 0 && (
            <BlurFade delay={0.4}>
              <div className="space-y-8 overflow-hidden">
                <div className="flex items-center gap-3">
                  <LucideDisc className="text-primary animate-spin-slow" size={24} />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Artist Top Albums</h3>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                  <Marquee pauseOnHover className="[--duration:40s]">
                    {event.metadata.discography.map((album, idx) => (
                      <div
                        key={idx}
                        className="relative w-64 cursor-pointer overflow-hidden rounded-2xl border border-border bg-accent/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 mx-4 group"
                      >
                        <div className="aspect-square w-full relative">
                          <img 
                            src={album.image} 
                            alt={album.title} 
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        </div>
                        
                        <div className="absolute bottom-0 left-0 p-5 w-full text-white">
                          {album.year !== "N/A" && (
                            <Badge variant="outline" className="mb-2 border-white/30 text-[8px] text-white uppercase font-black bg-black/40 backdrop-blur-sm">
                              {album.year}
                            </Badge>
                          )}
                          <h4 className="font-black italic uppercase leading-none text-sm truncate tracking-tighter">
                            {album.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </Marquee>

                  {/* Fade Overlays */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-10"></div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent z-10"></div>
                </div>
              </div>
            </BlurFade>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="relative">
          <BlurFade delay={0.5}>
            <Card className="border-border bg-card shadow-xl sticky top-24 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary" />
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">1. Select Venue</p>
                  <div className="space-y-2">
                    {venues.map((v) => (
                      <button 
                        key={v.id} 
                        onClick={() => { setSelectedVenue(v.id); setSelectedDate(null); }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                          selectedVenue === v.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card hover:bg-accent"
                        )}
                      >
                        <div>
                          <p className={cn("text-xs font-black italic uppercase", selectedVenue === v.id ? "text-primary" : "text-foreground")}>{v.name}</p>
                          <p className="text-[10px] opacity-60 uppercase font-bold">{v.city}</p>
                        </div>
                        {selectedVenue === v.id && <LucideChevronRight className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn("space-y-4 transition-opacity", !selectedVenue && "opacity-30 pointer-events-none")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">2. Select Date</p>
                  <div className="flex gap-2">
                    {dates.map((d) => (
                      <button 
                        key={d.id} 
                        onClick={() => { setSelectedDate(d.id); }}
                        className={cn(
                          "flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all",
                          selectedDate === d.id ? "border-primary bg-primary/10 text-primary ring-1 ring-primary" : "border-border bg-card hover:bg-accent"
                        )}
                      >
                        <span className="text-[8px] font-black opacity-60">{d.day}</span>
                        <span className="text-lg font-black">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold opacity-40 italic uppercase tracking-[0.2em]">Admission</p>
                    <p className="text-2xl font-black italic tracking-tighter">LKR {event.basePrice?.toLocaleString()}</p>
                  </div>
                  <RainbowButton 
                    disabled={!selectedDate} 
                    className={cn("w-full h-14 text-sm font-black uppercase italic tracking-widest", !selectedDate && "opacity-50 grayscale")}
                  >
                    Confirm Selection
                  </RainbowButton>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}