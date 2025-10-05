// /src/hooks/useEmpresas.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Empresa {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  primaryColor: string;
}

export function useEmpresas(user: User | null) {
  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ['empresas', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Buscar empresas via empresa_members (como no EmpresaContext)
      const { data: memberData, error: memberError } = await supabase
        .from('empresa_members')
        .select('empresa_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) return [];

      const empresaIds = memberData.map(m => m.empresa_id);

      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('id, name, subtitle, logo, primary_color')
        .in('id', empresaIds);

      if (empresaError) throw empresaError;

      return (empresaData || []).map(w => ({
        id: w.id,
        name: w.name,
        subtitle: w.subtitle || '',
        logo: w.logo || '/images/Logo_Claro.png',
        primaryColor: w.primary_color,
      }));
    },
    enabled: !!user,
  });

  return { empresas, loading: isLoading };
}