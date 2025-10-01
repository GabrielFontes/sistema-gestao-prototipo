import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkspaceConfig {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  primaryColor: string;
}

interface WorkspaceContextType {
  currentWorkspace: WorkspaceConfig | null;
  workspaces: WorkspaceConfig[];
  setWorkspace: (workspaceId: string) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceConfig[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (currentWorkspace) {
      console.log('Atualizando CSS e localStorage para workspace:', currentWorkspace);
      document.documentElement.style.setProperty('--primary', currentWorkspace.primaryColor);
      localStorage.setItem('current-workspace', currentWorkspace.id);
    }
  }, [currentWorkspace]);

  const loadWorkspaces = async () => {
    try {
      console.log('Iniciando loadWorkspaces...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Usuário retornado:', user, 'Erro:', userError);

      if (userError) throw userError;
      if (!user) {
        console.log('Nenhum usuário logado');
        setIsLoading(false);
        return;
      }

      console.log('Buscando workspace_members para user_id:', user.id);
      const { data: memberData, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id);
      console.log('Resultado de workspace_members:', memberData, 'Erro:', memberError);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        console.log('Nenhum workspace associado ao usuário');
        setWorkspaces([]);
        setIsLoading(false);
        return;
      }

      const workspaceIds = memberData.map(m => m.workspace_id);
      console.log('Workspace IDs encontrados:', workspaceIds);

      console.log('Buscando workspaces com IDs:', workspaceIds);
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id, name, subtitle, logo, primary_color')
        .in('id', workspaceIds);
      console.log('Resultado de workspaces:', workspaceData, 'Erro:', workspaceError);

      if (workspaceError) throw workspaceError;

      const formattedWorkspaces: WorkspaceConfig[] = (workspaceData || []).map(w => ({
        id: w.id,
        name: w.name,
        subtitle: w.subtitle || '',
        logo: w.logo || '/src/images/Logo_Claro.png',
        primaryColor: w.primary_color,
      }));
      console.log('Workspaces formatados:', formattedWorkspaces);

      setWorkspaces(formattedWorkspaces);

      const savedId = localStorage.getItem('current-workspace');
      console.log('ID salvo no localStorage:', savedId);
      const workspace = formattedWorkspaces.find(w => w.id === savedId) || formattedWorkspaces[0];
      console.log('Workspace selecionado:', workspace);
      setCurrentWorkspace(workspace);

    } catch (error: any) {
      console.error('Erro ao carregar workspaces:', error);
      toast.error('Erro ao carregar workspaces: ' + error.message);
    } finally {
      setIsLoading(false);
      console.log('loadWorkspaces finalizado');
    }
  };

  const setWorkspace = (workspaceId: string) => {
    console.log('Setando workspace com ID:', workspaceId);
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
    } else {
      console.log('Workspace não encontrado para ID:', workspaceId);
    }
  };

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, workspaces, setWorkspace, isLoading }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}