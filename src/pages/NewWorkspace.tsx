import { useAuth } from '@/hooks/useAuth';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

function NewWorkspace() {
  const { user } = useAuth();
  const { setWorkspace, refreshWorkspaces } = useWorkspace();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [logo, setLogo] = useState('');
  const [primaryColor, setPrimaryColor] = useState('hsl(220, 60%, 50%)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      console.log('Criando workspace com dados:', { name, subtitle, logo, primaryColor });
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name,
          subtitle,
          logo: logo || '/src/images/Logo_Claro.png',
          primary_color: primaryColor,
        })
        .select()
        .single();

      if (workspaceError) {
        console.error('Erro ao criar workspace:', workspaceError);
        throw workspaceError;
      }

      console.log('Workspace criado:', workspace);

      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'member',
        });

      if (memberError) {
        console.error('Erro ao criar associação:', memberError);
        throw memberError;
      }

      console.log('Associação criada para user_id:', user.id);
      setWorkspace(workspace.id);
      refreshWorkspaces(); // Refresh workspaces after creation
      toast({
        title: 'Sucesso',
        description: 'Workspace criado com sucesso!',
      });
      navigate(`/workspace/${workspace.id}`);
    } catch (error: any) {
      console.error('Erro geral ao criar workspace:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o workspace: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Criar Novo Workspace</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Workspace
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
              Subtítulo (opcional)
            </label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              URL do Logo (opcional)
            </label>
            <Input
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="Deixe vazio para usar o padrão"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
              Cor Primária (HSL)
            </label>
            <Input
              id="primaryColor"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="Ex: hsl(220, 60%, 50%)"
              className="mt-1"
            />
          </div>
          <Button type="submit">Criar Workspace</Button>
        </form>
      </div>
    </div>
  );
}

export default NewWorkspace;