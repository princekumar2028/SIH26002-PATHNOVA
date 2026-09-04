import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LiveMap from "./pages/LiveMap";
import Vehicles from "./pages/Vehicles";
import RoutesPage from "./pages/Routes";
import RiskIntelligence from "./pages/RiskIntelligence";
import Incidents from "./pages/Incidents";
import WeatherHazards from "./pages/WeatherHazards";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import AICommandCenter from "./pages/AICommandCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/risk-intelligence" element={<RiskIntelligence />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/weather-hazards" element={<WeatherHazards />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-command-center" element={<AICommandCenter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
