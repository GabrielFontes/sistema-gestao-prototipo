import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Project {
  id: string;
  empresa_id: string;
  name: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  category: 'pre_venda' | 'venda' | 'entrega' | 'suporte' | null;
  setor: string | null;
  owner: string | null;
  due_date: string | null;
  target_value: number | null;
  current_value: number | null;
  unit: string | null;
  created_at: string;
  updated_at: string;
}

export function useProjects(empresaId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (empresaId) {
      loadProjects();
    }
  }, [empresaId]);

  const loadProjects = async () => {
    if (!empresaId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []) as Project[]);
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (data: { 
    name: string; 
    description?: string;
    category?: string;
    setor?: string;
    owner?: string;
    due_date?: string;
  }) => {
    if (!empresaId) return null;

    try {
      const { data: project, error } = await supabase
        .from('projects')
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
      
      toast.success('Projeto criado com sucesso');
      loadProjects();
      return project;
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto');
      return null;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Projeto atualizado');
      loadProjects();
    } catch (error: any) {
      console.error('Erro ao atualizar projeto:', error);
      toast.error('Erro ao atualizar projeto');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Projeto excluído');
      loadProjects();
    } catch (error: any) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    }
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: loadProjects,
  };
}
