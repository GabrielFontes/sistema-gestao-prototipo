import { supabase } from "@/integrations/supabase/client";

/**
 * API para gerenciar Empresas
 * 
 * Exemplo de uso:
 * ```typescript
 * // Buscar empresas do usuário
 * const empresas = await empresaApi.getEmpresas();
 * 
 * // Buscar projetos de um empresa
 * const projects = await empresaApi.getProjects(empresaId);
 * 
 * // Criar novo projeto
 * await empresaApi.createProject(empresaId, { name: "Novo Projeto", description: "..." });
 * ```
 */

export const empresaApi = {
  /**
   * Busca todos os empresas do usuário autenticado
   */
  async getEmpresas() {
    const { data, error } = await supabase
      .from('empresas')
      .select(`
        *,
        empresa_members!inner(role)
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  /**
   * Busca projetos de um empresa específico
   */
  async getProjects(empresaId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Cria um novo projeto em um empresa
   */
  async createProject(empresaId: string, project: {
    name: string;
    description?: string;
    status?: 'active' | 'completed' | 'archived';
  }) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        empresa_id: empresaId,
        ...project,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualiza um projeto
   */
  async updateProject(projectId: string, updates: {
    name?: string;
    description?: string;
    status?: 'active' | 'completed' | 'archived';
  }) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Busca milestones de um projeto
   */
  async getMilestones(projectId: string) {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Cria um novo milestone em um projeto
   */
  async createMilestone(projectId: string, milestone: {
    name: string;
    description?: string;
    due_date?: string;
    status?: 'pending' | 'in_progress' | 'completed';
  }) {
    const { data, error } = await supabase
      .from('milestones')
      .insert({
        project_id: projectId,
        ...milestone,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualiza um milestone
   */
  async updateMilestone(milestoneId: string, updates: {
    name?: string;
    description?: string;
    due_date?: string;
    status?: 'pending' | 'in_progress' | 'completed';
  }) {
    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Busca tarefas de um milestone
   */
  async getTasks(milestoneId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('milestone_id', milestoneId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Cria uma nova tarefa em um milestone
   */
  async createTask(milestoneId: string, task: {
    name: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    assigned_to?: string;
    due_date?: string;
  }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        milestone_id: milestoneId,
        ...task,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualiza uma tarefa
   */
  async updateTask(taskId: string, updates: {
    name?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    assigned_to?: string;
    due_date?: string;
  }) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deleta um projeto (apenas owners e admins)
   */
  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  },

  /**
   * Deleta um milestone
   */
  async deleteMilestone(milestoneId: string) {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', milestoneId);

    if (error) throw error;
  },

  /**
   * Deleta uma tarefa
   */
  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  },
};
