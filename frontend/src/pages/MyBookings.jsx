import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, isPast, isFuture } from "date-fns";
import { toast } from "sonner";
import {
  LucideTicket,
  LucideMapPin,
  LucideCalendar,
  LucideClock,
  LucideAlertCircle,
  LucideLoader2,
  LucideX,
  LucideCheck,
  LucideQrCode,
  LucideTrash2,
  LucideArrowLeft,
  LucideFilm,
  LucideMusic,
  LucideTrophy,
  LucideDrama,
  LucideBanknote,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

// ── Category config ────────────────────────────────────────────────────────────

const CATEGORY = {
  movie: {
    icon: LucideFilm,
    gradient: "from-primary to-violet-500",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
  },
  concert: {
    icon: LucideMusic,
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  sports: {
    icon: LucideTrophy,
    gradient: "from-green-500 to-emerald-400",
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/30",
  },
  theatre: {
    icon: LucideDrama,
    gradient: "from-amber-500 to-orange-400",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
};

const STATUS = {
  confirmed: {
    label: "Confirmed",
    classes: "bg-green-500/15 text-green-500 border-green-500/30",
    icon: LucideCheck,
  },
  pending: {
    label: "Pending",
    classes: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    icon: LucideClock,
  },
  failed: {
    label: "Failed",
    classes: "bg-destructive/15 text-destructive border-destructive/30",
    icon: LucideX,
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function isUpcoming(booking) {
  const start = booking.show?.startTime;
  return start && isFuture(parseISO(start)) && booking.status !== "failed";
}

function isCancellable(booking) {
  return (
    isUpcoming(booking) &&
    !booking.isUsed &&
    (booking.status === "pending" || booking.status === "confirmed")
  );
}

function groupSeatsBySection(seats) {
  return seats.reduce((acc, s) => {
    (acc[s.section] ??= []).push(s.seatNumber);
    return acc;
  }, {});
}

// ── Skeleton loader ────────────────────────────────────────────────────────────

function TicketSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="flex gap-4 p-5">
        <Skeleton className="w-16 h-20 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Separator className="opacity-30" />
      <div className="flex items-center justify-between px-5 py-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-accent/60 border border-border flex items-center justify-center">
        <LucideTicket className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-black italic uppercase tracking-tight">No {label} tickets</p>
        <p className="text-xs text-muted-foreground">Your booked tickets will appear here.</p>
      </div>
      <Link to="/">
        <Button variant="outline" className="gap-2 text-xs font-black italic uppercase h-10 rounded-xl">
          Browse Events
        </Button>
      </Link>
    </div>
  );
}

// ── Cancel confirm dialog ──────────────────────────────────────────────────────

function CancelDialog({ open, onClose, onConfirm, booking, loading }) {
  const eventTitle = booking?.event?.title || "this event";
  const seats = booking?.seats?.length || 0;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl border-border bg-card max-w-sm">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto">
            <LucideTrash2 className="w-5 h-5 text-destructive" />
          </div>
          <DialogTitle className="text-center text-lg font-black italic uppercase tracking-tighter">
            Cancel Booking?
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            This will cancel your {seats} ticket{seats !== 1 ? "s" : ""} for{" "}
            <span className="font-bold text-foreground">{eventTitle}</span> and release the seats.
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1 h-11 text-xs font-black italic uppercase rounded-2xl"
            onClick={onClose}
            disabled={loading}
          >
            Keep It
          </Button>
          <Button
            variant="destructive"
            className="flex-1 h-11 text-xs font-black italic uppercase rounded-2xl gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <LucideLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LucideTrash2 className="w-4 h-4" />
            )}
            Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Ticket Card ────────────────────────────────────────────────────────────────

function TicketCard({ booking, onCancel }) {
  const category = booking.event?.category || "movie";
  const cat = CATEGORY[category] || CATEGORY.movie;
  const CatIcon = cat.icon;
  const status = STATUS[booking.status] || STATUS.pending;
  const StatusIcon = status.icon;

  const show = booking.show;
  const startTime = show?.startTime ? parseISO(show.startTime) : null;
  const upcoming = isUpcoming(booking);
  const cancellable = isCancellable(booking);
  const seatGroups = groupSeatsBySection(booking.seats || []);

  return (
    <article className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Category accent bar */}
      <div className={cn("h-1 w-full bg-gradient-to-r", cat.gradient)} />

      {/* Main content */}
      <div className="flex gap-4 p-5">
        {/* Poster / banner thumbnail */}
        <div className="relative shrink-0">
          {booking.event?.bannerImage ? (
            <img
              src={booking.event.bannerImage}
              alt={booking.event.title}
              className="w-16 h-20 object-cover rounded-2xl border border-border"
            />
          ) : (
            <div className={cn("w-16 h-20 rounded-2xl border flex items-center justify-center", cat.bg, cat.border)}>
              <CatIcon className={cn("w-6 h-6", cat.text)} />
            </div>
          )}
          {booking.isUsed && (
            <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
              <LucideCheck className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Badge className={cn("text-[8px] font-black uppercase border px-2 py-0", cat.bg, cat.text, cat.border)}>
                  {category}
                </Badge>
                {booking.isUsed && (
                  <Badge className="text-[8px] font-black uppercase bg-muted text-muted-foreground border-border">
                    Used
                  </Badge>
                )}
              </div>
              <p className="text-sm font-black italic uppercase tracking-tighter leading-tight truncate">
                {booking.event?.title || "—"}
              </p>
            </div>
            {/* Status badge */}
            <Badge
              className={cn(
                "text-[8px] font-black uppercase border shrink-0 gap-1 px-2",
                status.classes
              )}
            >
              <StatusIcon className="w-2.5 h-2.5" />
              {status.label}
            </Badge>
          </div>

          {/* Show details */}
          <div className="space-y-1">
            {show?.venue && (
              <p className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1.5">
                <LucideMapPin className={cn("w-3 h-3 shrink-0", cat.text)} />
                {show.venue.name}
                {show.venue.city && (
                  <span className="opacity-60">· {show.venue.city}</span>
                )}
              </p>
            )}
            {startTime && (
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1.5">
                  <LucideCalendar className={cn("w-3 h-3 shrink-0", cat.text)} />
                  {format(startTime, "dd MMM yyyy")}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1.5">
                  <LucideClock className={cn("w-3 h-3 shrink-0", cat.text)} />
                  {format(startTime, "hh:mm a")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="relative mx-5">
        <div className="border-t border-dashed border-border/70" />
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border border-border" />
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border border-border" />
      </div>

      {/* Ticket stub — seats + total + action */}
      <div className="px-5 py-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          {/* Seat badges grouped by section */}
          {Object.entries(seatGroups).map(([section, seatNums]) => (
            <div key={section} className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-black uppercase text-muted-foreground/60 shrink-0">
                {section}
              </span>
              {seatNums.map((n) => (
                <span
                  key={n}
                  className={cn(
                    "text-[9px] font-black uppercase px-1.5 py-0.5 rounded border",
                    n === "GA"
                      ? "bg-accent/60 text-muted-foreground border-border/50"
                      : cn(cat.bg, cat.text, cat.border)
                  )}
                >
                  {n === "GA" ? "GA" : n}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Total */}
          <div className="text-right">
            <p className="text-[9px] font-black uppercase text-muted-foreground">Total</p>
            <p className="text-base font-black italic tracking-tighter">
              LKR {booking.totalAmount?.toLocaleString()}
            </p>
          </div>

          {/* Actions */}
          {booking._id && (
            <div className="flex items-center gap-2">
              {cancellable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => onCancel(booking)}
                >
                  <LucideTrash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking ref */}
      <div className="px-5 pb-4">
        <p className="text-[9px] font-mono text-muted-foreground/40 flex items-center gap-1 truncate">
          <LucideQrCode className="w-2.5 h-2.5 shrink-0" />
          {booking._id}
        </p>
      </div>
    </article>
  );
}

// ── Stats bar ──────────────────────────────────────────────────────────────────

function StatsBar({ bookings }) {
  const upcoming = bookings.filter(isUpcoming).length;
  const totalSpent = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((s, b) => s + (b.totalAmount || 0), 0);
  const totalSeats = bookings.reduce((s, b) => s + (b.seats?.length || 0), 0);

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Total Bookings", value: bookings.length, icon: LucideTicket },
        { label: "Upcoming", value: upcoming, icon: LucideCalendar },
        { label: "Total Spent", value: `LKR ${totalSpent.toLocaleString()}`, icon: LucideBanknote },
      ].map(({ label, value, icon: Icon }) => (
        <Card key={label} className="border-border bg-card/60 rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground truncate">
                {label}
              </p>
              <p className="text-base font-black italic tracking-tighter truncate">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Ticket list ────────────────────────────────────────────────────────────────

function TicketList({ bookings, onCancel, emptyLabel }) {
  if (bookings.length === 0) return <EmptyState label={emptyLabel} />;
  return (
    <div className="space-y-4">
      {bookings.map((booking, i) => (
        <BlurFade key={booking._id} delay={0.05 * i}>
          <TicketCard booking={booking} onCancel={onCancel} />
        </BlurFade>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get("/bookings/mybookings", { signal: controller.signal })
      .then((res) => setBookings(res.data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") setError("Could not load your bookings.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const { upcomingList, pastList } = useMemo(() => {
    const sorted = [...bookings].sort(
      (a, b) =>
        new Date(b.show?.startTime || b.createdAt) -
        new Date(a.show?.startTime || a.createdAt)
    );
    return {
      upcomingList: sorted
        .filter(isUpcoming)
        .sort((a, b) => new Date(a.show?.startTime) - new Date(b.show?.startTime)),
      pastList: sorted.filter((b) => !isUpcoming(b)),
    };
  }, [bookings]);

  // ── Cancel ──────────────────────────────────────────────────────────────────
  async function handleCancelConfirm() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await apiClient.delete(`/bookings/${cancelTarget._id}`);
      setBookings((prev) => prev.filter((b) => b._id !== cancelTarget._id));
      toast.success("Booking cancelled and seats released.");
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking.");
    } finally {
      setCancelling(false);
    }
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-8">
        <LucideAlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-lg font-black italic uppercase">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="gap-2 text-xs font-black italic uppercase">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <BlurFade delay={0.05}>
        <div className="border-b border-border bg-background/90 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase italic tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <LucideArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary italic">
                  {user?.name || "Your Account"}
                </p>
                <h1 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">
                  My Tickets
                </h1>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <LucideTicket className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 space-y-6">

        {/* Stats */}
        {!loading && bookings.length > 0 && (
          <BlurFade delay={0.1}>
            <StatsBar bookings={bookings} />
          </BlurFade>
        )}

        {/* Tabs */}
        <BlurFade delay={0.15}>
          <Tabs defaultValue="all">
            <TabsList className="bg-accent/40 border border-border rounded-2xl p-1.5 h-auto w-full gap-1">
              {[
                { value: "all", label: "All", count: bookings.length },
                { value: "upcoming", label: "Upcoming", count: upcomingList.length },
                { value: "past", label: "Past", count: pastList.length },
              ].map(({ value, label, count }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex-1 rounded-xl text-[10px] font-black uppercase italic tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 gap-1.5"
                >
                  {label}
                  {!loading && count > 0 && (
                    <span className="text-[8px] opacity-70">({count})</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All */}
            <TabsContent value="all" className="mt-5">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <TicketSkeleton key={i} />)}
                </div>
              ) : (
                <TicketList
                  bookings={[...upcomingList, ...pastList]}
                  onCancel={setCancelTarget}
                  emptyLabel="booked"
                />
              )}
            </TabsContent>

            {/* Upcoming */}
            <TabsContent value="upcoming" className="mt-5">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => <TicketSkeleton key={i} />)}
                </div>
              ) : (
                <TicketList
                  bookings={upcomingList}
                  onCancel={setCancelTarget}
                  emptyLabel="upcoming"
                />
              )}
            </TabsContent>

            {/* Past */}
            <TabsContent value="past" className="mt-5">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => <TicketSkeleton key={i} />)}
                </div>
              ) : (
                <TicketList
                  bookings={pastList}
                  onCancel={setCancelTarget}
                  emptyLabel="past"
                />
              )}
            </TabsContent>
          </Tabs>
        </BlurFade>
      </div>

      {/* ── Cancel dialog ───────────────────────────────────────────────────── */}
      <CancelDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        booking={cancelTarget}
        loading={cancelling}
      />
    </div>
  );
}
