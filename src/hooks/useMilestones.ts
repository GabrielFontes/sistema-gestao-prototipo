import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export function useMilestones(projectId: string | null) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadMilestones();
    }
  }, [projectId]);

  const loadMilestones = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setMilestones((data || []) as Milestone[]);
    } catch (error: any) {
      console.error('Erro ao carregar milestones:', error);
      toast.error('Erro ao carregar milestones');
    } finally {
      setIsLoading(false);
    }
  };

  const createMilestone = async (data: { 
    name: string; 
    description?: string;
    due_date?: string;
  }) => {
    if (!projectId) return null;

    try {
      const { data: milestone, error } = await supabase
        .from('milestones')
        .insert({
          project_id: projectId,
          name: data.name,
          description: data.description || null,
          due_date: data.due_date || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Milestone criado com sucesso');
      loadMilestones();
      return milestone;
    } catch (error: any) {
      console.error('Erro ao criar milestone:', error);
      toast.error('Erro ao criar milestone');
      return null;
    }
  };

  const updateMilestone = async (id: string, data: Partial<Milestone>) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Milestone atualizado');
      loadMilestones();
    } catch (error: any) {
      console.error('Erro ao atualizar milestone:', error);
      toast.error('Erro ao atualizar milestone');
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Milestone excluído');
      loadMilestones();
    } catch (error: any) {
      console.error('Erro ao excluir milestone:', error);
      toast.error('Erro ao excluir milestone');
    }
  };

  return {
    milestones,
    isLoading,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    refreshMilestones: loadMilestones,
  };
}
