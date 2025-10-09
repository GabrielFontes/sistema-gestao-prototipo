import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmpresaConfig {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  primaryColor: string;
}

interface EmpresaContextType {
  currentEmpresa: EmpresaConfig | null;
  empresas: EmpresaConfig[];
  setEmpresa: (empresaId: string) => void;
  isLoading: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export function EmpresaProvider({ children }: { children: React.ReactNode }) {
  const [empresas, setEmpresas] = useState<EmpresaConfig[]>([]);
  const [currentEmpresa, setCurrentEmpresa] = useState<EmpresaConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState<boolean>(
    localStorage.getItem('sidebar-collapsed') === 'true'
  );

  useEffect(() => {
    loadEmpresas();
  }, []);

  useEffect(() => {
    if (currentEmpresa) {
      console.log('Atualizando CSS e localStorage para empresa:', currentEmpresa);
      document.documentElement.style.setProperty('--primary', currentEmpresa.primaryColor);
      localStorage.setItem('current-empresa', currentEmpresa.id);
    }
  }, [currentEmpresa]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }, [collapsed]);

  const loadEmpresas = async () => {
    try {
      console.log('Iniciando loadEmpresas...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Usuário retornado:', user, 'Erro:', userError);

      if (userError) throw userError;
      if (!user) {
        console.log('Nenhum usuário logado');
        setIsLoading(false);
        return;
      }

      console.log('Buscando empresa_members para user_id:', user.id);
      const { data: memberData, error: memberError } = await supabase
        .from('empresa_members')
        .select('empresa_id')
        .eq('user_id', user.id);
      console.log('Resultado de empresa_members:', memberData, 'Erro:', memberError);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        console.log('Nenhum empresa associado ao usuário');
        setEmpresas([]);
        setIsLoading(false);
        return;
      }

      const empresaIds = memberData.map(m => m.empresa_id);
      console.log('Empresa IDs encontrados:', empresaIds);

      console.log('Buscando empresas com IDs:', empresaIds);
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('id, name, subtitle, logo, primary_color')
        .in('id', empresaIds);
      console.log('Resultado de empresas:', empresaData, 'Erro:', empresaError);

      if (empresaError) throw empresaError;

      const formattedEmpresas: EmpresaConfig[] = (empresaData || []).map(w => ({
        id: w.id,
        name: w.name,
        subtitle: w.subtitle || '',
        logo: w.logo || '/images/Sem_Imagem.png',
        primaryColor: w.primary_color,
      }));
      console.log('Empresas formatados:', formattedEmpresas);

      setEmpresas(formattedEmpresas);

      const savedId = localStorage.getItem('current-empresa');
      console.log('ID salvo no localStorage:', savedId);
      const empresa = formattedEmpresas.find(w => w.id === savedId) || formattedEmpresas[0];
      console.log('Empresa selecionado:', empresa);
      setCurrentEmpresa(empresa);
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error);
      toast.error('Erro ao carregar empresas: ' + error.message);
    } finally {
      setIsLoading(false);
      console.log('loadEmpresas finalizado');
    }
  };

  const setEmpresa = (empresaId: string) => {
    console.log('Setando empresa com ID:', empresaId);
    const empresa = empresas.find(w => w.id === empresaId);
    if (empresa) {
      setCurrentEmpresa(empresa);
    } else {
      console.log('Empresa não encontrado para ID:', empresaId);
    }
  };

  return (
    <EmpresaContext.Provider value={{ currentEmpresa, empresas, setEmpresa, isLoading, collapsed, setCollapsed }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  const context = useContext(EmpresaContext);
  if (context === undefined) {
    throw new Error('useEmpresa must be used within a EmpresaProvider');
  }

  return context;
}