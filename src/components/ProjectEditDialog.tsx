import { useEffect } from 'react';
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const projectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  status: z.enum(['active', 'completed', 'archived']),
  owner: z.string().max(100).optional(),
  target_value: z.coerce.number().positive().optional(),
  current_value: z.coerce.number().min(0).optional(),
  unit: z.string().max(20).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onProjectUpdated?: () => void;
}

export function ProjectEditDialog({ 
  open, 
  onOpenChange, 
  project,
  onProjectUpdated 
}: ProjectEditDialogProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      owner: "",
      target_value: undefined,
      current_value: undefined,
      unit: "%",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "active",
        owner: project.owner || "",
        target_value: project.target_value || undefined,
        current_value: project.current_value || undefined,
        unit: project.unit || "%",
      });
    }
  }, [project, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!project?.id) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: data.name,
          description: data.description || null,
          status: data.status,
          owner: data.owner || null,
          target_value: data.target_value || null,
          current_value: data.current_value || null,
          unit: data.unit || null,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast.success('Projeto atualizado com sucesso!');
      onOpenChange(false);
      onProjectUpdated?.();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Erro ao atualizar projeto: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do projeto" {...field} />
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
                    <Textarea placeholder="Descreva o projeto" {...field} />
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
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="archived">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="current_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Atual</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="%">Percentual (%)</SelectItem>
                        <SelectItem value="R$">Reais (R$)</SelectItem>
                        <SelectItem value="un">Unidades</SelectItem>
                        <SelectItem value="h">Horas (h)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
