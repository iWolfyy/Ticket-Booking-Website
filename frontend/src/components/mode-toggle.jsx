import React, { useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { flushSync } from "react-dom"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const ref = useRef(null)

  const toggleTheme = async () => {
    // 1. Check support
    if (!document.startViewTransition) {
      setTheme(theme === "dark" ? "light" : "dark")
      return
    }

    const element = ref.current
    const rect = element.getBoundingClientRect()
    // Center point of the button
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Calculate distance to the furthest corner
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    // 2. Start Transition
    const transition = document.startViewTransition(async () => {
      flushSync(() => {
        setTheme(theme === "dark" ? "light" : "dark")
      })
    })

    // 3. Animate
    await transition.ready
    
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        // 700ms duration with smooth easing
        duration: 700,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)", 
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm hover:scale-105 transition-all overflow-hidden"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-zinc-900 dark:text-zinc-100" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-zinc-900 dark:text-zinc-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}