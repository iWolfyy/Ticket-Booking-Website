import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from "@heroui/react"
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The Provider MUST be the parent for components like Dropdowns to work */}
    <HeroUIProvider>
      <main className="text-foreground bg-background min-h-screen">
        <App />
      </main>
    </HeroUIProvider>
  </React.StrictMode>,
)