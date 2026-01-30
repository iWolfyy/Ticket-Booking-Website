import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  LucideTrophy, 
  LucideMapPin, 
  LucideInfo, 
  LucideArrowLeft, 
  LucideChevronRight, 
  LucideTimer, 
  LucideShieldCheck,
  LucideStar 
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";

import { MOCK_EVENTS } from "@/data/mockdata";

export default function SportsDetail() {
  const { id } = useParams();
  
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const allEvents = Object.values(MOCK_EVENTS).flat();
  const event = allEvents.find((e) => e._id === id);

  if (!event) return <div className="p-20 text-center font-black italic uppercase">Event Not Found</div>;

  const venues = [
    { id: "v1", name: "R. Premadasa Stadium", city: "Colombo" },
    { id: "v2", name: "Pallekele International Stadium", city: "Kandy" }
  ];

  const dates = [
    { id: "d1", day: "SUN", date: "12", month: "FEB" },
    { id: "d2", day: "MON", date: "13", month: "FEB" }
  ];

  const times = ["02:30 PM", "07:00 PM"];

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground transition-colors duration-300">
      {/* SPORTS HERO SECTION */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-border">
        {/* Background Layer - High clarity, theme-aware opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 dark:opacity-30 scale-100 transition-all duration-1000"
          style={{ backgroundImage: `url(${event.bannerImage || event.posterImage})` }}
        />
        
        {/* Theme-aware vignette and gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_50%,_var(--background)_100%)] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        
        <div className="absolute top-8 left-8 z-30">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 bg-background/60 backdrop-blur-md border-border hover:bg-accent text-foreground">
              <LucideArrowLeft className="w-4 h-4" /> Back to Fixtures
            </Button>
          </Link>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20">
          <BlurFade delay={0.1}>
            <div className="space-y-10 w-full max-w-7xl mx-auto">
              <Badge className="bg-primary text-primary-foreground font-black uppercase italic tracking-[0.4em] px-8 py-1.5 shadow-xl">
                {event.metadata?.league || "Lanka Premier League"}
              </Badge>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-8">
                
                {/* Home Team */}
                <div className="flex-1 space-y-2">
                   <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] drop-shadow-md">
                    {event.metadata?.teams?.home?.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Host Venue</p>
                </div>
                
                {/* VS STYLE: Outlined & Glow */}
                <div className="relative shrink-0 py-8 md:py-0">
                  <span className="text-7xl md:text-9xl font-black italic uppercase text-transparent stroke-primary tracking-tighter select-none opacity-90 dark:opacity-100">
                    VS
                  </span>
                  <div className="absolute top-1/2 left-[-40px] right-[-40px] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10" />
                </div>

                {/* Away Team */}
                <div className="flex-1 space-y-2">
                   <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] drop-shadow-md">
                    {event.metadata?.teams?.away?.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Challenger</p>
                </div>

              </div>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <BlurFade delay={0.2}>
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <LucideTrophy className="text-primary" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Match Overview</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">
                {event.description}
              </p>
            </section>
          </BlurFade>

          <BlurFade delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoSquare icon={<LucideTimer />} label="Duration" value="90 Min + ET" />
              <InfoSquare icon={<LucideShieldCheck />} label="Sanctioned" value="Official League" />
              <InfoSquare icon={<LucideStar />} label="Intensity" value="High Stakes" />
            </div>
          </BlurFade>
        </div>

        {/* BOOKING SIDEBAR */}
        <div className="relative">
          <BlurFade delay={0.4}>
            <Card className="border-border bg-card shadow-xl sticky top-24 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
              <CardContent className="p-8 space-y-8">
                {/* 1. Venue */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">1. Select Stadium</p>
                  <div className="space-y-2">
                    {venues.map((v) => (
                      <button 
                        key={v.id} 
                        onClick={() => { setSelectedVenue(v.id); setSelectedDate(null); setSelectedTime(null); }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                          selectedVenue === v.id 
                            ? "border-primary bg-primary/10 ring-1 ring-primary" 
                            : "border-border bg-background hover:bg-accent"
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

                {/* 2. Date */}
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
                            : "border-border bg-background text-foreground hover:bg-accent"
                        )}
                      >
                        <span className="text-[8px] font-black opacity-60">{d.day}</span>
                        <span className="text-lg font-black">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Time */}
                <div className={cn("space-y-4 transition-opacity", !selectedDate && "opacity-30 pointer-events-none")}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">3. Kickoff Time</p>
                  <div className="grid grid-cols-2 gap-2">
                    {times.map((time) => (
                      <Button 
                        key={time} 
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "text-[10px] font-black h-10 uppercase italic transition-all",
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
                    Buy Tickets
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

function InfoSquare({ icon, label, value }) {
  return (
    <div className="bg-accent/50 border border-border p-6 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-sm">
      <div className="text-primary">{React.cloneElement(icon, { size: 20 })}</div>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">{label}</p>
      <p className="text-sm font-black italic uppercase tracking-tight">{value}</p>
    </div>
  );
}