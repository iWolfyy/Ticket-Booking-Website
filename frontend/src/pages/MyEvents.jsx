import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from "@/components/ui/data-table";
import apiClient from '@/lib/axios';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, Edit, Trash2, Plus, 
  Loader2, Image as ImageIcon, Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/ui/blur-fade";
import { toast } from "sonner";

// Magic UI Integration
import { RainbowButton } from "@/components/ui/rainbow-button";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "title",
      header: "Event",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded overflow-hidden bg-muted flex items-center justify-center">
            {row.original.imageUrl ? (
              <img src={row.original.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <span className="font-medium">{row.getValue("title")}</span>
        </div>
      )
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("category")}
        </Badge>
      )
    },
    {
      accessorKey: "isFeatured",
      header: "Status",
      cell: ({ row }) => (
        row.getValue("isFeatured") ? 
        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Featured</Badge> : 
        <Badge variant="secondary">Standard</Badge>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/editevent/${event._id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/manageshows`)}>
                <Calendar className="mr-2 h-4 w-4" /> Manage Shows
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => {
                  setDeleteId(event._id);
                  setIsDrawerOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/events/manage'); 
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/events/${deleteId}`);
      setEvents((prev) => prev.filter((e) => e._id !== deleteId));
      toast.success("Event deleted successfully");
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting event");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <BlurFade delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Events</h1>
            <p className="text-muted-foreground mt-1">Create and manage your event listings and categories.</p>
          </div>
          
          {/* Magic UI Rainbow Button */}
          <RainbowButton 
            onClick={() => navigate('/createevent')} 
            className="h-11 px-6 text-sm font-semibold transition-all shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </RainbowButton>
        </div>
      </BlurFade>

      <Separator className="mb-8" />

      <BlurFade delay={0.2}>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={events} searchKey="title" />
        )}
      </BlurFade>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm pb-10">
            <DrawerHeader>
              <DrawerTitle className="text-destructive font-bold">Delete Event?</DrawerTitle>
              <DrawerDescription>
                This will permanently remove the event. You cannot delete events that have active shows with bookings.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex-row gap-3">
              <Button variant="destructive" className="flex-1 font-semibold" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1 font-semibold">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MyEvents;