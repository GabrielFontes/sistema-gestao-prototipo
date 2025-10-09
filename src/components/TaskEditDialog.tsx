import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const taskSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  assigned_to: z.string().max(100).optional(),
  due_date: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
  onTaskUpdated?: () => void;
}

export function TaskEditDialog({ open, onOpenChange, task, onTaskUpdated }: TaskEditDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { name: "", description: "", status: "pending", assigned_to: "", due_date: "" },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        name: task.name || "",
        description: task.description || "",
        status: task.status || "pending",
        assigned_to: task.assigned_to || "",
        due_date: task.due_date || "",
      });
    }
  }, [task, form]);

  const onSubmit = async (data: TaskFormValues) => {
    if (!task?.id) return;

    try {
      const { error } = await supabase.from('tasks').update({
        name: data.name,
        description: data.description || null,
        status: data.status,
        assigned_to: data.assigned_to || null,
        due_date: data.due_date || null,
      }).eq('id', task.id);

      if (error) throw error;

      toast.success('Tarefa atualizada!');
      onOpenChange(false);
      onTaskUpdated?.();
    } catch (error: any) {
      toast.error('Erro: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Editar Tarefa</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nome *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem><FormLabel>Status *</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="assigned_to" render={({ field }) => (
              <FormItem><FormLabel>Responsável</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="due_date" render={({ field }) => (
              <FormItem><FormLabel>Prazo</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
