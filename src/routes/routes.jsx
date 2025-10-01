import { Routes, Route } from 'react-router-dom';
import EmpresaLayout from '../pages/EmpresaLayout';
import Mente from '../pages/Mente';
import DRE from '../pages/mente/DRE';
import Movimentacoes from '../pages/mente/Movimentacoes';
import Alma from '../pages/Alma';
import AlmaApp from '../pages/alma/App';
import Corpo from '../pages/Corpo';
import Fluxos from '../pages/corpo/Fluxos';
import Indicadores from '../pages/corpo/Indicadores';
import Pernas from '../pages/Pernas';
import Tarefas from '../pages/pernas/Tarefas';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NewEmpresa from '../pages/NewEmpresa';
import NotFound from '../pages/NotFound';
// Remova a importação do Layout se não for mais usada em nenhuma rota

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas: sem layout/sidebar */}
      <Route path="/" element={<Home />} /> {/* EmpresaSeletor sem menu */}
      <Route path="/login" element={<Login />} />
      <Route path="/new-empresa" element={<NewEmpresa />} />
      
      {/* Rotas de empresa: usar EmpresaLayout com sidebar */}
      <Route path="/empresa/:empresaId" element={<EmpresaLayout />}>
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
  );
}