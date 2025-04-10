
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import RoutesPage from "./pages/Routes";
import RouteDetail from "./pages/RouteDetail";
import NotFound from "./pages/NotFound";
import FavoritesPage from "./pages/Favorites";
import CreateRoutePage from "./pages/CreateRoute";
import ChatBot from "./components/ChatBot";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/routes/:id" element={<RouteDetail />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/routes/create" element={<CreateRoutePage />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
