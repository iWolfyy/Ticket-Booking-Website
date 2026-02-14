import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, LayoutTemplate, Upload, Plus, Trash2, ChevronLeft, ImagePlus, Loader2, X, MapPin, CheckCircle2, Save } from 'lucide-react';
import apiClient from '../lib/axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BlurFade } from "@/components/ui/blur-fade";

// Magic UI Component
import { RainbowButton } from "@/components/ui/rainbow-button";

const STEPS = [
  { id: 1, name: 'Identity', icon: Building2, desc: 'Venue details' },
  { id: 2, name: 'Layout', icon: LayoutTemplate, desc: 'Seating plan' },
  { id: 3, name: 'Gallery', icon: Upload, desc: 'Media' },
];

const CreateVenue = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '', city: '', address: '', venueType: 'cinema',
      sections: [{ name: 'General', rows: 10, seatsPerRow: 10, isStanding: false }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "sections" });
  const progressWidth = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key !== 'images' && key !== 'sections') formData.append(key, data[key]);
    });

    formData.append('sections', JSON.stringify(data.sections));
    
    if (data.images) {
      Array.from(data.images).forEach(file => formData.append('images', file));
    }

    try {
      await apiClient.post('/venues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Venue Created Successfully');
      navigate('/myvenues');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* --- STEPPER --- */}
      <div className="relative mb-10">
        <div className="flex justify-between relative z-10">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${currentStep >= step.id ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}
              `}>
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
              </div>
              <span className={`mt-2 text-[11px] font-semibold uppercase tracking-wider ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-[18px] left-0 w-full h-[2px] bg-muted -z-0" />
        <motion.div 
          className="absolute top-[18px] left-0 h-[2px] bg-primary -z-0"
          animate={{ width: `${progressWidth}%` }}
        />
      </div>

      <BlurFade delay={0.1}>
        <Card className="border shadow-md bg-card">
          <CardHeader className="space-y-1 pb-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight uppercase">Create New Venue</CardTitle>
                <CardDescription className="text-sm">{STEPS[currentStep - 1].desc}</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono px-2 py-0">
                STEP {currentStep}/03
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form id="create-venue-form" onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Venue Name</Label>
                        <Input id="name" {...register('name', { required: "Name is required" })} placeholder="Grand Arena" className="h-9" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-xs font-bold uppercase text-muted-foreground">City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                          <Input id="city" {...register('city', { required: "City is required" })} placeholder="New York" className="pl-9 h-9" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">Venue Type</Label>
                      <Controller
                        name="venueType"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {['cinema', 'stadium', 'club', 'theatre'].map(type => (
                                <SelectItem key={type} value={type} className="capitalize text-sm">{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-xs font-bold uppercase text-muted-foreground">Full Address</Label>
                      <Textarea id="address" {...register('address', { required: "Address is required" })} className="min-h-[90px] resize-none" />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Seating Sections</h3>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', rows: 0, seatsPerRow: 0, isStanding: false })} className="h-8 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add Section
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg bg-muted/20 relative group transition-colors">
                          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => remove(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="grid gap-3">
                            <Input {...register(`sections.${index}.name`)} placeholder="Section Title (e.g. VIP)" className="font-bold border-none bg-transparent h-6 p-0 focus-visible:ring-0 text-sm" />
                            <div className="flex items-center gap-6">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <Controller name={`sections.${index}.isStanding`} control={control} render={({ field }) => ( 
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-4 w-4" /> 
                                )} />
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase">Standing Area</span>
                              </label>
                              {!watch(`sections.${index}.isStanding`) ? (
                                <div className="flex items-center gap-2 bg-background border px-3 py-1 rounded-md text-xs">
                                  <input type="number" placeholder="Rows" {...register(`sections.${index}.rows`)} className="w-10 bg-transparent text-center outline-none" />
                                  <span className="text-muted-foreground/50">×</span>
                                  <input type="number" placeholder="Seats" {...register(`sections.${index}.seatsPerRow`)} className="w-10 bg-transparent text-center outline-none" />
                                </div>
                              ) : (
                                <Input type="number" placeholder="Total Capacity" {...register(`sections.${index}.totalCapacity`)} className="h-8 w-32 text-xs" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="3" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-5">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Gallery Preview</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {previews.map((src, i) => (
                        <div key={i} className="aspect-[4/3] rounded-md overflow-hidden border border-primary/20 relative group shadow-sm">
                          <img src={src} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Trash2 className="text-white w-4 h-4 cursor-pointer" onClick={() => setPreviews(p => p.filter((_, idx) => idx !== i))} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div 
                      className="group relative w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-muted/40 transition-all cursor-pointer border-muted-foreground/20 hover:border-primary/50"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="text-[11px] font-medium text-muted-foreground uppercase">Click to upload photos</p>
                      <input id="file-upload" type="file" multiple className="hidden" {...register('images', { onChange: handleImageChange })} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-between p-6 border-t bg-muted/5">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={currentStep === 1 || loading} className="h-9 px-4 text-xs font-semibold">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div className="flex gap-3">
               {currentStep < 3 ? (
                <Button type="button" onClick={handleNext} className="h-9 px-6 font-bold text-xs uppercase tracking-tight">
                  Continue
                </Button>
               ) : (
                <RainbowButton 
                  form="create-venue-form" 
                  type="submit" 
                  disabled={loading} 
                  className="h-9 px-8 font-bold text-xs uppercase tracking-widest"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Publish Venue
                </RainbowButton>
               )}
            </div>
          </CardFooter>
        </Card>
      </BlurFade>
    </div>
  );
};

export default CreateVenue;