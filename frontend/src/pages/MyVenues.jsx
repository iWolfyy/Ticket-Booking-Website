import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from "@/components/ui/data-table";
import apiClient from '@/lib/axios';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, Edit, Trash2, Plus, 
  MapPin, Building2, Layout, Loader2 
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

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "name",
      header: "Venue",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-medium text-foreground">{row.getValue("name")}</span>
        </div>
      )
    },
    {
      accessorKey: "city",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{row.getValue("city")}</span>
        </div>
      )
    },
    {
      accessorKey: "venueType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal capitalize px-2.5 py-0.5">
          {row.getValue("venueType")}
        </Badge>
      )
    },
    {
      accessorKey: "sections",
      header: "Layout",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Layout className="h-3.5 w-3.5" />
          {row.original.sections?.length || 0} Sections
        </div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const venue = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/editvenue/${venue._id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Venue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => {
                  setDeleteId(venue._id);
                  setIsDrawerOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Venue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchVenues = async () => {
    try {
      const response = await apiClient.get('/venues');
      setVenues(response.data);
    } catch (error) {
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/venues/${deleteId}`);
      setVenues((prev) => prev.filter((v) => v._id !== deleteId));
      toast.success("Venue removed successfully");
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting venue");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 text-sans">
      <BlurFade delay={0.1} inView>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Venues</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your registered event locations.
            </p>
          </div>
          
          {/* Magic UI Rainbow Button */}
          <RainbowButton 
            onClick={() => navigate('/createvenue')} 
            className="h-11 px-6 text-sm font-semibold transition-all shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Venue
          </RainbowButton>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        <Separator className="mb-8" />
      </BlurFade>

      <BlurFade delay={0.3} inView>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={venues} searchKey="name" />
        )}
      </BlurFade>

      {/* Confirmation Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-destructive flex items-center gap-2 font-bold">
                <Trash2 className="h-5 w-5" /> Delete Venue?
              </DrawerTitle>
              <DrawerDescription className="text-sm font-medium">
                This action cannot be undone. All event data associated with this venue will be affected.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex-row gap-3 pb-10">
              <Button 
                variant="destructive" 
                className="flex-1 font-semibold"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isDeleting ? "Deleting..." : "Confirm Delete"}
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

export default MyVenues;