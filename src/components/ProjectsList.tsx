import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProjectDialog } from "./ProjectDialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

export function ProjectsList() {
  const { empresaId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      setProjects(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Não foi possível carregar os projetos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [empresaId]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir o projeto "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Projeto excluído com sucesso');
      loadProjects();
    } catch (error: any) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Não foi possível excluir o projeto');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      active: { label: 'Ativo', className: 'bg-green-500' },
      completed: { label: 'Concluído', className: 'bg-blue-500' },
      on_hold: { label: 'Pausado', className: 'bg-yellow-500' },
      cancelled: { label: 'Cancelado', className: 'bg-red-500' },
    };
    
    const variant = variants[status] || variants.active;
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando projetos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Projetos</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Nenhum projeto criado ainda</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {project.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(project.id, project.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {getStatusBadge(project.status)}
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onProjectCreated={loadProjects}
      />
    </div>
  );
}
