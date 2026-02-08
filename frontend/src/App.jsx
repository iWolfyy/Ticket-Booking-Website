// frontend/src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this matches your filename

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
const MyVenues = lazy(() => import('./pages/MyVenues'));
const EditVenue = lazy(() => import('./pages/EditVenue'));

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
            <Route element={<MainLayout />}>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/concert/:id" element={<ConcertDetails />} />
              <Route path="/sports/:id" element={<SportsDetails />} />
              <Route path="/theatre/:id" element={<TheatreDetails />} />

              {/* --- ALL LOGGED-IN USERS --- */}
              <Route element={<ProtectedRoute allowedRoles={['user', 'venuemanager', 'admin', 'seller']} />}>
                <Route path="/booking/:id" element={<SeatBooking />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* --- VENUE MANAGER & ADMIN ONLY --- */}
              <Route element={<ProtectedRoute allowedRoles={['venuemanager', 'admin', 'seller']} />}>
                <Route path="/createvenue" element={<CreateVenue />} />
                <Route path="/myvenues" element={<MyVenues />} />
                <Route path="/editvenue/:id" element={<EditVenue />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;