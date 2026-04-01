import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isSameDay } from "date-fns";
import {
  LucideMapPin,
  LucideChevronRight,
  LucideCalendar,
  LucideClock,
  LucideTicket,
  LucideUsers,
  LucideAlertCircle,
  LucideLoader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/axios";

const CATEGORY_LABELS = {
  movie: {
    venue: "Cinema",
    date: "Date",
    time: "Showtime",
    book: "Book Seats",
  },
  concert: {
    venue: "Venue",
    date: "Date",
    time: "Show Time",
    book: "Get Tickets",
  },
  sports: {
    venue: "Stadium",
    date: "Match Date",
    time: "Kickoff Time",
    book: "Buy Tickets",
  },
  theatre: {
    venue: "Theatre",
    date: "Performance Date",
    time: "Showtime",
    book: "Reserve Seats",
  },
};

function getTotalAvailable(availability) {
  return availability.reduce((sum, s) => sum + (s.availableSeats || 0), 0);
}

function getMinPrice(availability) {
  if (!availability?.length) return null;
  return Math.min(...availability.map((s) => s.price || 0));
}

function dateKey(dateStr) {
  return format(parseISO(dateStr), "yyyy-MM-dd");
}

function groupShowsByVenue(shows) {
  const map = new Map();
  shows.forEach((show) => {
    const vid = show.venue._id;
    if (!map.has(vid)) map.set(vid, { venue: show.venue, shows: [] });
    map.get(vid).shows.push(show);
  });
  return Array.from(map.values());
}

function getUniqueDates(shows) {
  const seen = new Set();
  return shows
    .filter((s) => {
      const key = dateKey(s.startTime);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}

export default function ShowSchedulePicker({ eventId, basePrice, category }) {
  const navigate = useNavigate();
  const labels = CATEGORY_LABELS[category] || CATEGORY_LABELS.movie;

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    apiClient
      .get(`/shows/event/${eventId}`)
      .then((res) => {
        const active = res.data.filter((s) => s.status !== "cancelled");
        setShows(active);
      })
      .catch(() => setError("Could not load show schedule."))
      .finally(() => setLoading(false));
  }, [eventId]);

  const venueGroups = useMemo(() => groupShowsByVenue(shows), [shows]);

  const showsAtVenue = useMemo(
    () =>
      selectedVenueId
        ? shows.filter((s) => s.venue._id === selectedVenueId)
        : [],
    [shows, selectedVenueId]
  );

  const uniqueDates = useMemo(
    () => getUniqueDates(showsAtVenue),
    [showsAtVenue]
  );

  const showsOnDate = useMemo(
    () =>
      selectedDateKey
        ? showsAtVenue
            .filter((s) => dateKey(s.startTime) === selectedDateKey)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        : [],
    [showsAtVenue, selectedDateKey]
  );

  const selectedShow = useMemo(
    () => shows.find((s) => s._id === selectedShowId) || null,
    [shows, selectedShowId]
  );

  function handleVenueSelect(venueId) {
    setSelectedVenueId(venueId);
    setSelectedDateKey(null);
    setSelectedShowId(null);
  }

  function handleDateSelect(key) {
    setSelectedDateKey(key);
    setSelectedShowId(null);
  }

  function handleBook() {
    if (selectedShowId) navigate(`/booking/${selectedShowId}`);
  }

  // ── Loading & Error States ──────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="border-border bg-card shadow-2xl sticky top-24 overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse" />
        <CardContent className="p-10 flex flex-col items-center justify-center gap-4 min-h-[320px]">
          <LucideLoader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-black uppercase italic tracking-widest text-muted-foreground">
            Loading Schedule...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border bg-card shadow-2xl sticky top-24 overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-10 flex flex-col items-center justify-center gap-4 min-h-[320px] text-center">
          <LucideAlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-sm font-black italic uppercase text-muted-foreground">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (shows.length === 0) {
    return (
      <Card className="border-border bg-card shadow-2xl sticky top-24 overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary" />
        <CardContent className="p-10 flex flex-col items-center justify-center gap-4 min-h-[320px] text-center">
          <LucideCalendar className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-black italic uppercase">
            No Shows Scheduled
          </p>
          <p className="text-xs text-muted-foreground">
            Check back soon for upcoming dates.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── Main Picker UI ──────────────────────────────────────────────────────────
  return (
    <Card className="border-border bg-card shadow-2xl sticky top-24 overflow-hidden rounded-[2.5rem]">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse" />

      <CardContent className="p-8 space-y-8">
        {/* ── STEP 1: VENUE ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic flex items-center gap-2">
            <LucideMapPin size={11} />
            1. Select {labels.venue}
          </p>

          <ScrollArea className={cn(venueGroups.length > 3 && "h-[170px] pr-2")}>
            <div className="space-y-2">
              {venueGroups.map(({ venue, shows: vShows }) => {
                const totalShows = vShows.length;
                const isSelected = selectedVenueId === venue._id;
                return (
                  <button
                    key={venue._id}
                    onClick={() => handleVenueSelect(venue._id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary shadow-lg"
                        : "border-border bg-background hover:bg-accent"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-black italic uppercase truncate",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {venue.name}
                      </p>
                      <p className="text-[10px] opacity-60 uppercase font-bold">
                        {venue.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <Badge
                        variant="secondary"
                        className="text-[9px] font-black uppercase"
                      >
                        {totalShows} show{totalShows !== 1 ? "s" : ""}
                      </Badge>
                      {isSelected && (
                        <LucideChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* ── STEP 2: DATE ──────────────────────────────────────────────── */}
        <div
          className={cn(
            "space-y-4 transition-all duration-500",
            !selectedVenueId && "opacity-30 pointer-events-none translate-y-1"
          )}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic flex items-center gap-2">
            <LucideCalendar size={11} />
            2. Select {labels.date}
          </p>

          {uniqueDates.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">
              No dates available for this venue.
            </p>
          ) : (
            <ScrollArea
              className={cn(uniqueDates.length > 5 && "h-[90px]")}
            >
              <div className="flex gap-2 flex-wrap">
                {uniqueDates.map((show) => {
                  const key = dateKey(show.startTime);
                  const dt = parseISO(show.startTime);
                  const isSelected = selectedDateKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleDateSelect(key)}
                      className={cn(
                        "flex flex-col items-center justify-center w-16 h-[72px] rounded-2xl border transition-all shrink-0",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-lg"
                          : "border-border bg-background hover:bg-accent text-foreground"
                      )}
                    >
                      <span className="text-[8px] font-black opacity-60 uppercase">
                        {format(dt, "EEE")}
                      </span>
                      <span className="text-xl font-black leading-none mt-0.5">
                        {format(dt, "d")}
                      </span>
                      <span className="text-[8px] font-black opacity-60 uppercase">
                        {format(dt, "MMM")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* ── STEP 3: TIME SLOT ─────────────────────────────────────────── */}
        <div
          className={cn(
            "space-y-4 transition-all duration-500",
            !selectedDateKey && "opacity-30 pointer-events-none translate-y-1"
          )}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic flex items-center gap-2">
            <LucideClock size={11} />
            3. Select {labels.time}
          </p>

          <div className="space-y-2">
            {showsOnDate.map((show) => {
              const availableSeats = getTotalAvailable(show.availability);
              const minPrice = getMinPrice(show.availability);
              const isSoldOut =
                show.status === "sold-out" || availableSeats === 0;
              const isSelected = selectedShowId === show._id;

              return (
                <button
                  key={show._id}
                  disabled={isSoldOut}
                  onClick={() => setSelectedShowId(show._id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all",
                    isSoldOut && "opacity-40 cursor-not-allowed",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary shadow-lg"
                      : !isSoldOut &&
                          "border-border bg-background hover:bg-accent"
                  )}
                >
                  <div className="space-y-0.5">
                    <p
                      className={cn(
                        "text-sm font-black italic uppercase",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {format(parseISO(show.startTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <LucideUsers size={9} />
                        {isSoldOut ? "Sold Out" : `${availableSeats} seats left`}
                      </span>
                      {show.availability.length > 1 && (
                        <span className="text-[9px] font-bold uppercase text-muted-foreground">
                          · {show.availability.length} sections
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {minPrice != null && (
                      <p
                        className={cn(
                          "text-xs font-black italic",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        LKR {minPrice.toLocaleString()}
                      </p>
                    )}
                    {isSoldOut ? (
                      <Badge variant="destructive" className="text-[8px]">
                        Full
                      </Badge>
                    ) : isSelected ? (
                      <LucideChevronRight className="w-4 h-4 text-primary" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER: PRICE + BOOK ──────────────────────────────────────── */}
        <Separator className="opacity-50" />

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold opacity-40 italic uppercase tracking-[0.2em] flex items-center gap-1">
                <LucideTicket size={9} />
                {selectedShow ? "From" : "Starting From"}
              </p>
              <p className="text-3xl font-black italic tracking-tighter">
                LKR{" "}
                {(
                  getMinPrice(selectedShow?.availability) ?? basePrice
                )?.toLocaleString()}
              </p>
            </div>

            {selectedShow && (
              <div className="text-right">
                <p className="text-[9px] opacity-50 uppercase font-black italic">
                  {format(parseISO(selectedShow.startTime), "dd MMM")}
                </p>
                <p className="text-xs font-black italic text-primary">
                  {format(parseISO(selectedShow.startTime), "hh:mm a")}
                </p>
              </div>
            )}
          </div>

          <RainbowButton
            disabled={!selectedShowId}
            onClick={handleBook}
            className={cn(
              "w-full h-16 text-sm font-black uppercase italic tracking-[0.2em]",
              !selectedShowId && "opacity-50 grayscale cursor-not-allowed"
            )}
          >
            {labels.book}
          </RainbowButton>
        </div>
      </CardContent>
    </Card>
  );
}
