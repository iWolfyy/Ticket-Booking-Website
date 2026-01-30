import React, { useState } from "react";
import { toast } from "sonner";
import { LucideUser, LucideSettings, LucideBell, LucideShield, LucideTicket, LucideCamera, LucideTrendingUp, LucideCalendar, LucideCreditCard, LucideStar } from "lucide-react";

// shadcn UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Magic UI for aesthetics
import { BlurFade } from "@/components/ui/blur-fade";

export default function Settings() {
  const [profileImage, setProfileImage] = useState("https://github.com/shadcn.png");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success("Profile picture updated preview");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success("Settings updated successfully");
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-background min-h-[calc(100vh-112px)]">
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account and view your booking activity.</p>
          </div>
        </div>
      </BlurFade>

      {/* BENTO GRID STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard delay={0.2} title="Total Bookings" value="12" icon={<LucideTicket />} trend="+2 this month" />
        <StatsCard delay={0.25} title="Upcoming Events" value="3" icon={<LucideCalendar />} />
        <StatsCard delay={0.3} title="Points Earned" value="1,250" icon={<LucideStar />} trend="Gold Member" />
        <StatsCard delay={0.35} title="Total Spent" value="$420.00" icon={<LucideCreditCard />} />
      </div>

      <div className="grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
        {/* SIDE NAVIGATION */}
        <BlurFade delay={0.4} direction="right">
          <nav className="flex flex-col space-y-1">
            <button className="flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-zinc-900 transition-all dark:bg-zinc-800 dark:text-zinc-50">
              <LucideUser className="h-4 w-4" /> Profile
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <LucideBell className="h-4 w-4" /> Notifications
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <LucideShield className="h-4 w-4" /> Security
            </button>
          </nav>
        </BlurFade>

        {/* MAIN CONTENT AREA */}
        <div className="space-y-6">
          <BlurFade delay={0.5}>
            <Card className="border-muted/50 bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>Update your personal information and profile picture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* PROFILE PICTURE SECTION */}
                <div className="flex flex-col gap-4">
                  <Label className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Profile Picture</Label>
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <Avatar className="h-24 w-24 border-2 border-primary/20 transition-all group-hover:opacity-80">
                        <AvatarImage src={profileImage} alt="Profile" />
                        <AvatarFallback>PW</AvatarFallback>
                      </Avatar>
                      <label htmlFor="picture-upload" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <LucideCamera className="text-white h-8 w-8 drop-shadow-md" />
                      </label>
                      <input id="picture-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Change Photo</h4>
                      <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                    </div>
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="username" className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Username</Label>
                    <Input id="username" defaultValue="Pavithra" className="bg-muted/40 border-none h-9 text-sm" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Email Address</Label>
                    <Input id="email" placeholder="wadptw@gmail.com" className="bg-muted/40 border-none h-9 text-sm" />
                  </div>
                </div>

                <RainbowButton onClick={handleSave} className="h-9 text-xs font-bold px-8">
                  Save Profile Changes
                </RainbowButton>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component for the Bento Grid
function StatsCard({ title, value, icon, trend, delay }) {
  return (
    <BlurFade delay={delay}>
      <Card className="border-muted/50 bg-card/50 backdrop-blur-sm overflow-hidden relative group">
        <div className="absolute right-[-10px] top-[-10px] opacity-5 text-primary group-hover:scale-110 transition-transform duration-500">
          {React.cloneElement(icon, { size: 80 })}
        </div>
        <CardHeader className="pb-2">
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest">{title}</CardDescription>
          <CardTitle className="text-2xl font-black">{value}</CardTitle>
        </CardHeader>
        <CardContent>
          {trend && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-primary">
              <LucideTrendingUp className="h-3 w-3" /> {trend}
            </div>
          )}
        </CardContent>
      </Card>
    </BlurFade>
  );
}