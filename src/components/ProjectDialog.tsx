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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const projectSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  previsaoEncerramento: z.string().min(1, "Previsão de encerramento é obrigatória"),
  milestone1: z.string().min(1, "Milestone 1 é obrigatório"),
  milestone2: z.string().min(1, "Milestone 2 é obrigatório"),
  milestone3: z.string().min(1, "Milestone 3 é obrigatório"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDialog({ open, onOpenChange }: ProjectDialogProps) {
  const { toast } = useToast();
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
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    console.log("Novo projeto:", data);
    toast({
      title: "Projeto criado!",
      description: `${data.nome} foi criado com sucesso.`,
    });
    form.reset();
    onOpenChange(false);
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
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Projeto</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
