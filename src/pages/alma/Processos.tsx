import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, FolderOpen } from "lucide-react";
import { ProcessDialog } from "@/components/ProcessDialog";
import { ProcessEditDialog } from "@/components/ProcessEditDialog";
import { useProcesses } from "@/hooks/useProcesses";
import { useParams } from "react-router-dom";
import { useUserRoles } from "@/hooks/useUserRoles";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";

const columns: KanbanColumn[] = [
  { id: 'pending', title: 'A Fazer', status: 'pending' },
  { id: 'in_progress', title: 'Em Andamento', status: 'in_progress' },
  { id: 'completed', title: 'Concluídos', status: 'completed' },
];

const categories = [
  { id: 'pre_venda', label: 'Pré-venda', icon: '📦' },
  { id: 'venda', label: 'Venda', icon: '🤝' },
  { id: 'entrega', label: 'Entrega', icon: '🚚' },
  { id: 'suporte', label: 'Suporte', icon: '🛟' },
];

export default function Processos() {
  const { empresaId } = useParams();
  const { processes, isLoading, updateProcess, createProcess, deleteProcess } = useProcesses(empresaId || '');
  const { canManageOperacao } = useUserRoles(empresaId || null);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const handleStatusChange = async (processId: string, newStatus: string) => {
    await updateProcess(processId, { status: newStatus as any });
  };

  const handleCreateProcess = async (data: any) => {
    await createProcess(data);
  };

  const handleUpdateProcess = async (data: any) => {
    if (editingProcess) {
      await updateProcess(editingProcess.id, data);
    }
  };

  const handleDeleteProcess = async () => {
    if (editingProcess) {
      await deleteProcess(editingProcess.id);
    }
  };

  const renderProcessCard = (process: any) => (
    <Card
      key={process.id}
      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setEditingProcess(process)}
    >
      <div className="space-y-2">
        <h4 className="font-medium text-sm line-clamp-2">{process.name}</h4>
        {process.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{process.description}</p>
        )}
        {process.owner && (
          <p className="text-xs text-muted-foreground">👤 {process.owner}</p>
        )}
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Processos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os processos operacionais
          </p>
        </div>
        <div className="flex gap-2">
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
            <ToggleGroupItem value="kanban" aria-label="Kanban">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Lista">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          {canManageOperacao && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          )}
        </div>
      </div>

      {processes.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <FolderOpen className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum processo encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Comece criando seu primeiro processo
              </p>
            </div>
            {canManageOperacao && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Processo
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          columns={columns}
          categories={categories}
          items={processes}
          renderItem={renderProcessCard}
          onStatusChange={handleStatusChange}
          getCategoryLabel={(catId) => categories.find(c => c.id === catId)?.label || ''}
          getCategoryIcon={(catId) => categories.find(c => c.id === catId)?.icon || ''}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processes.map((process) => renderProcessCard(process))}
        </div>
      )}

      <ProcessDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateProcess}
      />

      <ProcessEditDialog
        open={editingProcess !== null}
        onOpenChange={(open) => !open && setEditingProcess(null)}
        process={editingProcess}
        onSubmit={handleUpdateProcess}
        onDelete={handleDeleteProcess}
      />
    </div>
  );
}
