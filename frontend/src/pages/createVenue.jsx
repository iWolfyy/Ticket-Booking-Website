import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, LayoutTemplate, Upload, Plus, Trash2, 
  ChevronLeft, ImagePlus, Loader2 
} from 'lucide-react';
import apiClient from '../lib/axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const STEPS = [
  { id: 1, name: 'Basic Info', icon: Building2 },
  { id: 2, name: 'Seating Layout', icon: LayoutTemplate },
  { id: 3, name: 'Media & Location', icon: Upload },
];

const fadeInVariant = {
  hidden: { opacity: 0, x: 20, filter: 'blur(10px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -20, filter: 'blur(10px)', transition: { duration: 0.3 } }
};

const CreateVenue = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const progressWidth = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: '', city: '', address: '', venueType: 'cinema',
      sections: [{ name: 'General', rows: 0, seatsPerRow: 0, totalCapacity: 0, isStanding: false }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "sections" });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    
    // Append standard text fields
    Object.keys(data).forEach(key => {
      if (key !== 'images' && key !== 'sections') {
        formData.append(key, data[key]);
      }
    });

    // Sections must be stringified for Multer/Backend parsing
    formData.append('sections', JSON.stringify(data.sections));
    
    // Default GeoJSON Location
    formData.append('location', JSON.stringify({ type: 'Point', coordinates: [0, 0] }));

    // Append multiple files
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      await apiClient.post('/venues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Venue created successfully!');
      // Reset or redirect logic here
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      {/* --- PROGRESS STEPPER --- */}
      <div className="relative mb-20 pt-4">
        <div className="absolute top-[24px] left-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 -z-10" />
        <motion.div 
          className="absolute top-[24px] left-0 h-[1px] bg-zinc-900 dark:bg-zinc-100 -z-10"
          animate={{ width: `${progressWidth}%` }}
        />
        <div className="flex justify-between items-start w-full">
          {STEPS.map((step) => {
            const isActive = currentStep >= step.id;
            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 z-10 
                  ${isActive ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-zinc-950 text-zinc-400 border-zinc-200 dark:border-zinc-800'}
                `}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-black dark:text-white' : 'text-zinc-400'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="shadow-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <CardContent className="pt-10 px-8 min-h-[450px]">
          <form id="venue-form" onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="1" variants={fadeInVariant} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Venue Name</Label>
                    <Input {...register('name', { required: true })} className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">City</Label>
                      <Input {...register('city', { required: true })} className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Venue Type</Label>
                      <Controller
                        name="venueType"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cinema">Cinema</SelectItem>
                              <SelectItem value="stadium">Stadium</SelectItem>
                              <SelectItem value="club">Club</SelectItem>
                              <SelectItem value="theatre">Theatre</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Address</Label>
                    <Textarea {...register('address', { required: true })} className="min-h-[120px]" />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="2" variants={fadeInVariant} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold italic">Seating Layout</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', rows: 0, seatsPerRow: 0, totalCapacity: 0, isStanding: false })}>
                      <Plus className="h-4 w-4 mr-2" /> Add Section
                    </Button>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-5 border rounded-xl relative bg-zinc-50 dark:bg-zinc-900/30">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-zinc-400 hover:text-red-500" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Input {...register(`sections.${index}.name`)} placeholder="Section Name" className="mb-4" />
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <Controller name={`sections.${index}.isStanding`} control={control} render={({ field }) => ( <Checkbox checked={field.value} onCheckedChange={field.onChange} /> )} />
                            Standing Area
                          </label>
                          {!watch(`sections.${index}.isStanding`) ? (
                            <div className="flex gap-4">
                              <Input type="number" placeholder="Rows" {...register(`sections.${index}.rows`)} className="w-24" />
                              <Input type="number" placeholder="Seats" {...register(`sections.${index}.seatsPerRow`)} className="w-24" />
                            </div>
                          ) : (
                            <Input type="number" placeholder="Capacity" {...register(`sections.${index}.totalCapacity`)} className="w-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="3" variants={fadeInVariant} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <h3 className="text-xl font-bold text-center italic">Upload Venue Media</h3>
                  <div 
                    className="w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <ImagePlus className="h-10 w-10 text-zinc-400" />
                    <p className="font-medium text-zinc-500">Click to select files</p>
                    <input id="file-upload" type="file" multiple className="hidden" {...register('images')} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between p-8 border-t">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1 || loading}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button onClick={currentStep === 3 ? handleSubmit(onSubmit) : nextStep} disabled={loading} className="px-10">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {currentStep === 3 ? 'Finalize Venue' : 'Continue'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateVenue;