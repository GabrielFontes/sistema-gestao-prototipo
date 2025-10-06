import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useObjectives } from '@/hooks/useObjectives';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Target, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function OKRs() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const { objectives, keyResults, isLoading, createObjective, createKeyResult, updateKeyResult, deleteObjective, deleteKeyResult } = useObjectives(empresaId || null);
  const { projects } = useProjects(empresaId || null);

  const [openObjectiveDialog, setOpenObjectiveDialog] = useState(false);
  const [openKeyResultDialog, setOpenKeyResultDialog] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

  const [objectiveForm, setObjectiveForm] = useState({
    name: '',
    description: '',
    quarter: '1',
    year: new Date().getFullYear().toString(),
  });

  const [keyResultForm, setKeyResultForm] = useState({
    name: '',
    description: '',
    project_id: '',
    target_value: '',
    current_value: '0',
  });

  const handleCreateObjective = () => {
    createObjective({
      name: objectiveForm.name,
      description: objectiveForm.description,
      quarter: parseInt(objectiveForm.quarter),
      year: parseInt(objectiveForm.year),
    });
    setObjectiveForm({ name: '', description: '', quarter: '1', year: new Date().getFullYear().toString() });
    setOpenObjectiveDialog(false);
  };

  const handleCreateKeyResult = () => {
    if (!selectedObjectiveId) return;
    
    createKeyResult(selectedObjectiveId, {
      name: keyResultForm.name,
      description: keyResultForm.description,
      project_id: keyResultForm.project_id || undefined,
      target_value: keyResultForm.target_value ? parseFloat(keyResultForm.target_value) : undefined,
      current_value: parseFloat(keyResultForm.current_value),
    });
    setKeyResultForm({ name: '', description: '', project_id: '', target_value: '', current_value: '0' });
    setOpenKeyResultDialog(false);
    setSelectedObjectiveId(null);
  };

  const handleUpdateProgress = async (krId: string, newValue: string) => {
    const value = parseFloat(newValue);
    if (!isNaN(value)) {
      await updateKeyResult(krId, { current_value: value });
    }
  };

  const getProgressPercentage = (current: number, target?: number) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'Sem projeto';
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Projeto não encontrado';
  };

  // Group objectives by year and quarter
  const groupedObjectives = objectives.reduce((acc, obj) => {
    const key = `${obj.year}-Q${obj.quarter}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {} as Record<string, typeof objectives>);

  const sortedPeriods = Object.keys(groupedObjectives).sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">OKRs</h1>
          <p className="text-muted-foreground">Gestão de Objetivos e Resultados-Chave</p>
        </div>
        <Dialog open={openObjectiveDialog} onOpenChange={setOpenObjectiveDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Objetivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Objetivo</DialogTitle>
              <DialogDescription>Defina um novo objetivo para o trimestre.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Objetivo</Label>
                <Input
                  id="name"
                  value={objectiveForm.name}
                  onChange={(e) => setObjectiveForm({ ...objectiveForm, name: e.target.value })}
                  placeholder="Ex: Aumentar a receita recorrente"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={objectiveForm.description}
                  onChange={(e) => setObjectiveForm({ ...objectiveForm, description: e.target.value })}
                  placeholder="Descreva o objetivo..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quarter">Trimestre</Label>
                  <Select value={objectiveForm.quarter} onValueChange={(value) => setObjectiveForm({ ...objectiveForm, quarter: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Q1</SelectItem>
                      <SelectItem value="2">Q2</SelectItem>
                      <SelectItem value="3">Q3</SelectItem>
                      <SelectItem value="4">Q4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    value={objectiveForm.year}
                    onChange={(e) => setObjectiveForm({ ...objectiveForm, year: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenObjectiveDialog(false)}>Cancelar</Button>
              <Button onClick={handleCreateObjective} disabled={!objectiveForm.name}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Objectives by Period */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      ) : sortedPeriods.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum objetivo criado ainda. Clique em "Novo Objetivo" para começar.
          </CardContent>
        </Card>
      ) : (
        sortedPeriods.map((period) => (
          <div key={period} className="space-y-4">
            <h2 className="text-xl font-semibold">{period}</h2>
            {groupedObjectives[period].map((objective) => (
              <Card key={objective.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{objective.name}</CardTitle>
                        {objective.description && (
                          <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedObjectiveId(objective.id);
                          setOpenKeyResultDialog(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteObjective(objective.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {keyResults[objective.id] && keyResults[objective.id].length > 0 ? (
                    <div className="space-y-4">
                      {keyResults[objective.id].map((kr) => (
                        <div key={kr.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2 flex-1">
                              <TrendingUp className="h-4 w-4 mt-1 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="font-medium">{kr.name}</p>
                                {kr.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{kr.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  Projeto: {getProjectName(kr.project_id)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteKeyResult(kr.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {kr.target_value && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progresso</span>
                                <span className="font-medium">
                                  {kr.current_value} / {kr.target_value}
                                </span>
                              </div>
                              <Progress value={getProgressPercentage(kr.current_value, kr.target_value)} />
                              <Input
                                type="number"
                                placeholder="Atualizar valor atual"
                                className="w-full"
                                onBlur={(e) => handleUpdateProgress(kr.id, e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum resultado-chave definido. Clique no + para adicionar.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}

      {/* Key Result Dialog */}
      <Dialog open={openKeyResultDialog} onOpenChange={setOpenKeyResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Resultado-Chave</DialogTitle>
            <DialogDescription>Defina um resultado-chave mensurável para este objetivo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="kr-name">Nome do Resultado-Chave</Label>
              <Input
                id="kr-name"
                value={keyResultForm.name}
                onChange={(e) => setKeyResultForm({ ...keyResultForm, name: e.target.value })}
                placeholder="Ex: Alcançar R$ 100k MRR"
              />
            </div>
            <div>
              <Label htmlFor="kr-description">Descrição</Label>
              <Textarea
                id="kr-description"
                value={keyResultForm.description}
                onChange={(e) => setKeyResultForm({ ...keyResultForm, description: e.target.value })}
                placeholder="Descreva o resultado-chave..."
              />
            </div>
            <div>
              <Label htmlFor="kr-project">Projeto Associado</Label>
              <Select value={keyResultForm.project_id} onValueChange={(value) => setKeyResultForm({ ...keyResultForm, project_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem projeto</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kr-target">Meta</Label>
                <Input
                  id="kr-target"
                  type="number"
                  value={keyResultForm.target_value}
                  onChange={(e) => setKeyResultForm({ ...keyResultForm, target_value: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="kr-current">Valor Atual</Label>
                <Input
                  id="kr-current"
                  type="number"
                  value={keyResultForm.current_value}
                  onChange={(e) => setKeyResultForm({ ...keyResultForm, current_value: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenKeyResultDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateKeyResult} disabled={!keyResultForm.name}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
