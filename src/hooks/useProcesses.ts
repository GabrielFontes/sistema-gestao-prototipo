import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Process {
  id: string;
  empresa_id: string;
  name: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'pre_venda' | 'venda' | 'entrega' | 'suporte';
  owner: string | null;
  created_at: string;
  updated_at: string;
}

export function useProcesses(empresaId: string | null) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (empresaId) {
      loadProcesses();
    }
  }, [empresaId]);

  const loadProcesses = async () => {
    if (!empresaId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('processes')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProcesses((data || []) as Process[]);
    } catch (error: any) {
      console.error('Erro ao carregar processos:', error);
      toast.error('Erro ao carregar processos');
    } finally {
      setIsLoading(false);
    }
  };

  const createProcess = async (data: { 
    name: string; 
    description?: string; 
    category: string;
    status?: string;
    owner?: string;
  }) => {
    if (!empresaId) return null;

    try {
      const { data: process, error } = await supabase
        .from('processes')
        .insert({
          empresa_id: empresaId,
          name: data.name,
          description: data.description || null,
          category: data.category,
          status: data.status || 'pending',
          owner: data.owner || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Processo criado com sucesso');
      loadProcesses();
      return process;
    } catch (error: any) {
      console.error('Erro ao criar processo:', error);
      toast.error('Erro ao criar processo');
      return null;
    }
  };

  const updateProcess = async (id: string, data: Partial<Process>) => {
    try {
      const { error } = await supabase
        .from('processes')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Processo atualizado');
      loadProcesses();
    } catch (error: any) {
      console.error('Erro ao atualizar processo:', error);
      toast.error('Erro ao atualizar processo');
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      const { error } = await supabase
        .from('processes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Processo excluído');
      loadProcesses();
    } catch (error: any) {
      console.error('Erro ao excluir processo:', error);
      toast.error('Erro ao excluir processo');
    }
  };

  return {
    processes,
    isLoading,
    createProcess,
    updateProcess,
    deleteProcess,
    refreshProcesses: loadProcesses,
  };
}
