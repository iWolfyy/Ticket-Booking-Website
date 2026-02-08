import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from "@/components/ui/data-table";
import apiClient from '@/lib/axios';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, Edit, Trash2, Plus, 
  MapPin, Building2, Layout 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/ui/blur-fade"; //

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
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
      cell: ({ row }) => {
        const type = row.getValue("venueType");
        return (
          <Badge variant="secondary" className="font-normal capitalize px-2.5 py-0.5">
            {type}
          </Badge>
        );
      }
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
              <DropdownMenuItem onClick={() => navigate(`/edit-venue/${venue._id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Venue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Venue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await apiClient.get('/venues');
        setVenues(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      {/* Header Section with Animation */}
      <BlurFade delay={0.1} inView>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Venues</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your event locations and seating layouts.
            </p>
          </div>
          <Button onClick={() => navigate('/createvenue')} className="h-10 px-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Venue
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.2} inView>
        <Separator className="mb-8" />
      </BlurFade>

      {/* Content Section with Delayed Animation */}
      <BlurFade delay={0.3} inView>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={venues} searchKey="name" />
        )}
      </BlurFade>
    </div>
  );
};

export default MyVenues;