import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkspaceConfig {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  primaryColor: string; // HSL format: "hue saturation lightness"
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
      // Atualizar CSS variables quando o workspace mudar
      document.documentElement.style.setProperty('--primary', currentWorkspace.primaryColor);
      localStorage.setItem('current-workspace', currentWorkspace.id);
    }
  }, [currentWorkspace]);

  const loadWorkspaces = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Buscar workspaces do usuário
      const { data: memberData, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        setIsLoading(false);
        return;
      }

      const workspaceIds = memberData.map(m => m.workspace_id);

      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds);

      if (workspaceError) throw workspaceError;

      const formattedWorkspaces: WorkspaceConfig[] = (workspaceData || []).map(w => ({
        id: w.id,
        name: w.name,
        subtitle: w.subtitle || '',
        logo: w.logo || '/src/images/Logo_Claro.png',
        primaryColor: w.primary_color,
      }));

      setWorkspaces(formattedWorkspaces);

      // Restaurar workspace salvo ou usar o primeiro
      const savedId = localStorage.getItem('current-workspace');
      const workspace = formattedWorkspaces.find(w => w.id === savedId) || formattedWorkspaces[0];
      setCurrentWorkspace(workspace);

    } catch (error: any) {
      console.error('Erro ao carregar workspaces:', error);
      toast.error('Erro ao carregar workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const setWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
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
