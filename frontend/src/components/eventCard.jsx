import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Added _id to the destructuring props
export default function EventCard({ _id, title, description, price, image }) {
  // Use the unique _id as a stable version query to fix flickering and CORS
  const safeImageSrc = image ? `${image}?v=${_id}` : null;

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 blur transition duration-500 group-hover:opacity-75"></div>
      
      <Card className="relative flex h-full flex-col overflow-hidden border-zinc-800 bg-zinc-950 text-white">
        <div className="aspect-video overflow-hidden bg-zinc-900">
          {safeImageSrc ? (
            <img 
              src={safeImageSrc} 
              alt={title}
              // Required for TMDB images to load correctly in some browser environments
              crossOrigin="anonymous" 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-500">
              No Image Available
            </div>
          )}
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription className="text-zinc-400">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-2xl font-extrabold text-white">Rs. {price?.toLocaleString()}</p>
        </CardContent>

        <CardFooter>
          <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}