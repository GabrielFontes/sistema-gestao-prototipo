import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import Home from "./pages/Home";
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
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NewWorkspace from "./pages/NewWorkspace";
import WorkspaceDetail from "./pages/WorkspaceDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WorkspaceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new-workspace" element={<NewWorkspace />} />
            <Route path="/workspace/:id" element={<WorkspaceDetail />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WorkspaceProvider>
  </QueryClientProvider>
);

export default App;