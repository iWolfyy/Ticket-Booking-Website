import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "notistack";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";

// Data Import
import { MOCK_EVENTS } from "@/data/mockdata";

const EventCard = ({ posterImage, title }) => (
  <figure className="relative w-32 cursor-pointer overflow-hidden rounded-lg border border-black/10 dark:border-white/5 p-1.5 transition-all hover:scale-105 bg-black/[0.03] dark:bg-white/5">
    <img 
      src={posterImage} 
      alt={title} 
      className="aspect-[2/3] w-full rounded-md object-cover opacity-70 dark:opacity-60 grayscale-[0.5] dark:grayscale-0 hover:grayscale-0 transition-all" 
    />
  </figure>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const row1 = [...MOCK_EVENTS.movies.slice(0, 6)];
  const row2 = [...MOCK_EVENTS.concerts.slice(0, 6)];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({ name: "User", email });
      enqueueSnackbar("Successfully logged in", { variant: "success" });
      navigate("/");
      setLoading(false);
    }, 1200);
  };

  return (
    /* FIXED CONTAINER LOGIC:
       1. Removed global 'h-screen' or 'overflow-hidden' from the top div.
       2. Use 'min-h-[calc(100vh-112px)]' to ensure it fills the space but can grow if needed.
       3. On mobile, the flex direction is 'col', so the form will simply stack.
    */
    <div className="w-full flex-1 flex flex-col lg:grid lg:grid-cols-2 min-h-[calc(100vh-112px)] bg-background">
      
      {/* LEFT SIDE: Marquee (Hidden on Mobile) */}
      <div className="relative hidden lg:flex h-full flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-8 text-zinc-950 dark:text-white overflow-hidden border-r border-zinc-200 dark:border-white/5">
        <div className="absolute inset-0 z-0 flex flex-col justify-center gap-4 opacity-80 dark:opacity-30 scale-105">
          <Marquee pauseOnHover className="[--duration:50s]">
            {row1.map((event) => <EventCard key={event._id} {...event} />)}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:60s]">
            {row2.map((event) => <EventCard key={event._id} {...event} />)}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-zinc-50 dark:from-zinc-950"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-zinc-50 dark:from-zinc-950"></div>
        </div>

        <div className="relative z-20 mb-auto self-start">
          <span className="text-sm font-semibold tracking-widest uppercase opacity-80 flex items-center gap-2">
            <div className="h-5 w-5 bg-primary rounded flex items-center justify-center text-[10px] text-primary-foreground font-black shadow-sm">T</div>
            Ticket Ready
          </span>
        </div>

        <div className="relative z-20 mt-auto w-full max-w-sm">
          <blockquote className="space-y-2 rounded-xl border border-zinc-200 dark:border-white/5 bg-white/60 dark:bg-black/40 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm font-light leading-relaxed text-zinc-700 dark:text-white/80">
              &ldquo;The most seamless booking experience I've had. Clean, fast, and reliable.&rdquo;
            </p>
            <footer className="text-[10px] font-medium text-zinc-400 dark:text-white/30 tracking-widest uppercase">— Tech Review</footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE: Login Card (Centered) */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <Card className="mx-auto w-full max-w-[350px] h-fit border-muted/50 rounded-xl bg-card transition-all
          shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1),0_20px_50px_-20px_rgba(0,0,0,0.15)] 
          dark:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.5)]">
          
          <CardHeader className="space-y-1 text-center pt-5 pb-3">
            <CardTitle className="text-lg font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-xs font-medium">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-3 px-6">
            <form onSubmit={handleSubmit} className="grid gap-2.5">
              <div className="grid gap-1">
                <Label htmlFor="email" className="text-[10px] ml-0.5 uppercase tracking-wider opacity-60 font-bold">Email Address</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  className="rounded-md bg-muted/40 dark:bg-muted/20 border-none h-8 text-xs focus-visible:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center justify-between ml-0.5">
                   <Label htmlFor="password" className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Password</Label>
                   <Link to="#" className="text-[10px] font-medium text-primary hover:underline">
                      Forgot?
                   </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="rounded-md bg-muted/40 dark:bg-muted/20 border-none h-8 text-xs focus-visible:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <RainbowButton 
                disabled={loading} 
                className="mt-1 w-full h-8 text-xs font-bold shadow-md"
              >
                {loading ? "Signing In..." : "Sign In"}
              </RainbowButton>
            </form>

            <div className="relative my-0.5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold text-muted-foreground/50">
                <span className="bg-card px-2">or</span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full rounded-md h-8 text-xs font-medium hover:bg-muted/50 border-muted/50">
               Google
            </Button>
          </CardContent>

          <CardFooter className="pt-1 pb-5">
            <p className="text-center text-[11px] text-muted-foreground w-full">
              New here?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}