import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Routine } from '@/hooks/useRoutines';

interface RoutineEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routine: Routine | null;
  onSubmit: (id: string, data: Partial<Routine>) => void;
  onDelete: (id: string) => void;
}

export function RoutineEditDialog({ open, onOpenChange, routine, onSubmit, onDelete }: RoutineEditDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [setor, setSetor] = useState<string>('');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (routine) {
      setName(routine.name);
      setDescription(routine.description || '');
      setStatus(routine.status);
      setCategory(routine.category || '');
      setSetor(routine.setor || '');
      setOwner(routine.owner || '');
      setDueDate(routine.due_date ? routine.due_date.split('T')[0] : '');
    }
  }, [routine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routine) return;
    
    onSubmit(routine.id, { 
      name, 
      description: description || null,
      status: status as Routine['status'],
      category: category as Routine['category'] || null,
      setor: setor || null,
      owner: owner || null,
      due_date: dueDate || null
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!routine) return;
    if (confirm('Tem certeza que deseja excluir esta rotina?')) {
      onDelete(routine.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Rotina</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Objetivo</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                <SelectItem value="pre_venda">Pré-venda</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="entrega">Entrega</SelectItem>
                <SelectItem value="suporte">Suporte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="setor">Setor</Label>
            <Select value={setor} onValueChange={setSetor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Operações">Operações</SelectItem>
                <SelectItem value="Suporte">Suporte</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="owner">Responsável</Label>
            <Input
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="due_date">Data de Entrega</Label>
            <Input
              id="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
