import { Routes, Route } from 'react-router-dom';
import EmpresaLayout from '../pages/EmpresaLayout';
import Mente from '../pages/Mente';
import DRE from '../pages/mente/DRE';
import Movimentacoes from '../pages/mente/Movimentacoes';
import Projecoes from '../pages/mente/Projecoes';
import Alma from '../pages/Alma';
import Corpo from '../pages/Corpo';
import Fluxos from '../pages/corpo/Fluxos';
import Indicadores from '../pages/corpo/Indicadores';
import Organograma from '../pages/corpo/Organograma';
import Projetos from '../pages/alma/Projetos';
import Notas from '../pages/alma/Notas';
import Processos from '../pages/alma/Processos';
import Tarefas from '../pages/alma/Tarefas';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NewEmpresa from '../pages/NewEmpresa';
import NotFound from '../pages/NotFound';

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
        <Route path="projecoes" element={<Projecoes />} />
        <Route path="alma" element={<Alma />} />
        <Route path="corpo" element={<Corpo />} />
        <Route path="fluxos" element={<Fluxos />} />
        <Route path="indicadores" element={<Indicadores />} />
        <Route path="organograma" element={<Organograma />} />
        <Route path="processos" element={<Processos />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="notas" element={<Notas />} />
        <Route path="tarefas" element={<Tarefas />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}