import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Extracted internal component
const SidebarBackdrop = () => {
  const { open, isMobile, toggleSidebar } = useSidebar();
  if (!open || !isMobile) return null;
  return (
    <div 
      onClick={toggleSidebar} 
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" 
    />
  );
};

export default function MainLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative z-[100]"><AppSidebar /></div>
      <SidebarBackdrop />
      
      <div className="flex flex-col w-full min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
        <Navbar />
        
        {/* UPDATED MAIN TAG:
            1. Added 'flex flex-col': This enables children to expand (flex-1).
            2. Padding: Keeps 'pt-32' (mobile) and 'md:pt-28' (desktop) to clear the navbar perfectly.
            3. No Bottom Padding for Auth pages.
        */}
        <main className={`flex-1 flex flex-col w-full${isAuthPage ? 'pt-32 md:pt-28' : 'pb-10 pt-32 md:pt-36'}`}>
          <Outlet /> 
        </main>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
}