import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WorkspaceConfig {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  primaryColor: string; // HSL format: "hue saturation lightness"
}

export const workspaces: WorkspaceConfig[] = [
  {
    id: 'empresa1',
    name: 'Empresa de corpo',
    subtitle: 'mente e alma',
    logo: '/src/images/Logo_Claro.png',
    primaryColor: '240 5.9% 10%', // Cor atual
  },
  {
    id: 'empresa2',
    name: 'Tech Solutions',
    subtitle: 'inovação e tecnologia',
    logo: '/src/images/Logo_Claro.png',
    primaryColor: '142 76% 36%', // Verde
  },
  {
    id: 'empresa3',
    name: 'Creative Studios',
    subtitle: 'design e criatividade',
    logo: '/src/images/Logo_Claro.png',
    primaryColor: '262 83% 58%', // Roxo
  },
];

interface WorkspaceContextType {
  currentWorkspace: WorkspaceConfig;
  setWorkspace: (workspaceId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceConfig>(() => {
    const saved = localStorage.getItem('current-workspace');
    return workspaces.find(w => w.id === saved) || workspaces[0];
  });

  useEffect(() => {
    // Atualizar CSS variables quando o workspace mudar
    document.documentElement.style.setProperty('--primary', currentWorkspace.primaryColor);
    localStorage.setItem('current-workspace', currentWorkspace.id);
  }, [currentWorkspace]);

  const setWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  };

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setWorkspace }}>
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
