import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const milestoneSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  due_date: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

type MilestoneFormValues = z.infer<typeof milestoneSchema>;

interface Milestone {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  description: string | null;
}

interface MilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
  milestones: Milestone[];
  onMilestonesUpdated?: () => void;
}

export function MilestoneDialog({ 
  open, 
  onOpenChange, 
  projectId,
  milestones,
  onMilestonesUpdated 
}: MilestoneDialogProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(null);

  const form = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      name: "",
      description: "",
      due_date: "",
      status: "pending",
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      due_date: "",
      status: "pending",
    });
    setEditingMilestone(null);
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    form.reset({
      name: milestone.name,
      description: milestone.description || "",
      due_date: milestone.due_date || "",
      status: milestone.status as 'pending' | 'in_progress' | 'completed',
    });
    setIsCreating(true);
  };

  const onSubmit = async (data: MilestoneFormValues) => {
    if (!projectId) return;

    try {
      if (editingMilestone) {
        // Update existing milestone
        const { error } = await supabase
          .from('milestones')
          .update({
            name: data.name,
            description: data.description || null,
            due_date: data.due_date || null,
            status: data.status,
          })
          .eq('id', editingMilestone.id);

        if (error) throw error;
        toast.success('Milestone atualizado!');
      } else {
        // Create new milestone
        const { error } = await supabase
          .from('milestones')
          .insert({
            project_id: projectId,
            name: data.name,
            description: data.description || null,
            due_date: data.due_date || null,
            status: data.status,
          });

        if (error) throw error;
        toast.success('Milestone criado!');
      }

      resetForm();
      setIsCreating(false);
      onMilestonesUpdated?.();
    } catch (error: any) {
      console.error('Error saving milestone:', error);
      toast.error('Erro ao salvar milestone: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!milestoneToDelete) return;

    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneToDelete.id);

      if (error) throw error;

      toast.success('Milestone excluído!');
      setDeleteDialogOpen(false);
      setMilestoneToDelete(null);
      onMilestonesUpdated?.();
    } catch (error: any) {
      console.error('Error deleting milestone:', error);
      toast.error('Erro ao excluir milestone: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      pending: { variant: "outline", label: "Pendente" },
      in_progress: { variant: "default", label: "Em Progresso" },
      completed: { variant: "secondary", label: "Concluído" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setIsCreating(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Milestones do Projeto</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!isCreating ? (
              <>
                <Button 
                  onClick={() => setIsCreating(true)} 
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Milestone
                </Button>

                <div className="space-y-3">
                  {milestones.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      Nenhum milestone criado ainda
                    </p>
                  ) : (
                    milestones.map((milestone) => (
                      <Card key={milestone.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{milestone.name}</h4>
                              {getStatusBadge(milestone.status)}
                            </div>
                            {milestone.description && (
                              <p className="text-sm text-muted-foreground">
                                {milestone.description}
                              </p>
                            )}
                            {milestone.due_date && (
                              <p className="text-xs text-muted-foreground">
                                Prazo: {new Date(milestone.due_date).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(milestone)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setMilestoneToDelete(milestone);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do milestone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva o milestone" rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="in_progress">Em Progresso</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prazo</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingMilestone ? 'Salvar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              O milestone "{milestoneToDelete?.name}" e todas as suas tarefas serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
