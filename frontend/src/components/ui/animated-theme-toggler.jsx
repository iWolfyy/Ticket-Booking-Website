import React, { useCallback } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AnimatedThemeToggler({ className }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = useCallback(
    async (event) => {
      // 1. Fallback for browsers that don't support View Transitions
      if (!document.startViewTransition) {
        setTheme(theme === "dark" ? "light" : "dark")
        return
      }

      // 2. Get the center of the button relative to the viewport
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      // 3. Calculate distance to the furthest corner
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      )

      // 4. Start the transition
      const transition = document.startViewTransition(async () => {
        // Force the DOM update synchronously
        flushSync(() => {
          setTheme(theme === "dark" ? "light" : "dark")
        })
      })

      // 5. Wait for the pseudo-elements to be created
      await transition.ready

      // 6. Animate the clipping path
      // Note: We animate the NEW view (expanding circle)
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]

      document.documentElement.animate(
        {
          clipPath: theme === "dark" ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: theme === "dark"
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      )
    },
    [theme, setTheme]
  )

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-9 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm hover:scale-105 transition-all overflow-hidden",
        className
      )}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-zinc-900 dark:text-zinc-100" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-zinc-900 dark:text-zinc-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}