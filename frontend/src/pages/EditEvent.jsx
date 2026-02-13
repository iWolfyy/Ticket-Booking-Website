import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Ticket, Save, Loader2, ImagePlus, Info, Edit3, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../lib/axios';
import { toast } from "sonner";

// Shadcn & UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BlurFade } from "@/components/ui/blur-fade";

// Reuse the schema from CreateEvent
const eventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.enum(["movie", "concert", "sports", "theatre"]),
  artistName: z.string().optional(),
  basePrice: z.coerce.number().min(1, "Price must be greater than 0"),
  description: z.string().optional(),
  trailerUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  "metadata.teams.home": z.string().optional(),
  "metadata.teams.away": z.string().optional(),
  "metadata.league": z.string().optional(),
  "metadata.director": z.string().optional(),
});

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bannerPreview, setBannerPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '', category: 'movie', artistName: '',
      basePrice: 0, description: '', trailerUrl: '',
      isFeatured: false,
      "metadata.teams.home": '', "metadata.teams.away": '',
      "metadata.league": '', "metadata.director": ''
    }
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await apiClient.get(`/events/${id}`);
        // Populate form with existing data
        form.reset({
          ...data,
          "metadata.teams.home": data.metadata?.teams?.home || '',
          "metadata.teams.away": data.metadata?.teams?.away || '',
          "metadata.league": data.metadata?.league || '',
          "metadata.director": data.metadata?.director || '',
        });
        setBannerPreview(data.bannerImage || data.posterImage);
      } catch (err) {
        toast.error("Failed to load event data");
        navigate('/myevents');
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id, form, navigate]);

  const onSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    
    // Flatten metadata for multipart submission if needed, or send as JSON
    // Most backends prefer JSON if not sending files, but since we have an image:
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined) formData.append(key, values[key]);
    });
    
    const imageFile = document.getElementById('bannerImage').files[0];
    if (imageFile) formData.append('bannerImage', imageFile);

    try {
      await apiClient.put(`/events/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Event Updated Successfully');
      navigate('/myevents');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <BlurFade delay={0.1}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
              <div>
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 -ml-2 text-muted-foreground">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <h1 className="text-3xl font-extrabold tracking-tight uppercase flex items-center gap-2">
                  <Edit3 className="w-8 h-8 text-primary" /> Edit Event
                </h1>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="px-8 font-bold uppercase tracking-widest shadow-lg">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="border-b mb-6">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary/80">Core Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Event Title</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="movie">Movie</SelectItem>
                            <SelectItem value="concert">Concert</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="theatre">Theatre</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="basePrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Base Price (LKR)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">Description</FormLabel>
                        <FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="border-b mb-4">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary/80">Banner Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="group relative w-full aspect-[4/5] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => document.getElementById('bannerImage').click()}
                    >
                      {bannerPreview ? (
                        <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white text-xs font-bold uppercase">Change Image</p>
                      </div>
                      <input id="bannerImage" type="file" className="hidden" onChange={(e) => setBannerPreview(URL.createObjectURL(e.target.files[0]))} accept="image/*" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </BlurFade>
    </div>
  );
};

export default EditEvent;