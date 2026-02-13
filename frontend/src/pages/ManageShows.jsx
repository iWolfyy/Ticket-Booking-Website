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
import { MoreHorizontal, Plus, Trash2, Edit2, MapPin, Loader2, AlertTriangle, Calendar } from "lucide-react";

const EventShowsManager = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  
  // Dialog/Drawer States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editShow, setEditShow] = useState(null);
  const [showToDelete, setShowToDelete] = useState(null);
  
  // New Show Form State
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Show Management</h1>
          <p className="text-muted-foreground">Schedule and manage showtimes for your events.</p>
        </div>

        {/* --- CREATE SHOW DIALOG --- */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Schedule Show</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Schedule New Show</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Event</Label>
                  <Select onValueChange={(val) => setNewShow({...newShow, event: val})}>
                    <SelectTrigger><SelectValue placeholder="Choose Event" /></SelectTrigger>
                    <SelectContent>{events.map(e => <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Venue</Label>
                  <Select onValueChange={handleVenueSelect}>
                    <SelectTrigger><SelectValue placeholder="Choose Venue" /></SelectTrigger>
                    <SelectContent>{venues.map(v => <SelectItem key={v._id} value={v._id}>{v.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="datetime-local" required onChange={(e) => setNewShow({...newShow, startTime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>End Time (Optional)</Label>
                  <Input type="datetime-local" onChange={(e) => setNewShow({...newShow, endTime: e.target.value})} />
                </div>
              </div>
              {newShow.availability.length > 0 && (
                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-semibold uppercase text-muted-foreground">Section Pricing</Label>
                  {newShow.availability.map((section, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                      <div className="text-sm">
                        <p className="font-medium">{section.sectionName}</p>
                        <p className="text-xs text-muted-foreground">Capacity: {section.totalSeats}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">$</span>
                        <Input type="number" className="w-24 h-8 bg-background" placeholder="Price" required
                          onChange={(e) => {
                            const updated = [...newShow.availability];
                            updated[idx].price = Number(e.target.value);
                            setNewShow({...newShow, availability: updated});
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitLoading}>
                  {isSubmitLoading ? <Loader2 className="animate-spin mr-2" /> : <Calendar className="mr-2 h-4 w-4" />} Confirm Schedule
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {events.map((event) => {
          const eventShows = shows.filter(s => s.event?._id === event._id || s.event === event._id);
          return (
            <AccordionItem key={event._id} value={event._id} className="border rounded-xl px-4 bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-6 text-left">
                  <img src={event.posterImage || "/api/placeholder/48/72"} alt="" className="w-12 h-18 object-cover rounded-md bg-muted" />
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">{event.title}</h3>
                    <Badge variant="outline" className="capitalize">{event.category}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Available Seats</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventShows.map((show) => (
                      <TableRow key={show._id}>
                        <TableCell className="font-medium">{format(new Date(show.startTime), "PPP p")}</TableCell>
                        <TableCell><div className="flex items-center gap-2 text-sm"><MapPin className="h-3.5 w-3.5" />{show.venue?.name}</div></TableCell>
                        <TableCell>{show.availability.reduce((acc, curr) => acc + curr.availableSeats, 0)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setEditShow(show)}><Edit2 className="mr-2 h-4 w-4" /> Edit Time</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive font-medium" onClick={() => setShowToDelete(show)}><Trash2 className="mr-2 h-4 w-4" /> Delete Show</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              <DialogFooter><Button type="submit" disabled={isSubmitLoading}>Save Changes</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* --- DELETE DRAWER --- */}
      <Drawer open={!!showToDelete} onOpenChange={() => setShowToDelete(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"><AlertTriangle className="h-6 w-6 text-destructive" /></div>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>This action cannot be undone. This will permanently cancel the show.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="destructive" onClick={handleDelete} disabled={isSubmitLoading}>Yes, Delete Show</Button>
              <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EventShowsManager;