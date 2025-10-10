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
import { useParams } from "react-router-dom";
import { useState } from "react";

// Cria uma "constante" projectSchema contendo as estruturas: nome, descricao, previsaoEncerramento, milestone1... e define 
const projectSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  previsaoEncerramento: z.string().optional(),
  milestone1: z.string().optional(),
  milestone2: z.string().optional(),
  milestone3: z.string().optional(),
  objetivo: z.string().optional(),
  category: z.enum(['pre_venda', 'venda', 'entrega', 'suporte']).optional(),
});


// Garante que 
type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}
//

export function ProjectDialog({ open, onOpenChange, onProjectCreated }: ProjectDialogProps) {
  const { empresaId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      previsaoEncerramento: "",
      milestone1: "",
      milestone2: "",
      milestone3: "",
      objetivo: "",
      category: undefined,
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (!empresaId) {
      toast.error("Empresa não identificada");
      return;
    }

    setIsLoading(true);
    try {
      // Criar projeto
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          empresa_id: empresaId,
          name: data.nome,
          description: data.descricao || data.objetivo || null,
          status: 'pending',
          category: data.category || null,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Criar milestones se fornecidos
      const milestones = [
        data.milestone1,
        data.milestone2,
        data.milestone3,
      ].filter(Boolean);

      if (milestones.length > 0 && project) {
        const milestonesData = milestones.map((name, index) => ({
          project_id: project.id,
          name,
          status: 'pending',
          due_date: data.previsaoEncerramento || null,
        }));

        const { error: milestonesError } = await supabase
          .from('milestones')
          .insert(milestonesData);

        if (milestonesError) throw milestonesError;
      }

      toast.success(`Projeto "${data.nome}" criado com sucesso!`);
      form.reset();
      onOpenChange(false);
      onProjectCreated?.();
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Não foi possível criar o projeto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
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
                    <Input placeholder="Nome do projeto" {...field} />
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
                    <Textarea placeholder="Descreva o projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objetivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Qual o objetivo do projeto?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previsaoEncerramento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previsão de Encerramento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pre_venda">Pré-venda</SelectItem>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="milestone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Primeira etapa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="milestone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Segunda etapa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="milestone3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Terceira etapa" {...field} />
                    </FormControl>
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
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Projeto"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
