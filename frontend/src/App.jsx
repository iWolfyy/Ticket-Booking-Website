import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SignUp = lazy(() => import('./pages/Signup'));
const Settings = lazy(() => import('./pages/Settings'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const ConcertDetails = lazy(() => import('./pages/ConcertDetails'));
const SportsDetails = lazy(() => import('./pages/SportsDetails'));
const TheatreDetails = lazy(() => import('./pages/TheatreDetails'));
const SeatBooking = lazy(() => import('./components/SeatBooking'));
const CreateVenue = lazy(() => import('./pages/createVenue'));

// -- Loading Spinner --
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-right" expand={false} richColors />
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              
              {/* NORMAL PAGES (Use MainLayout with standard padding) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/settings" element={<Settings />} /> 
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/concert/:id" element={<ConcertDetails />} />
                <Route path="/sports/:id" element={<SportsDetails />} />
                <Route path="/theatre/:id" element={<TheatreDetails />} />
                <Route path="/booking/:id" element={<SeatBooking />} />
                <Route path="/createvenue" element={<CreateVenue />} />
              </Route>

              {/* CUSTOM AUTH PAGES (Navbar/Footer manually added for full control) */}

              
            </Routes>
          </Suspense>
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;