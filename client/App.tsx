import "./global.css";
import "./portal-driver.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import Index from "./pages/Index";
import LiveMap from "./pages/LiveMap";
import Vehicles from "./pages/Vehicles";
import RoutesPage from "./pages/Routes";
import RiskIntelligence from "./pages/RiskIntelligence";
import Incidents from "./pages/Incidents";
import WeatherHazards from "./pages/WeatherHazards";
import Alerts from "./pages/Alerts";
import DriverPortal from "./pages/DriverPortal";
import NotFound from "./pages/NotFound";
import { GlobalFieldTools, NetworkProvider } from "./components/OfflineUX";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NetworkProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalFieldTools />
        <Routes>
          {/* Role selection entry point */}
          <Route path="/" element={<RoleSelect />} />
          {/* Operations Portal */}
          <Route path="/dashboard" element={<Index />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/risk-intelligence" element={<RiskIntelligence />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/weather-hazards" element={<WeatherHazards />} />
          <Route path="/alerts" element={<Alerts />} />
          {/* Driver Portal */}
          <Route path="/driver" element={<DriverPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </NetworkProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
