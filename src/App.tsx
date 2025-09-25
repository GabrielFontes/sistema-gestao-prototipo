import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MovimentacoesPage from "./pages/mente/Movimentacoes";
import DREPage from "./pages/mente/DRE";
import ProjetosPage from "./pages/corpo/Projetos";
import IndicadoresPage from "./pages/corpo/Indicadores";
import AlmaAppPage from "./pages/alma/App";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mente/movimentacoes" element={<MovimentacoesPage />} />
          <Route path="/mente/dre" element={<DREPage />} />
          <Route path="/corpo/projetos" element={<ProjetosPage />} />
          <Route path="/corpo/indicadores" element={<IndicadoresPage />} />
          <Route path="/alma/app" element={<AlmaAppPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
