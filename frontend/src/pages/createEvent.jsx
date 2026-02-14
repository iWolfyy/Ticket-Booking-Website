import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, Save, Loader2, ImagePlus, Info, 
  Globe, Film, XCircle, Edit3, Sparkles
} from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../lib/axios';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

import MovieSearchInput from '../components/MovieSearchInput'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Magic UI Component
import { RainbowButton } from "@/components/ui/rainbow-button";

const eventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.enum(["movie", "concert", "sports", "theatre"]),
  artistName: z.string().optional(),
  basePrice: z.coerce.number().min(1, "Price must be greater than 0"),
  description: z.string().optional(),
  trailerUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  tmdbId: z.any().optional(),
  "metadata.teams.home": z.string().optional(),
  "metadata.teams.away": z.string().optional(),
  "metadata.league": z.string().optional(),
  "metadata.director": z.string().optional(),
}).refine((data) => {
  if (data.category === 'concert' && !data.artistName) return false;
  return true;
}, {
  message: "Artist name is required for concerts",
  path: ["artistName"],
});

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [manualMode, setManualMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '', category: 'movie', artistName: '',
      basePrice: 0, description: '', trailerUrl: '',
      isFeatured: false, tmdbId: '',
      "metadata.teams.home": '', "metadata.teams.away": '',
      "metadata.league": '', "metadata.director": ''
    }
  });

  const category = form.watch('category');
  const hasTmdbId = !!form.watch('tmdbId');
  const isLocked = (category === 'movie' || category === 'concert') && hasTmdbId && !manualMode;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined) formData.append(key, values[key]);
    });
    
    const imageFile = document.getElementById('bannerImage').files[0];
    if (imageFile) formData.append('bannerImage', imageFile);

    try {
      await apiClient.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Event Entry Created');
      navigate('/'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    form.setValue('tmdbId', '');
    form.setValue('title', '');
    setSelectedMovie(null);
    setManualMode(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight uppercase flex items-center gap-2">
                <Ticket className="w-8 h-8 text-primary" /> Create Event
              </h1>
              <p className="text-muted-foreground mt-1 text-sm font-medium uppercase tracking-tight">Technical Management Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancel</Button>
              
              {/* Magic UI Rainbow Button Integration */}
              <RainbowButton 
                type="submit" 
                disabled={loading}
                className="h-11 px-8 font-bold uppercase tracking-widest text-xs"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Publish Event
              </RainbowButton>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Manual Override Toggle */}
              {(category === 'movie' || category === 'concert') && hasTmdbId && (
                <div className="flex items-center justify-between p-4 bg-muted/50 border rounded-xl">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold uppercase tracking-tight">Manual Override</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Unlock Fields</Label>
                    <Switch checked={manualMode} onCheckedChange={setManualMode} />
                  </div>
                </div>
              )}

              <Card className="shadow-sm border-muted/60">
                <CardHeader className="pb-4 border-b mb-6">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary/80">Primary Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Category</FormLabel>
                          <Select onValueChange={(val) => {
                            field.onChange(val);
                            resetSelection();
                          }} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="h-11"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="movie">Movie</SelectItem>
                              <SelectItem value="concert">Concert</SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="theatre">Theatre</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Base Price (LKR)</FormLabel>
                          <FormControl><Input type="number" className="h-11 font-mono" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      {category === 'movie' && !manualMode && !hasTmdbId ? (
                        <div className="space-y-4 pt-1">
                          <MovieSearchInput register={form.register} setValue={form.setValue} watch={form.watch} onSelect={(m) => setSelectedMovie(m)} />
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold px-1">
                            <Info className="w-3 h-3" />
                            <span>Can't find it? Use Manual Entry in parameters</span>
                          </div>
                        </div>
                      ) : (
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between">
                                <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Event Title</FormLabel>
                                {hasTmdbId && !manualMode && <Badge variant="secondary" className="text-[8px] h-4">SYNCED</Badge>}
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="Enter title" className="h-11" {...field} disabled={hasTmdbId && !manualMode} />
                                  {hasTmdbId && !manualMode && <Button onClick={resetSelection} type="button" variant="ghost" className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent text-muted-foreground"><XCircle className="w-4 h-4" /></Button>}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parameters Section */}
              <Card className={`shadow-sm border-muted/60 relative overflow-hidden transition-all ${isLocked ? 'bg-muted/20' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b mb-6">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary/80">Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  
                  <AnimatePresence>
                    {isLocked && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/5 backdrop-blur-[1px] rounded-lg">
                        <div className="bg-card border shadow-xl p-4 rounded-xl flex items-center gap-3">
                          <Globe className="w-5 h-5 text-primary" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">External Data Sync Active</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid gap-6">
                    {category === 'sports' && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="metadata.teams.home" render={({ field }) => (
                          <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Home Team</FormLabel><FormControl><Input className="h-11" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="metadata.teams.away" render={({ field }) => (
                          <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Away Team</FormLabel><FormControl><Input className="h-11" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="metadata.league" render={({ field }) => (
                          <FormItem className="col-span-2"><FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">League / Tournament</FormLabel><FormControl><Input className="h-11" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    )}

                    {category === 'theatre' && (
                      <FormField control={form.control} name="metadata.director" render={({ field }) => (
                        <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Director</FormLabel><FormControl><Input className="h-11" {...field} /></FormControl></FormItem>
                      )} />
                    )}

                    {category === 'concert' && (
                      <FormField control={form.control} name="artistName" render={({ field }) => (
                        <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Artist Name</FormLabel><FormControl><Input className="h-11" {...field} disabled={isLocked} /></FormControl></FormItem>
                      )} />
                    )}

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Description</FormLabel>
                          <FormControl><Textarea disabled={isLocked} className="min-h-[140px] resize-none" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-sm border-muted/60">
                <CardHeader className="border-b mb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary/80">Asset Preview</CardTitle>
                    {isLocked && <Badge variant="secondary" className="text-[8px] uppercase">Synced</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className={`group relative w-full aspect-[4/5] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/40 border-muted-foreground/20'}`}
                    onClick={() => !isLocked && document.getElementById('bannerImage').click()}
                  >
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <div className="text-center p-4">
                        <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Upload Key Visual</p>
                      </div>
                    )}
                    <input id="bannerImage" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </div>
                </CardContent>
              </Card>

              <div className="p-5 bg-muted/30 rounded-2xl border border-muted-foreground/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">System Notice</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                  {isLocked 
                    ? "External data is currently populating this entry. Use the 'Manual Override' toggle to customize synced information." 
                    : "Manual entry mode active. Please ensure all mandatory metadata is provided before publication."}
                </p>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateEvent;