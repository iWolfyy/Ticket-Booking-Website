import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  LucideStar, LucideMapPin, LucideInfo, LucideArrowLeft, 
  LucideChevronRight, LucideClapperboard, LucideUser, LucideFilm,
  LucideClock, LucideBanknote, LucideCalendar, LucideBuilding2, LucideGlobe
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";

import { MOCK_EVENTS } from "@/data/mockdata";

export default function MovieDetail() {
  const { id } = useParams();
  
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const allEvents = Object.values(MOCK_EVENTS).flat();
  const event = allEvents.find((e) => e._id === id);

  if (!event) return <div className="p-20 text-center font-black italic uppercase">Movie Not Found</div>;

  const venues = [
    { id: "v1", name: "PVR Cinemas", city: "Colombo" },
    { id: "v2", name: "Scope Cinemas", city: "Colombo" }
  ];

  const dates = [{ id: "d1", day: "FRI", date: "30", month: "JAN" }, { id: "d2", day: "SAT", date: "31", month: "JAN" }];
  const times = ["10:30 AM", "01:45 PM", "07:15 PM"];

  const formatUSD = (val) => val ? `$${(val / 1000000).toFixed(1)}M` : "N/A";

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground transition-colors duration-300">
      
      {/* HERO SECTION */}
      <div className="relative h-[70vh] w-full overflow-hidden border-b border-border">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${event.bannerImage || event.posterImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute top-8 left-8 z-10 flex gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 bg-background/80 backdrop-blur-md border-border hover:bg-accent shadow-sm text-foreground">
              <LucideArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          {event.metadata?.status === "Released" && (
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase font-black px-4 italic">
              Now Showing
            </Badge>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <BlurFade delay={0.1}>
            <div className="flex flex-col md:flex-row items-end gap-10">
              <img 
                src={event.posterImage} 
                className="hidden md:block w-56 rounded-2xl border-4 border-background shadow-2xl" 
                alt={event.title} 
              />
              {/* FIXED: Max-width and Responsive Font Size */}
              <div className="flex-1 space-y-6 max-w-4xl">
                <div className="flex flex-wrap gap-2">
                   <Badge className="bg-primary/20 text-primary border-primary/30 uppercase italic tracking-tighter px-3">
                    {event.category}
                  </Badge>
                  {event.metadata?.genres?.map((g, i) => (
                    <Badge key={i} variant="secondary" className="bg-accent/50 text-[10px] uppercase font-bold italic tracking-widest">{g}</Badge>
                  ))}
                </div>
                
                {/* Responsive Scale: text-4xl on mobile -> text-7xl on desktop */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter italic uppercase drop-shadow-sm leading-[0.9]">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest italic opacity-70">
                  <span className="flex items-center gap-1.5"><LucideStar className="w-4 h-4 text-amber-500 fill-amber-500" /> {event.rating} / 10</span>
                  <span className="flex items-center gap-1.5"><LucideClock className="w-4 h-4 text-primary" /> {event.metadata?.runtime} MIN</span>
                  <span className="flex items-center gap-1.5"><LucideCalendar className="w-4 h-4 text-primary" /> {new Date(event.metadata?.releaseDate).getFullYear()}</span>
                  <span className="flex items-center gap-1.5"><LucideGlobe className="w-4 h-4 text-primary" /> {event.metadata?.status}</span>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-20">
          
          <BlurFade delay={0.2}>
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <LucideInfo className="text-primary" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Synopsis</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-xl max-w-4xl">
                {event.description}
              </p>
            </section>
          </BlurFade>

          {/* FINANCIALS GRID */}
          <BlurFade delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-10 rounded-[2.5rem] bg-accent/30 border border-border shadow-inner">
              <StatBlock label="Budget" value={formatUSD(event.metadata?.budget)} icon={<LucideBanknote />} />
              <StatBlock label="Revenue" value={formatUSD(event.metadata?.revenue)} icon={<LucideGlobe />} />
              <StatBlock label="Director" value={event.metadata?.director} icon={<LucideClapperboard />} />
              <StatBlock label="Runtime" value={`${event.metadata?.runtime}m`} icon={<LucideClock />} />
            </div>
          </BlurFade>

          {/* CAST GRID */}
          <BlurFade delay={0.4}>
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <LucideUser className="text-primary" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Leading Cast</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {event.metadata?.cast?.slice(0, 5).map((actor, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[3/4] border border-border bg-accent/50 transition-all hover:border-primary/50">
                    <img 
                      src={actor.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"} 
                      className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-[10px] text-primary font-black uppercase italic tracking-widest">{actor.character?.split(' (')[0]}</p>
                      <p className="text-xs text-white font-bold uppercase italic leading-tight">{actor.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </BlurFade>

          {/* PRODUCTION LOGOS */}
          <BlurFade delay={0.5}>
            <div className="space-y-6">
               <p className="text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground flex items-center gap-2">
                <LucideBuilding2 size={12} /> Studios
              </p>
              <div className="flex flex-wrap gap-10 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
                {event.metadata?.productionCompanies?.map((studio, i) => (
                  studio.logo && <img key={i} src={studio.logo} alt={studio.name} className="h-7 object-contain" />
                ))}
              </div>
            </div>
          </BlurFade>
        </div>

        {/* BOOKING SIDEBAR */}
        <div className="relative">
          <BlurFade delay={0.6}>
            <Card className="border-border bg-card shadow-2xl sticky top-24 overflow-hidden rounded-[2.5rem]">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse" />
              <CardContent className="p-10 space-y-10">
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">1. Select Venue</p>
                  <div className="space-y-2">
                    {venues.map((v) => (
                      <button key={v.id} onClick={() => { setSelectedVenue(v.id); setSelectedDate(null); }}
                        className={cn("w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all",
                          selectedVenue === v.id ? "border-primary bg-primary/10 ring-1 ring-primary shadow-lg" : "border-border bg-background hover:bg-accent"
                        )}>
                        <div><p className={cn("text-xs font-black italic uppercase", selectedVenue === v.id ? "text-primary" : "text-foreground")}>{v.name}</p><p className="text-[10px] opacity-60 uppercase font-bold">{v.city}</p></div>
                        {selectedVenue === v.id && <LucideChevronRight className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn("space-y-6 transition-all duration-500", !selectedVenue && "opacity-30 pointer-events-none translate-y-2")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">2. Select Date</p>
                  <div className="flex gap-2">
                    {dates.map((d) => (
                      <button key={d.id} onClick={() => setSelectedDate(d.id)}
                        className={cn("flex flex-col items-center justify-center flex-1 h-20 rounded-2xl border transition-all",
                          selectedDate === d.id ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-lg" : "border-border bg-background hover:bg-accent"
                        )}>
                        <span className="text-[8px] font-black opacity-60 uppercase">{d.day}</span>
                        <span className="text-xl font-black">{d.date}</span>
                        <span className="text-[8px] font-black opacity-60 uppercase">{d.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold opacity-40 italic uppercase tracking-[0.2em]">General Admission</p>
                    <p className="text-3xl font-black italic tracking-tighter">LKR {event.basePrice?.toLocaleString()}</p>
                  </div>
                  <RainbowButton disabled={!selectedDate} className={cn("w-full h-16 text-md font-black uppercase italic tracking-[0.2em]", !selectedDate && "opacity-50 grayscale")}>
                    Confirm Booking
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

function StatBlock({ label, value, icon }) {
  return (
    <div className="space-y-2">
      <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary flex items-center gap-2">
        {React.cloneElement(icon, { size: 12 })} {label}
      </p>
      <p className="text-lg md:text-xl font-black italic uppercase leading-tight truncate">{value || "TBA"}</p>
    </div>
  );
}