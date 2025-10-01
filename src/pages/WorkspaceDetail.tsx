import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function WorkspaceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const supabase = createClient();

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['workspace', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('id, name, description, created_at')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!workspace) {
    return <div className="flex items-center justify-center min-h-screen">Workspace não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          Voltar
        </Button>
        <h1 className="text-3xl font-bold mt-4">{workspace.name}</h1>
        {workspace.description && (
          <p className="text-gray-600 mt-2">{workspace.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Criado em {new Date(workspace.created_at).toLocaleDateString('pt-BR')}
        </p>
        {/* Adicione conteúdo específico do workspace aqui */}
      </div>
    </div>
  );
}

export default WorkspaceDetail;