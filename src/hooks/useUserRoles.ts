import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'owner' | 'admin' | 'gerente_financeiro' | 'gerente_operacao' | 'gerente_projetos' | 'membro';

export function useUserRoles(empresaId: string | null) {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!empresaId) {
      setRoles([]);
      setIsLoading(false);
      return;
    }

    const loadRoles = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRoles([]);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('empresa_id', empresaId)
          .eq('user_id', user.id);

        if (fetchError) throw fetchError;

        setRoles((data?.map(r => r.role) || []) as AppRole[]);
        setError(null);
      } catch (err) {
        console.error('Error loading user roles:', err);
        setError(err as Error);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();

    // Subscribe to changes in user_roles
    const channel = supabase
      .channel(`user-roles-${empresaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `empresa_id=eq.${empresaId}`,
        },
        () => {
          loadRoles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [empresaId]);

  const hasRole = (role: AppRole) => roles.includes(role);
  
  const hasAnyRole = (...checkRoles: AppRole[]) => 
    checkRoles.some(r => roles.includes(r));

  const isOwner = hasRole('owner');
  const isAdmin = hasAnyRole('owner', 'admin');
  const canManageFinanceiro = hasAnyRole('owner', 'admin', 'gerente_financeiro');
  const canManageOperacao = hasAnyRole('owner', 'admin', 'gerente_operacao');
  const canManageProjetos = hasAnyRole('owner', 'admin', 'gerente_projetos');

  return {
    roles,
    hasRole,
    hasAnyRole,
    isOwner,
    isAdmin,
    canManageFinanceiro,
    canManageOperacao,
    canManageProjetos,
    isLoading,
    error,
  };
}
