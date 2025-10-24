import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Routine {
  id: string;
  empresa_id: string;
  name: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  category: 'pre_venda' | 'venda' | 'entrega' | 'suporte' | null;
  setor: string | null;
  owner: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useRoutines(empresaId: string | null) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (empresaId) {
      loadRoutines();
    }
  }, [empresaId]);

  const loadRoutines = async () => {
    if (!empresaId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutines((data || []) as Routine[]);
    } catch (error: any) {
      console.error('Erro ao carregar rotinas:', error);
      toast.error('Erro ao carregar rotinas');
    } finally {
      setIsLoading(false);
    }
  };

  const createRoutine = async (data: { 
    name: string; 
    description?: string;
    category?: string;
    setor?: string;
    owner?: string;
    due_date?: string;
  }) => {
    if (!empresaId) return null;

    try {
      const { data: routine, error } = await supabase
        .from('routines')
        .insert({
          empresa_id: empresaId,
          name: data.name,
          description: data.description || null,
          category: data.category || null,
          setor: data.setor || null,
          owner: data.owner || null,
          due_date: data.due_date || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Rotina criada com sucesso');
      loadRoutines();
      return routine;
    } catch (error: any) {
      console.error('Erro ao criar rotina:', error);
      toast.error('Erro ao criar rotina');
      return null;
    }
  };

  const updateRoutine = async (id: string, data: Partial<Routine>) => {
    try {
      const { error } = await supabase
        .from('routines')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Rotina atualizada');
      loadRoutines();
    } catch (error: any) {
      console.error('Erro ao atualizar rotina:', error);
      toast.error('Erro ao atualizar rotina');
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Rotina excluída');
      loadRoutines();
    } catch (error: any) {
      console.error('Erro ao excluir rotina:', error);
      toast.error('Erro ao excluir rotina');
    }
  };

  return {
    routines,
    isLoading,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    refreshRoutines: loadRoutines,
  };
}
