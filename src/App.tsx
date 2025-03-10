
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import CreateReminder from "./pages/CreateReminder";
import EditReminder from "./pages/EditReminder";
import Birthdays from "./pages/Birthdays";
import Anniversaries from "./pages/Anniversaries";
import QuoteGenerator from "./pages/QuoteGenerator";
import NotFound from "./pages/NotFound";
import ChatBox from "./components/quotes/ChatBox";

const queryClient = new QueryClient();

// Private route component to protect authenticated routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

// Public route that redirects to dashboard if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            <Route path="/sign-up" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/create-reminder" element={
              <PrivateRoute>
                <CreateReminder />
              </PrivateRoute>
            } />
            <Route path="/edit-reminder/:id" element={
              <PrivateRoute>
                <EditReminder />
              </PrivateRoute>
            } />
            <Route path="/birthdays" element={
              <PrivateRoute>
                <Birthdays />
              </PrivateRoute>
            } />
            <Route path="/anniversaries" element={
              <PrivateRoute>
                <Anniversaries />
              </PrivateRoute>
            } />
            <Route path="/quote-generator" element={
              <PrivateRoute>
                <QuoteGenerator />
              </PrivateRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBox />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
