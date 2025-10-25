import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id: string;
  milestone_id: string;
  name: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to: string | null;
  due_date: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export function useTasks(milestoneId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (milestoneId) {
      loadTasks();
    }
  }, [milestoneId]);

  const loadTasks = async () => {
    if (!milestoneId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('milestone_id', milestoneId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data || []) as Task[]);
    } catch (error: any) {
      console.error('Erro ao carregar tarefas:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (data: { 
    name: string; 
    description?: string;
    assigned_to?: string;
    due_date?: string;
  }) => {
    if (!milestoneId) return null;

    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          milestone_id: milestoneId,
          name: data.name,
          description: data.description || null,
          assigned_to: data.assigned_to || null,
          due_date: data.due_date || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Tarefa criada com sucesso');
      loadTasks();
      return task;
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
      return null;
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tarefa atualizada');
      loadTasks();
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tarefa excluída');
      loadTasks();
    } catch (error: any) {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro ao excluir tarefa');
    }
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks,
  };
}
