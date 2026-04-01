import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  LucideArrowLeft,
  LucideMapPin,
  LucideCalendar,
  LucideClock,
  LucideTicket,
  LucideCheck,
  LucideLoader2,
  LucideAlertCircle,
  LucideMinus,
  LucidePlus,
  LucideUsers,
  LucideX,
  LucideHome,
  LucideQrCode,
  LucideChevronUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/ui/blur-fade";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

// ── Helpers ────────────────────────────────────────────────────────────────────

function generateSeatGrid(rows, seatsPerRow) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    const seats = [];
    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push(`${rowLetter}${s}`);
    }
    grid.push({ rowLetter, seats });
  }
  return grid;
}

// ── Loading / Error Screens ───────────────────────────────────────────────────

function FullPageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <LucideLoader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-black uppercase italic tracking-widest text-muted-foreground">
        Loading Show Details...
      </p>
    </div>
  );
}

function FullPageError({ message }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-8">
      <LucideAlertCircle className="w-10 h-10 text-destructive" />
      <p className="text-xl font-black italic uppercase">{message}</p>
      <Link to="/">
        <Button variant="outline" className="gap-2">
          <LucideArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </Link>
    </div>
  );
}

// ── Confirmation Screen ───────────────────────────────────────────────────────

function ConfirmationScreen({ booking, show }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <BlurFade delay={0.1}>
        <div className="max-w-lg w-full space-y-6 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <LucideCheck className="w-10 h-10 text-primary" strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
              Booking Confirmed
            </p>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              You're In!
            </h1>
            <p className="text-muted-foreground text-sm">
              Your seats have been reserved. Complete payment to receive your tickets.
            </p>
          </div>

          {/* Ticket Card */}
          <Card className="border-border bg-card rounded-3xl overflow-hidden shadow-2xl text-left">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-primary" />
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-primary italic">Event</p>
                <p className="text-xl font-black italic uppercase tracking-tighter mt-0.5">
                  {show?.event?.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground">Venue</p>
                  <p className="text-sm font-bold uppercase italic">{show?.venue?.name}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground">City</p>
                  <p className="text-sm font-bold uppercase italic">{show?.venue?.city}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground">Date</p>
                  <p className="text-sm font-bold uppercase italic">
                    {show?.startTime ? format(parseISO(show.startTime), "dd MMM yyyy") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground">Time</p>
                  <p className="text-sm font-bold uppercase italic">
                    {show?.startTime ? format(parseISO(show.startTime), "hh:mm a") : "—"}
                  </p>
                </div>
              </div>

              <Separator className="opacity-40" />

              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground">Seats</p>
                <div className="flex flex-wrap gap-1.5">
                  {booking?.seats?.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-black uppercase">
                      {s.seatNumber === "GA" ? `${s.section} GA` : s.seatNumber}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground">Total</p>
                  <p className="text-2xl font-black italic tracking-tighter">
                    LKR {booking?.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "text-[9px] font-black uppercase italic",
                    booking?.status === "confirmed"
                      ? "bg-green-500/20 text-green-500 border-green-500/30"
                      : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                  )}
                >
                  {booking?.status}
                </Badge>
              </div>

              {booking?._id && (
                <div className="bg-accent/50 rounded-2xl p-4 space-y-1">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground flex items-center gap-1.5">
                    <LucideQrCode size={10} /> Booking Reference
                  </p>
                  <p className="text-xs font-mono font-bold text-primary break-all">{booking._id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2 h-12 font-black italic uppercase text-xs">
                <LucideHome className="w-4 h-4" /> Home
              </Button>
            </Link>
            <Link to="/mybookings" className="flex-1">
              <RainbowButton className="w-full h-12 text-xs font-black uppercase italic tracking-widest">
                My Bookings
              </RainbowButton>
            </Link>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}

// ── Seat Cell ─────────────────────────────────────────────────────────────────

function SeatCell({ seatId, isBooked, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isBooked}
      aria-label={isBooked ? `Seat ${seatId} taken` : `Seat ${seatId}`}
      aria-pressed={isSelected}
      className={cn(
        // min 44×44 touch target via padding trick, visual is 32×28
        "relative flex items-center justify-center rounded-t-md text-[8px] font-black",
        "transition-all duration-150 border select-none",
        "w-7 h-7 sm:w-8 sm:h-7",
        isBooked
          ? "bg-accent/30 border-border/30 text-muted-foreground/30 cursor-not-allowed"
          : isSelected
          ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30 z-10"
          : "bg-background border-border hover:bg-primary/20 hover:border-primary/50 hover:scale-105 active:scale-95 cursor-pointer text-foreground/60"
      )}
    >
      {seatId.slice(1)}
    </button>
  );
}

// ── Seated Section Map ────────────────────────────────────────────────────────

function SeatedSectionMap({ section, selectedSeats, onToggleSeat }) {
  const seatGrid = useMemo(
    () => generateSeatGrid(section.rows, section.seatsPerRow),
    [section.rows, section.seatsPerRow]
  );

  const bookedSet = useMemo(() => new Set(section.bookedSeats || []), [section.bookedSeats]);
  // selectedSeats is already a Set passed from parent — no copy needed
  const selectedSet = selectedSeats instanceof Set ? selectedSeats : new Set();

  if (!section.rows || !section.seatsPerRow) {
    return (
      <p className="text-center text-sm text-muted-foreground italic py-12">
        Seat layout not available for this section.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Screen / Stage glow */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="w-3/4 max-w-xs h-1.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_6px_hsl(var(--primary)/0.35)]" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 italic">
          {["General", "GA", "Floor"].includes(section.sectionName) ? "Stage" : "Screen"}
        </p>
      </div>

      {/* Horizontal-scrollable seat grid */}
      <div className="overflow-x-auto -mx-2 px-2 pb-3">
        <div className="flex flex-col items-center gap-1.5 min-w-fit mx-auto">
          {seatGrid.map(({ rowLetter, seats }) => (
            <div key={rowLetter} className="flex items-center gap-1 sm:gap-1.5">
              <span className="w-5 text-[9px] font-black text-muted-foreground/50 uppercase text-right shrink-0">
                {rowLetter}
              </span>
              {seats.map((seatId) => (
                <SeatCell
                  key={seatId}
                  seatId={seatId}
                  isBooked={bookedSet.has(seatId)}
                  isSelected={selectedSet.has(seatId)}
                  onClick={() => onToggleSeat(section.sectionName, seatId)}
                />
              ))}
              <span className="w-5 text-[9px] font-black text-muted-foreground/50 uppercase text-left shrink-0">
                {rowLetter}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Standing / GA Section ─────────────────────────────────────────────────────

function StandingSection({ section, quantity, onQuantityChange }) {
  const maxQty = section.availableSeats || 0;
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <div className="space-y-2 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
          <LucideUsers className="w-7 h-7 text-primary" />
        </div>
        <p className="text-base font-black italic uppercase tracking-tighter">{section.sectionName}</p>
        <p className="text-xs text-muted-foreground">
          General Admission · {maxQty} spots remaining
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-border hover:border-primary hover:bg-primary/10 active:scale-95"
          onClick={() => onQuantityChange(section.sectionName, Math.max(0, quantity - 1))}
          disabled={quantity <= 0}
        >
          <LucideMinus className="w-4 h-4" />
        </Button>

        <div className="text-center w-14">
          <p className="text-4xl font-black italic">{quantity}</p>
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
            Ticket{quantity !== 1 ? "s" : ""}
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-border hover:border-primary hover:bg-primary/10 active:scale-95"
          onClick={() => onQuantityChange(section.sectionName, Math.min(maxQty, quantity + 1))}
          disabled={quantity >= maxQty}
        >
          <LucidePlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 text-center">
        <div className="px-5 py-3 rounded-2xl bg-accent/50 border border-border">
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Each</p>
          <p className="text-lg font-black italic tracking-tighter mt-0.5">
            LKR {section.price?.toLocaleString()}
          </p>
        </div>
        <div className="px-5 py-3 rounded-2xl bg-primary/10 border border-primary/30">
          <p className="text-[9px] uppercase tracking-widest text-primary font-black">Subtotal</p>
          <p className="text-lg font-black italic tracking-tighter mt-0.5 text-primary">
            LKR {(quantity * (section.price || 0)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center justify-center gap-5 flex-wrap">
      {[
        { color: "bg-background border border-border", label: "Available" },
        { color: "bg-primary border-primary", label: "Selected" },
        { color: "bg-accent/30 border border-border/30", label: "Taken" },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={cn("w-3.5 h-3.5 rounded-sm", color)} />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Order Summary Content (shared between sidebar and drawer) ─────────────────

function OrderSummaryContent({ show, orderItems, totalAmount, totalSeats, isAuthenticated, submitting, onBook }) {
  return (
    <div className="space-y-5">
      {/* Event info */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary italic flex items-center gap-1.5">
          <LucideTicket size={10} /> Order Summary
        </p>
        <p className="text-base font-black italic uppercase tracking-tighter mt-1 leading-tight">
          {show.event?.title}
        </p>
        <div className="flex flex-col gap-0.5 mt-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <LucideMapPin size={9} className="text-primary shrink-0" />
            {show.venue?.name}, {show.venue?.city}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <LucideClock size={9} className="text-primary shrink-0" />
            {format(parseISO(show.startTime), "dd MMM yyyy · hh:mm a")}
          </span>
        </div>
      </div>

      <Separator className="opacity-40" />

      {/* Line items */}
      {orderItems.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <div className="w-9 h-9 rounded-full bg-accent/50 flex items-center justify-center mx-auto">
            <LucideTicket className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground font-bold uppercase italic">No seats selected</p>
          <p className="text-[10px] text-muted-foreground/60">Pick seats from the map</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div key={item.sectionName} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase italic text-muted-foreground">
                  {item.sectionName}
                </p>
                {!item.isStanding && item.selectedSeatList.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.selectedSeatList.map((s) => (
                      <span key={s} className="text-[9px] font-black bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {item.isStanding && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.gaQty} × GA</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black italic tracking-tighter">
                  LKR {item.subtotal.toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground font-bold">
                  {item.count} × {item.price?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Separator className="opacity-40" />

      {/* Totals */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground">
          <span>Subtotal</span>
          <span>LKR {totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground">
          <span>Service Fee</span>
          <span className="text-green-500 dark:text-green-400">Free</span>
        </div>
        <div className="flex items-center justify-between pt-1.5">
          <p className="text-xs font-black uppercase italic text-muted-foreground">Total</p>
          <p className="text-2xl font-black italic tracking-tighter">
            LKR {totalAmount.toLocaleString()}
          </p>
        </div>
        {totalSeats > 0 && (
          <p className="text-[9px] text-muted-foreground text-right">
            {totalSeats} ticket{totalSeats !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* CTA */}
      <RainbowButton
        disabled={totalSeats === 0 || submitting}
        onClick={onBook}
        className={cn(
          "w-full h-14 text-sm font-black uppercase italic tracking-[0.15em] gap-2",
          (totalSeats === 0 || submitting) && "opacity-50 grayscale cursor-not-allowed"
        )}
      >
        {submitting ? (
          <><LucideLoader2 className="w-4 h-4 animate-spin" /> Processing...</>
        ) : (
          <>Confirm Booking{totalSeats > 0 && <span className="opacity-70"> · {totalSeats}</span>}</>
        )}
      </RainbowButton>

      {!isAuthenticated && (
        <p className="text-[9px] text-center text-muted-foreground italic">
          You'll be prompted to log in before confirming.
        </p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SeatBooking() {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // { sectionName: Set<seatId> }
  const [selectedSeats, setSelectedSeats] = useState({});
  // { sectionName: number }
  const [gaQuantities, setGaQuantities] = useState({});

  // ── Fetch Show ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showId) return;
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get(`/shows/${showId}`, { signal: controller.signal })
      .then((res) => setShow(res.data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") setError("Show not found or no longer available.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [showId]);

  // ── Merge availability with venue section layout ─────────────────────────────
  const mergedSections = useMemo(() => {
    if (!show) return [];
    return show.availability.map((avail) => {
      const venueSection = show.venue?.sections?.find((vs) => vs.name === avail.sectionName);
      return {
        ...avail,
        rows: venueSection?.rows || 0,
        seatsPerRow: venueSection?.seatsPerRow || 0,
        isStanding: venueSection?.isStanding || false,
        totalCapacity: venueSection?.totalCapacity || 0,
      };
    });
  }, [show]);

  // ── Seat interactions ────────────────────────────────────────────────────────
  function handleToggleSeat(sectionName, seatId) {
    setSelectedSeats((prev) => {
      const current = new Set(prev[sectionName] || []);
      current.has(seatId) ? current.delete(seatId) : current.add(seatId);
      return { ...prev, [sectionName]: current };
    });
  }

  function handleGaQuantity(sectionName, qty) {
    setGaQuantities((prev) => ({ ...prev, [sectionName]: qty }));
  }

  function handleClearSection(sectionName) {
    setSelectedSeats((prev) => ({ ...prev, [sectionName]: new Set() }));
    setGaQuantities((prev) => ({ ...prev, [sectionName]: 0 }));
  }

  // ── Order computation ────────────────────────────────────────────────────────
  const orderItems = useMemo(() => {
    return mergedSections
      .map((section) => {
        const seats = Array.from(selectedSeats[section.sectionName] || []);
        const gaQty = gaQuantities[section.sectionName] || 0;
        const count = section.isStanding ? gaQty : seats.length;
        const subtotal = count * (section.price || 0);
        return { ...section, selectedSeatList: seats, gaQty, count, subtotal };
      })
      .filter((item) => item.count > 0);
  }, [mergedSections, selectedSeats, gaQuantities]);

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalSeats = orderItems.reduce((sum, item) => sum + item.count, 0);

  // ── Booking submission ───────────────────────────────────────────────────────
  async function handleBooking() {
    if (!isAuthenticated) {
      toast.error("Please log in to book tickets.");
      navigate("/login");
      return;
    }
    if (totalSeats === 0) return;

    const seatsPayload = orderItems.flatMap((item) =>
      item.isStanding
        ? Array.from({ length: item.gaQty }, () => ({ section: item.sectionName, seatNumber: "GA" }))
        : item.selectedSeatList.map((seatId) => ({ section: item.sectionName, seatNumber: seatId }))
    );

    setSubmitting(true);
    try {
      const res = await apiClient.post("/bookings", { showId, seats: seatsPayload, totalAmount });
      setBookingResult(res.data.booking);
      setConfirmed(true);
      toast.success("Booking confirmed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) return <FullPageLoader />;
  if (error || !show) return <FullPageError message={error || "Show not found."} />;
  if (confirmed) return <ConfirmationScreen booking={bookingResult} show={show} />;

  const defaultTab = mergedSections[0]?.sectionName || "";

  const summaryProps = { show, orderItems, totalAmount, totalSeats, isAuthenticated, submitting, onBook: handleBooking };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Sticky Header ──────────────────────────────────────────────────────── */}
      <BlurFade delay={0.05}>
        <div className="border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-black italic uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <LucideArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Title */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <p className="text-sm font-black italic uppercase truncate tracking-tighter">
                {show.event?.title}
              </p>
              <Badge variant="secondary" className="text-[9px] font-black uppercase shrink-0 hidden sm:inline-flex">
                {show.event?.category}
              </Badge>
            </div>

            {/* Show meta — collapses on mobile */}
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-muted-foreground shrink-0">
              <span className="hidden md:flex items-center gap-1">
                <LucideMapPin className="w-3 h-3 text-primary" />
                {show.venue?.name}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <LucideCalendar className="w-3 h-3 text-primary" />
                {format(parseISO(show.startTime), "dd MMM")}
              </span>
              <span className="flex items-center gap-1">
                <LucideClock className="w-3 h-3 text-primary" />
                {format(parseISO(show.startTime), "hh:mm a")}
              </span>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      {/* pb-[88px] on mobile reserves space for the fixed bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pb-[88px] lg:pb-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8">

        {/* ── Left: Seat Map ──────────────────────────────────────────────────── */}
        <BlurFade delay={0.1}>
          <div className="space-y-5">
            {mergedSections.length > 0 && (
              <Tabs defaultValue={defaultTab} className="w-full">
                {/* Section Tabs */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Sections
                  </p>
                  <TabsList className="bg-accent/40 border border-border rounded-2xl p-1.5 h-auto flex-wrap gap-1 w-full justify-start">
                    {mergedSections.map((section) => {
                      const count = section.isStanding
                        ? gaQuantities[section.sectionName] || 0
                        : selectedSeats[section.sectionName]?.size || 0;
                      return (
                        <TabsTrigger
                          key={section.sectionName}
                          value={section.sectionName}
                          className="rounded-xl text-[10px] font-black uppercase italic tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-2 gap-1.5 h-auto"
                        >
                          {section.sectionName}
                          {count > 0 && (
                            <Badge className="bg-primary-foreground/20 text-[8px] h-4 px-1.5 font-black min-w-[16px]">
                              {count}
                            </Badge>
                          )}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>

                {mergedSections.map((section) => (
                  <TabsContent key={section.sectionName} value={section.sectionName} className="mt-4">
                    <Card className="border-border bg-card rounded-3xl overflow-hidden shadow-lg">
                      {/* Section Header */}
                      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3 border-b border-border/50">
                        <div>
                          <p className="text-sm font-black italic uppercase tracking-tight">
                            {section.sectionName}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">
                            {section.isStanding
                              ? "General Admission"
                              : `${section.rows} rows × ${section.seatsPerRow} seats`}
                            {" · "}
                            <span className="text-primary">
                              LKR {section.price?.toLocaleString()} each
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[9px] font-black uppercase",
                              section.availableSeats === 0
                                ? "bg-destructive/20 text-destructive"
                                : section.availableSeats < 10
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-green-500/20 text-green-600 dark:text-green-400"
                            )}
                          >
                            {section.availableSeats === 0
                              ? "Sold Out"
                              : `${section.availableSeats} left`}
                          </Badge>
                          {(selectedSeats[section.sectionName]?.size > 0 ||
                            gaQuantities[section.sectionName] > 0) && (
                            <button
                              onClick={() => handleClearSection(section.sectionName)}
                              className="text-[9px] font-black uppercase text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                            >
                              <LucideX className="w-3 h-3" /> Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-4 sm:p-6">
                        {section.isStanding ? (
                          <StandingSection
                            section={section}
                            quantity={gaQuantities[section.sectionName] || 0}
                            onQuantityChange={handleGaQuantity}
                          />
                        ) : (
                          <SeatedSectionMap
                            section={section}
                            selectedSeats={selectedSeats[section.sectionName]}
                            onToggleSeat={handleToggleSeat}
                          />
                        )}
                      </CardContent>
                    </Card>

                    {!section.isStanding && (
                      <div className="mt-4">
                        <Legend />
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </BlurFade>

        {/* ── Right: Order Summary — desktop only ─────────────────────────────── */}
        <BlurFade delay={0.15}>
          <div className="hidden lg:block relative">
            <Card className="border-border bg-card shadow-2xl sticky top-20 rounded-[2rem] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary" />
              <CardContent className="p-7">
                <OrderSummaryContent {...summaryProps} />
              </CardContent>
            </Card>
          </div>
        </BlurFade>
      </div>

      {/* ── Mobile: Fixed Bottom Bar ──────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">

          {/* Tap to open Order Summary Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-accent/40 border border-border text-left active:bg-accent/70 transition-colors">
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none">
                    {totalSeats === 0
                      ? "No seats selected"
                      : `${totalSeats} seat${totalSeats !== 1 ? "s" : ""} selected`}
                  </p>
                  <p className="text-xl font-black italic tracking-tighter leading-tight mt-0.5 truncate">
                    {totalAmount > 0 ? `LKR ${totalAmount.toLocaleString()}` : "—"}
                  </p>
                </div>
                <LucideChevronUp className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
              </button>
            </DrawerTrigger>

            <DrawerContent className="px-4 pb-6">
              <DrawerHeader className="pb-2">
                <DrawerTitle className="text-sm font-black italic uppercase tracking-tighter text-left sr-only">
                  Order Summary
                </DrawerTitle>
              </DrawerHeader>
              <OrderSummaryContent {...summaryProps} />
              <DrawerClose asChild>
                <button className="mt-4 w-full text-center text-xs font-black uppercase italic text-muted-foreground hover:text-foreground transition-colors py-2">
                  Close
                </button>
              </DrawerClose>
            </DrawerContent>
          </Drawer>

          {/* Quick Book Button */}
          <RainbowButton
            disabled={totalSeats === 0 || submitting}
            onClick={handleBooking}
            className={cn(
              "h-14 px-5 text-xs font-black uppercase italic tracking-wider shrink-0",
              (totalSeats === 0 || submitting) && "opacity-50 grayscale cursor-not-allowed"
            )}
          >
            {submitting ? (
              <LucideLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Book"
            )}
          </RainbowButton>
        </div>
      </div>
    </div>
  );
}
