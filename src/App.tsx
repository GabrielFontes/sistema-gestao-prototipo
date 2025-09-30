import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovimentacoesPage from "./pages/mente/Movimentacoes";
import DREPage from "./pages/mente/DRE";
import FluxosPage from "./pages/corpo/Fluxos";
import IndicadoresPage from "./pages/corpo/Indicadores";
import AlmaAppPage from "./pages/alma/App";
import PernasTarefasPage from "./pages/pernas/Tarefas";
import Mente from "./pages/Mente";
import Corpo from "./pages/Corpo";
import Alma from "./pages/Alma";
import Pernas from "./pages/Pernas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mente />} />
          <Route path="/mente" element={<Mente />} />
          <Route path="/mente/movimentacoes" element={<MovimentacoesPage />} />
          <Route path="/mente/dre" element={<DREPage />} />
          <Route path="/corpo" element={<Corpo />} />
          <Route path="/corpo/fluxos" element={<FluxosPage />} />
          <Route path="/corpo/indicadores" element={<IndicadoresPage />} />
          <Route path="/alma" element={<Alma />} />
          <Route path="/alma/app" element={<AlmaAppPage />} />
          <Route path="/pernas" element={<Pernas />} />
          <Route path="/pernas/tarefas" element={<PernasTarefasPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
