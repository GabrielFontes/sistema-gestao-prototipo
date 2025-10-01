import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import WorkspaceLayout from './pages/WorkspaceLayout';
import Mente from './pages/Mente';
import DRE from './pages/mente/DRE';
import Movimentacoes from './pages/mente/Movimentacoes';
import Alma from './pages/Alma';
import AlmaApp from './pages/alma/App';
import Corpo from './pages/Corpo';
import Fluxos from './pages/corpo/Fluxos';
import Indicadores from './pages/corpo/Indicadores';
import Pernas from './pages/Pernas';
import Tarefas from './pages/pernas/Tarefas';
import Home from './pages/Home';
import Login from './pages/Login';
import NewWorkspace from './pages/NewWorkspace';
import NotFound from './pages/NotFound';

function App() {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-workspace" element={<NewWorkspace />} />
          <Route path="/workspace/:workspaceId" element={<WorkspaceLayout />}>
            <Route index element={<Mente />} />
            <Route path="mente" element={<Mente />} />
            <Route path="dre" element={<DRE />} />
            <Route path="movimentacoes" element={<Movimentacoes />} />
            <Route path="alma" element={<Alma />} />
            <Route path="app" element={<AlmaApp />} />
            <Route path="corpo" element={<Corpo />} />
            <Route path="fluxos" element={<Fluxos />} />
            <Route path="indicadores" element={<Indicadores />} />
            <Route path="pernas" element={<Pernas />} />
            <Route path="tarefas" element={<Tarefas />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  );
}

export default App;