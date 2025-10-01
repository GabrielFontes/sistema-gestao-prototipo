// /src/hooks/useWorkspaces.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Workspace {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  primaryColor: string;
}

export function useWorkspaces(user: User | null) {
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Buscar workspaces via workspace_members (como no WorkspaceContext)
      const { data: memberData, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) return [];

      const workspaceIds = memberData.map(m => m.workspace_id);

      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id, name, subtitle, logo, primary_color')
        .in('id', workspaceIds);

      if (workspaceError) throw workspaceError;

      return (workspaceData || []).map(w => ({
        id: w.id,
        name: w.name,
        subtitle: w.subtitle || '',
        logo: w.logo || '/src/images/Logo_Claro.png',
        primaryColor: w.primary_color,
      }));
    },
    enabled: !!user,
  });

  return { workspaces, loading: isLoading };
}