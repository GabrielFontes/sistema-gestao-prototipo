import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { useToast } from "@/hooks/use-toast";

const taskSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  iniciativa: z.string().optional(),
  deadline: z.string().min(1, "Prazo é obrigatório"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneId: string | null;
  onTaskCreated?: () => void;
}

export function TaskDialog({ open, onOpenChange, milestoneId, onTaskCreated }: TaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      iniciativa: "",
      deadline: "",
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    if (!milestoneId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        milestone_id: milestoneId,
        name: data.nome,
        description: data.descricao || null,
        status: 'pending',
        due_date: data.deadline || null,
      });

      if (error) throw error;

      toast.success(`Tarefa "${data.nome}" criada com sucesso!`);
      form.reset();
      onOpenChange(false);
      onTaskCreated?.();
    } catch (error: any) {
      toast.error("Erro ao criar tarefa: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da tarefa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva a tarefa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iniciativa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Iniciativa (opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um projeto ou operação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="projeto1">Projeto Alpha</SelectItem>
                      <SelectItem value="projeto2">Projeto Beta</SelectItem>
                      <SelectItem value="op1">Operação Delta</SelectItem>
                      <SelectItem value="op2">Operação Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
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

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Tarefa</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
