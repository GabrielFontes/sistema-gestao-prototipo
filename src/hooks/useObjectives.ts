import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Objective {
  id: string;
  empresa_id: string;
  name: string;
  description?: string;
  quarter: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface KeyResult {
  id: string;
  objective_id: string;
  project_id?: string;
  name: string;
  description?: string;
  target_value?: number;
  current_value: number;
  created_at: string;
  updated_at: string;
}

export function useObjectives(empresaId: string | null) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [keyResults, setKeyResults] = useState<Record<string, KeyResult[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (empresaId) {
      loadObjectives();
    }
  }, [empresaId]);

  const loadObjectives = async () => {
    if (!empresaId) return;
    
    setIsLoading(true);
    try {
      const { data: objectivesData, error: objectivesError } = await supabase
        .from('objectives')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('year', { ascending: false })
        .order('quarter', { ascending: false });

      if (objectivesError) throw objectivesError;

      setObjectives(objectivesData || []);

      // Load key results for all objectives
      if (objectivesData && objectivesData.length > 0) {
        const objectiveIds = objectivesData.map(obj => obj.id);
        const { data: keyResultsData, error: keyResultsError } = await supabase
          .from('key_results')
          .select('*')
          .in('objective_id', objectiveIds);

        if (keyResultsError) throw keyResultsError;

        // Group key results by objective_id
        const grouped = (keyResultsData || []).reduce((acc, kr) => {
          if (!acc[kr.objective_id]) {
            acc[kr.objective_id] = [];
          }
          acc[kr.objective_id].push(kr);
          return acc;
        }, {} as Record<string, KeyResult[]>);

        setKeyResults(grouped);
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar objetivos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createObjective = async (data: {
    name: string;
    description?: string;
    quarter: number;
    year: number;
  }) => {
    if (!empresaId) return;

    try {
      const { error } = await supabase
        .from('objectives')
        .insert({
          empresa_id: empresaId,
          ...data,
        });

      if (error) throw error;

      toast({
        title: 'Objetivo criado',
        description: 'O objetivo foi criado com sucesso.',
      });

      loadObjectives();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar objetivo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateObjective = async (id: string, data: Partial<Objective>) => {
    try {
      const { error } = await supabase
        .from('objectives')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Objetivo atualizado',
        description: 'O objetivo foi atualizado com sucesso.',
      });

      loadObjectives();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar objetivo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteObjective = async (id: string) => {
    try {
      const { error } = await supabase
        .from('objectives')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Objetivo excluído',
        description: 'O objetivo foi excluído com sucesso.',
      });

      loadObjectives();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir objetivo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const createKeyResult = async (objectiveId: string, data: {
    name: string;
    description?: string;
    project_id?: string;
    target_value?: number;
    current_value?: number;
  }) => {
    try {
      const { error } = await supabase
        .from('key_results')
        .insert({
          objective_id: objectiveId,
          ...data,
        });

      if (error) throw error;

      toast({
        title: 'Resultado-chave criado',
        description: 'O resultado-chave foi criado com sucesso.',
      });

      loadObjectives();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar resultado-chave',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateKeyResult = async (id: string, data: Partial<KeyResult>) => {
    try {
      const { error } = await supabase
        .from('key_results')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Resultado-chave atualizado',
        description: 'O resultado-chave foi atualizado com sucesso.',
      });

      loadObjectives();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar resultado-chave',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteKeyResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('key_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Resultado-chave excluído',
        description: 'O resultado-chave foi excluído com sucesso.',
      });

      loadObjectives();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir resultado-chave',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    objectives,
    keyResults,
    isLoading,
    createObjective,
    updateObjective,
    deleteObjective,
    createKeyResult,
    updateKeyResult,
    deleteKeyResult,
    refreshObjectives: loadObjectives,
  };
}
