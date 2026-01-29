import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function EventCard({ title, description, price, image }) {
  return (
    <div className="group relative">
      {/* Custom Neon Glow Effect using Tailwind v4 gradients */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 blur transition duration-500 group-hover:opacity-75"></div>
      
      <Card className="relative flex h-full flex-col overflow-hidden border-zinc-800 bg-zinc-950 text-white">
        <div className="aspect-video overflow-hidden">
          <img 
            src={image || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400"} 
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription className="text-zinc-400">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-2xl font-extrabold text-white">${price}</p>
        </CardContent>

        <CardFooter>
          <Button className="w-full bg-white text-black hover:bg-zinc-200">
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}