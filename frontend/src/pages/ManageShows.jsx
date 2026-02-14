import React, { useState, useEffect } from 'react';
import API from '../lib/axios';
import { toast } from 'sonner';
import { format } from "date-fns";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import {
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MoreHorizontal, Plus, Trash2, Edit2, MapPin, 
  Loader2, AlertTriangle, Calendar, Layers, DollarSign 
} from "lucide-react";

// Magic UI Integration
import { RainbowButton } from "@/components/ui/rainbow-button";

const EventShowsManager = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editShow, setEditShow] = useState(null);
  const [showToDelete, setShowToDelete] = useState(null);
  
  const [newShow, setNewShow] = useState({
    event: '', venue: '', startTime: '', endTime: '', availability: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventRes, showRes, venueRes] = await Promise.all([
        API.get('/events/me'),
        API.get('/shows'),
        API.get('/venues')
      ]);
      setEvents(eventRes.data);
      setShows(showRes.data);
      setVenues(venueRes.data);
    } catch (err) {
      toast.error("Failed to sync management data");
    } finally {
      setLoading(false);
    }
  };

  const handleVenueSelect = (venueId) => {
    const selectedVenue = venues.find(v => v._id === venueId);
    if (selectedVenue) {
      const initialAvailability = selectedVenue.sections.map(section => ({
        sectionId: section._id,
        sectionName: section.name,
        totalSeats: section.totalCapacity || (section.rows * section.seatsPerRow),
        availableSeats: section.totalCapacity || (section.rows * section.seatsPerRow),
        price: 0
      }));
      setNewShow({ ...newShow, venue: venueId, availability: initialAvailability });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await API.post('/shows', newShow);
      setShows([...shows, res.data]);
      setIsCreateOpen(false);
      setNewShow({ event: '', venue: '', startTime: '', endTime: '', availability: [] });
      toast.success("New show scheduled!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create show");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await API.put(`/shows/${editShow._id}`, editShow);
      setShows(shows.map(s => s._id === res.data._id ? res.data : s));
      setEditShow(null);
      toast.success("Show time updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitLoading(true);
    try {
      await API.delete(`/shows/${showToDelete._id}`);
      setShows(shows.filter(s => s._id !== showToDelete._id));
      setShowToDelete(null);
      toast.success("Show deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Show Management</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage showtimes for your events.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            {/* --- Updated Trigger Button --- */}
            <RainbowButton className="h-11 px-6 text-sm font-semibold transition-all shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Schedule Show
            </RainbowButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Schedule New Show
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleCreateSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event</Label>
                  <Select onValueChange={(val) => setNewShow({...newShow, event: val})}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Event" /></SelectTrigger>
                    <SelectContent>{events.map(e => <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Venue</Label>
                  <Select onValueChange={handleVenueSelect}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select Venue" /></SelectTrigger>
                    <SelectContent>{venues.map(v => <SelectItem key={v._id} value={v._id}>{v.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Time</Label>
                  <Input type="datetime-local" className="h-11" required onChange={(e) => setNewShow({...newShow, startTime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Time</Label>
                  <Input type="datetime-local" className="h-11" onChange={(e) => setNewShow({...newShow, endTime: e.target.value})} />
                </div>
              </div>

              {newShow.availability.length > 0 && (
                <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-primary" />
                    <Label className="text-xs font-bold uppercase">Pricing per Section</Label>
                  </div>
                  <div className="grid gap-3">
                    {newShow.availability.map((section, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border bg-card rounded-lg shadow-sm">
                        <div>
                          <p className="text-sm font-medium">{section.sectionName}</p>
                          <p className="text-[11px] text-muted-foreground">Capacity: {section.totalSeats}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input 
                              type="number" 
                              className="w-28 h-9 pl-8 font-medium" 
                              placeholder="Price" 
                              required
                              onChange={(e) => {
                                const updated = [...newShow.availability];
                                updated[idx].price = Number(e.target.value);
                                setNewShow({...newShow, availability: updated});
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                {/* Internal Submit Button */}
                <RainbowButton 
                  type="submit" 
                  disabled={isSubmitLoading} 
                  className="w-full h-11 font-semibold uppercase tracking-wider text-xs"
                >
                  {isSubmitLoading ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <Calendar className="mr-2 h-4 w-4" />
                  )}
                  Confirm Schedule
                </RainbowButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {events.map((event) => {
          const eventShows = shows.filter(s => s.event?._id === event._id || s.event === event._id);
          return (
            <AccordionItem key={event._id} value={event._id} className="border rounded-xl px-5 bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-6 text-left">
                  <img src={event.posterImage || "/api/placeholder/48/72"} alt="" className="w-12 h-18 object-cover rounded-md bg-muted border shadow-sm" />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="outline" className="capitalize text-[10px]">{event.category}</Badge>
                      <Badge variant="secondary" className="text-[10px] font-medium">{eventShows.length} Shows</Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="text-[11px] uppercase font-semibold">Date & Time</TableHead>
                        <TableHead className="text-[11px] uppercase font-semibold">Venue</TableHead>
                        <TableHead className="text-[11px] uppercase font-semibold">Availability</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventShows.length > 0 ? (
                        eventShows.map((show) => (
                          <TableRow key={show._id}>
                            <TableCell className="font-medium">
                              {format(new Date(show.startTime), "PPP")}
                              <span className="text-muted-foreground block text-xs mt-0.5">{format(new Date(show.startTime), "p")}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                {show.venue?.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {show.availability.reduce((acc, curr) => acc + curr.availableSeats, 0)} Seats
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel className="text-xs">Management</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => setEditShow(show)}>
                                    <Edit2 className="mr-2 h-4 w-4" /> Edit Time
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive font-medium" onClick={() => setShowToDelete(show)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Show
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-20 text-center text-muted-foreground text-sm">
                            No shows currently scheduled.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* --- EDIT DIALOG --- */}
      <Dialog open={!!editShow} onOpenChange={() => setEditShow(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Edit Show Time</DialogTitle></DialogHeader>
          {editShow && (
            <form onSubmit={handleUpdate} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="start">Start Time</Label>
                <Input id="start" type="datetime-local" value={new Date(editShow.startTime).toISOString().slice(0, 16)} 
                  onChange={(e) => setEditShow({...editShow, startTime: e.target.value})} required />
              </div>
              <DialogFooter><Button type="submit" disabled={isSubmitLoading} className="w-full">Save Changes</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* --- DELETE DRAWER --- */}
      <Drawer open={!!showToDelete} onOpenChange={() => setShowToDelete(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-center pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <DrawerTitle>Cancel Show?</DrawerTitle>
              <DrawerDescription>This will permanently remove this showtime and prevent further bookings.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pb-8">
              <Button variant="destructive" size="lg" onClick={handleDelete} disabled={isSubmitLoading}>Confirm Deletion</Button>
              <DrawerClose asChild><Button variant="outline" size="lg">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EventShowsManager;