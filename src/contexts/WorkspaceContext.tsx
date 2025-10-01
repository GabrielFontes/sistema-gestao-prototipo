import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WorkspaceConfig {
  id: string;
  name: string;
  subtitle: string | null;
  logo: string | null;
  primary_color: string; // HSL format: "hue saturation lightness"
  role?: 'owner' | 'admin' | 'member';
}

interface WorkspaceContextType {
  currentWorkspace: WorkspaceConfig | null;
  workspaces: WorkspaceConfig[];
  setWorkspace: (workspaceId: string) => void;
  loading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceConfig[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar workspaces do Supabase
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members!inner(role)
        `)
        .order('name');

      if (error) throw error;

      const workspacesWithRole = data.map(w => ({
        id: w.id,
        name: w.name,
        subtitle: w.subtitle,
        logo: w.logo,
        primary_color: w.primary_color,
        role: w.workspace_members[0]?.role as 'owner' | 'admin' | 'member' | undefined,
      }));

      setWorkspaces(workspacesWithRole);

      // Selecionar workspace atual
      const savedId = localStorage.getItem('current-workspace');
      const workspace = savedId 
        ? workspacesWithRole.find(w => w.id === savedId) 
        : workspacesWithRole[0];
      
      if (workspace) {
        setCurrentWorkspace(workspace);
        document.documentElement.style.setProperty('--primary', workspace.primary_color);
        localStorage.setItem('current-workspace', workspace.id);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar CSS variables quando o workspace mudar
  useEffect(() => {
    if (currentWorkspace) {
      document.documentElement.style.setProperty('--primary', currentWorkspace.primary_color);
      localStorage.setItem('current-workspace', currentWorkspace.id);
    }
  }, [currentWorkspace]);

  const setWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  };

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, workspaces, setWorkspace, loading }}>
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
