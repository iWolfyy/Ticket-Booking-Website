import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  LucideStar, LucideMapPin, LucideInfo, LucideArrowLeft, 
  LucideUser, LucideMusic, LucideDisc, LucideChevronRight 
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";
import { MOCK_EVENTS } from "@/data/mockdata";

export default function ConcertDetails() {
  const { id } = useParams();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const allEvents = Object.values(MOCK_EVENTS).flat();
  const event = allEvents.find((e) => e._id === id);

  if (!event) return <div className="p-20 text-center font-black italic uppercase">Event Not Found</div>;

  const venues = [
    { id: "v1", name: "Sugathadasa Stadium", city: "Colombo" },
    { id: "v2", name: "Galle Face Green", city: "Colombo" }
  ];

  const dates = [
    { id: "d1", day: "FRI", date: "30", month: "JAN" },
    { id: "d2", day: "SAT", date: "31", month: "JAN" }
  ];

  const times = ["06:00 PM", "08:30 PM", "11:00 PM"];

  return (
    // Change: Use 'bg-background' and 'text-foreground' instead of 'bg-white'
    <div className="min-h-screen bg-background pb-20 text-foreground transition-colors duration-300">
      
      {/* HERO SECTION */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-border">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${event.bannerImage || event.posterImage})` }}
        />
        {/* Change: Use a theme-aware gradient (fades to the background color) */}
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
              <img src={event.posterImage} className="hidden md:block w-48 rounded-2xl border-4 border-background shadow-2xl" alt={event.title} />
              <div className="flex-1 space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase italic tracking-tighter px-3 py-1">
                  {event.category}
                </Badge>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase drop-shadow-sm">
                  {event.title}
                </h1>
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
        <div className="lg:col-span-2 space-y-12">
          <BlurFade delay={0.2}>
            <section className="space-y-4">
              <h3 className="text-xl font-black italic uppercase flex items-center gap-2">
                <LucideInfo className="w-5 h-5 text-primary" /> Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{event.description}</p>
            </section>
          </BlurFade>

          {/* Lineup Block - Theme Aware */}
          <BlurFade delay={0.3}>
            <div className="p-8 rounded-2xl bg-accent/50 border border-border shadow-sm">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary flex items-center gap-2">
                  <LucideMusic size={12} /> Headliners
                </p>
                <p className="text-3xl font-black italic uppercase leading-tight">
                  {event.metadata?.artists?.join(" & ")}
                </p>
              </div>
            </div>
          </BlurFade>

          {/* Bento Grid - Theme Aware */}
          {event.category === 'concert' && event.metadata?.discography && (
            <BlurFade delay={0.4}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <LucideDisc className="text-primary animate-spin-slow" size={24} />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Top Albums</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
                  {event.metadata.discography.map((album, idx) => (
                    <div key={idx} className={cn("relative group overflow-hidden rounded-3xl border border-border bg-accent/50 transition-all hover:scale-[1.02] shadow-sm", idx === 0 ? "md:col-span-2 md:row-span-2" : "col-span-1")}>
                      <img src={album.image} alt={album.title} className="absolute inset-0 h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                        <Badge variant="outline" className="mb-2 border-white/50 text-[8px] text-white uppercase font-black tracking-widest">{album.year}</Badge>
                        <h4 className={cn("font-black italic uppercase leading-none", idx === 0 ? "text-3xl" : "text-sm")}>{album.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BlurFade>
          )}
        </div>

        {/* BOOKING SIDEBAR */}
        <div className="relative">
          <BlurFade delay={0.5}>
            <Card className="border-border bg-card shadow-xl sticky top-24 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary" />
              <CardContent className="p-8 space-y-8">
                
                {/* 1. VENUE */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">1. Select Venue</p>
                  <div className="space-y-2">
                    {venues.map((v) => (
                      <button 
                        key={v.id} 
                        onClick={() => { setSelectedVenue(v.id); setSelectedDate(null); setSelectedTime(null); }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                          selectedVenue === v.id 
                            ? "border-primary bg-primary/10 ring-1 ring-primary" 
                            : "border-border bg-card hover:bg-accent"
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

                {/* 2. DATE */}
                <div className={cn("space-y-4 transition-opacity", !selectedVenue && "opacity-30 pointer-events-none")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">2. Select Date</p>
                  <div className="flex gap-2">
                    {dates.map((d) => (
                      <button 
                        key={d.id} 
                        onClick={() => { setSelectedDate(d.id); setSelectedTime(null); }}
                        className={cn(
                          "flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all",
                          selectedDate === d.id 
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary" 
                            : "border-border bg-card hover:bg-accent"
                        )}
                      >
                        <span className="text-[8px] font-black opacity-60">{d.day}</span>
                        <span className="text-lg font-black">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. TIME */}
                <div className={cn("space-y-4 transition-opacity", !selectedDate && "opacity-30 pointer-events-none")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">3. Select Time</p>
                  <div className="grid grid-cols-2 gap-2">
                    {times.map((time) => (
                      <Button 
                        key={time} 
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "text-[10px] font-black h-10 uppercase italic",
                          selectedTime === time ? "bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold opacity-40 italic uppercase">Tickets From</p>
                    <p className="text-2xl font-black italic tracking-tighter">LKR {event.basePrice?.toLocaleString()}</p>
                  </div>
                  <RainbowButton 
                    disabled={!selectedTime} 
                    className={cn("w-full h-14 text-sm font-black uppercase italic tracking-widest", !selectedTime && "opacity-50 grayscale")}
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