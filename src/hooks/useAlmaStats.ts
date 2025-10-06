import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAlmaStats(empresaId: string | null) {
  const [stats, setStats] = useState({
    activeProjects: 0,
    sprintTasks: 0,
    activeProcesses: 0,
    unorganizedNotes: 0,
  });

  useEffect(() => {
    if (!empresaId) return;

    const fetchStats = async () => {
      try {
        // Count active projects
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId)
          .eq('status', 'active');

        // Count tasks in progress or pending (sprint tasks)
        const { data: projectIds } = await supabase
          .from('projects')
          .select('id')
          .eq('empresa_id', empresaId);

        let tasksCount = 0;
        if (projectIds && projectIds.length > 0) {
          const { data: milestones } = await supabase
            .from('milestones')
            .select('id')
            .in('project_id', projectIds.map(p => p.id));

          if (milestones && milestones.length > 0) {
            const { count } = await supabase
              .from('tasks')
              .select('*', { count: 'exact', head: true })
              .in('milestone_id', milestones.map(m => m.id))
              .in('status', ['pending', 'in_progress']);
            
            tasksCount = count || 0;
          }
        }

        setStats({
          activeProjects: projectsCount || 0,
          sprintTasks: tasksCount,
          activeProcesses: 0, // External data (AppSheet)
          unorganizedNotes: 0, // External data (AppSheet)
        });
      } catch (error) {
        console.error('Error fetching alma stats:', error);
      }
    };

    fetchStats();

    // Subscribe to changes
    const projectsChannel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `empresa_id=eq.${empresaId}`
      }, fetchStats)
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks'
      }, fetchStats)
      .subscribe();

    return () => {
      projectsChannel.unsubscribe();
      tasksChannel.unsubscribe();
    };
  }, [empresaId]);

  return stats;
}
