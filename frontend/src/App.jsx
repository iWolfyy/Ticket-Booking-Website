import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SignUp = lazy(() => import('./pages/Signup'));

// -- Loading Spinner --
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              
              {/* NORMAL PAGES (Use MainLayout with standard padding) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
              </Route>

              {/* CUSTOM AUTH PAGES (Navbar/Footer manually added for full control) */}

              
            </Routes>
          </Suspense>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;