import { useState } from "react";
import { useParams } from "react-router-dom";
import { useObjectives } from "@/hooks/useObjectives";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";

// Circular Progress Component
const CircularProgress = ({ value, label }: { value: number; label?: string }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg className="w-20 h-20" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 32 32)"
          className="transition-all duration-300"
        />
        <text x="32" y="32" textAnchor="middle" dy="0.3em" className="text-sm font-semibold fill-foreground">
          {Math.round(value)}%
        </text>
      </svg>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
};

export default function OKRs() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const {
    objectives,
    keyResults,
    isLoading,
    createObjective,
    createKeyResult,
    updateKeyResult,
    deleteObjective,
    deleteKeyResult,
  } = useObjectives(empresaId || null);
  const { projects } = useProjects(empresaId || null);

  const [openObjective, setOpenObjective] = useState(false);
  const [openKR, setOpenKR] = useState(false);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [selectedKR, setSelectedKR] = useState<string | null>(null);

  const [objectiveForm, setObjectiveForm] = useState({
    name: "",
    description: "",
    trimestre: "1",
    year: new Date().getFullYear().toString(),
  });

  const allPeriods = ["T1", "T2", "T3", "T4"];

  const [keyResultForm, setKeyResultForm] = useState({
    name: "",
    description: "",
    project_ids: [] as string[],
    target_value: "",
    current_value: "0",
    unit: "%",
  });

  const [addProjectForm, setAddProjectForm] = useState({
    project_ids: [] as string[],
  });

  const handleCreateObjective = () => {
    createObjective({
      name: objectiveForm.name,
      description: objectiveForm.description,
      trimestre: parseInt(objectiveForm.trimestre),
      year: parseInt(objectiveForm.year),
    });
    setObjectiveForm({
      name: "",
      description: "",
      trimestre: "1",
      year: new Date().getFullYear().toString(),
    });
    setOpenObjective(false);
  };

  const handleCreateKeyResult = () => {
    if (!selectedObjective) return;
    createKeyResult(selectedObjective, {
      name: keyResultForm.name,
      description: keyResultForm.description,
      project_ids: keyResultForm.project_ids.length ? keyResultForm.project_ids : undefined,
      target_value: keyResultForm.target_value
        ? parseFloat(keyResultForm.target_value)
        : undefined,
      current_value: parseFloat(keyResultForm.current_value),
      unit: keyResultForm.unit,
    });
    setKeyResultForm({
      name: "",
      description: "",
      project_ids: [],
      target_value: "",
      current_value: "0",
      unit: "%",
    });
    setOpenKR(false);
    setSelectedObjective(null);
  };

  const handleAddProjects = () => {
    if (!selectedKR) return;
    
    const kr = Object.values(keyResults).flat().find(k => k.id === selectedKR);
    if (!kr) return;

    const currentProjects = kr.project_ids || [];
    const newProjects = [...currentProjects, ...addProjectForm.project_ids];
    
    updateKeyResult(selectedKR, { project_ids: newProjects });
    
    setAddProjectForm({ project_ids: [] });
    setOpenAddProject(false);
    setSelectedKR(null);
  };

  const handleUpdateProgress = async (krId: string, newValue: string) => {
    const value = parseFloat(newValue);
    if (!isNaN(value)) {
      // Atualizar apenas o estado local sem recarregar tudo
      await updateKeyResult(krId, { current_value: value });
    }
  };

  const getProgress = (current: number | undefined, target: number | undefined) =>
    !target || target === 0 || !current ? 0 : Math.min((current / target) * 100, 100);

  const getProjectName = (id?: string) =>
    id ? projects.find((p) => p.id === id)?.name || "Projeto não encontrado" : "Sem projeto";

  const getProjectOwner = (id?: string) =>
    id ? projects.find((p) => p.id === id)?.owner || "Não atribuído" : "Não atribuído";

  const getProjectStatus = (id?: string) =>
    id ? projects.find((p) => p.id === id)?.status || "Desconhecido" : "Desconhecido";

  const getProjectProgress = (id?: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project || !project.target_value) return 0;
    return getProgress(project.current_value || 0, project.target_value);
  };

  const getAvailableProjects = (krId: string) => {
    const kr = Object.values(keyResults).flat().find(k => k.id === krId);
    const usedProjectIds = kr?.project_ids || [];
    return projects.filter(p => !usedProjectIds.includes(p.id));
  };

  const grouped = objectives.reduce((acc, o) => {
    const key = `${o.year}-T${o.trimestre}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(o);
    return acc;
  }, {} as Record<string, typeof objectives>);

  const sorted = Object.keys(grouped).sort().reverse();
  const currentTrimestre = `${new Date().getFullYear()}-T${Math.ceil((new Date().getMonth() + 1) / 3)}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OKRs</h1>
          <p className="text-muted-foreground">Objetivos e Resultados-Chave</p>
        </div>
        <Dialog open={openObjective} onOpenChange={setOpenObjective}>
          <DialogTrigger asChild>
            <Button>Novo Objetivo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Objetivo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Objetivo</Label>
                <Input
                  placeholder="Ex: Aumentar receita"
                  value={objectiveForm.name}
                  onChange={(e) =>
                    setObjectiveForm({ ...objectiveForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Descreva o objetivo"
                  value={objectiveForm.description}
                  onChange={(e) =>
                    setObjectiveForm({ ...objectiveForm, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Trimestre</Label>
                  <Select
                    value={objectiveForm.trimestre}
                    onValueChange={(v) =>
                      setObjectiveForm({ ...objectiveForm, trimestre: v })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Trimestre</SelectItem>
                      <SelectItem value="2">2º Trimestre</SelectItem>
                      <SelectItem value="3">3º Trimestre</SelectItem>
                      <SelectItem value="4">4º Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ano</Label>
                  <Input
                    type="number"
                    value={objectiveForm.year}
                    onChange={(e) =>
                      setObjectiveForm({ ...objectiveForm, year: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpenObjective(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateObjective} disabled={!objectiveForm.name}>
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs de trimestres */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        <Tabs defaultValue={currentTrimestre} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              {allPeriods.map((period) => {
                const value = `${new Date().getFullYear()}-${period}`;
                return (
                  <TabsTrigger key={period} value={value}>
                    {period}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {allPeriods.map((period) => {
            const value = `${new Date().getFullYear()}-${period}`;
            const objectivesForPeriod = grouped[value] || [];

            return (
              <TabsContent key={period} value={value} className="space-y-6">
                {objectivesForPeriod.length > 0 ? (
                  objectivesForPeriod.map((o) => (
                    <Card key={o.id} className="border-2">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{o.name}</CardTitle>
                            {o.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {o.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedObjective(o.id);
                                setOpenKR(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Adicionar KR
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteObjective(o.id)}
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {keyResults[o.id]?.length ? (
                          keyResults[o.id].map((kr) => (
                            <div key={kr.id} className="space-y-4">
                              {/* KR Card */}
                              <Card className="bg-muted/30">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    <CircularProgress
                                      value={getProgress(kr.current_value, kr.target_value)}
                                      label="Progresso"
                                    />
                                    <div className="flex-1 space-y-2">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="font-semibold text-base">{kr.name}</h4>
                                          {kr.description && (
                                            <p className="text-sm text-muted-foreground">
                                              {kr.description}
                                            </p>
                                          )}
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => deleteKeyResult(kr.id)}
                                        >
                                          ✕
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="text-muted-foreground">Atual:</span>
                                          <Input
                                            type="number"
                                            className="w-20 h-8"
                                            value={kr.current_value}
                                            onChange={(e) => handleUpdateProgress(kr.id, e.target.value)}
                                          />
                                          <span>{kr.unit || '%'}</span>
                                        </div>
                                        <div className="text-muted-foreground">
                                          Meta: <span className="font-medium text-foreground">{kr.target_value} {kr.unit || '%'}</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setSelectedKR(kr.id);
                                            setOpenAddProject(true);
                                          }}
                                        >
                                          <Plus className="w-3 h-3 mr-1" />
                                          Adicionar Projeto
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Projects List */}
                              {kr.project_ids && kr.project_ids.length > 0 && (
                                <div className="ml-8 space-y-2">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Projetos Relacionados
                                  </p>
                                  <div className="space-y-2">
                                    {kr.project_ids.map((projectId) => {
                                      const project = projects.find(p => p.id === projectId);
                                      if (!project) return null;
                                      
                                      return (
                                        <Card key={projectId} className="border">
                                          <CardContent className="p-3">
                                            <div className="flex items-center gap-4">
                                              <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    {project.name}
                                                  </p>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                  {project.owner || "Não atribuído"}
                                                </div>
                                                <div className="text-sm text-muted-foreground capitalize">
                                                  {project.status}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Progress
                                                    value={getProjectProgress(projectId)}
                                                    className="flex-1"
                                                  />
                                                  <span className="text-xs text-muted-foreground w-12 text-right">
                                                    {project.current_value}/{project.target_value}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground py-8">
                            Nenhum resultado-chave criado ainda.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-center text-muted-foreground">
                        Nenhum objetivo criado para este trimestre.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Diálogo de Key Result */}
      <Dialog open={openKR} onOpenChange={setOpenKR}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Resultado-Chave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome do KR</Label>
              <Input
                placeholder="Ex: Aumentar vendas em 50%"
                value={keyResultForm.name}
                onChange={(e) =>
                  setKeyResultForm({ ...keyResultForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descreva o resultado esperado"
                value={keyResultForm.description}
                onChange={(e) =>
                  setKeyResultForm({ ...keyResultForm, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Meta</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={keyResultForm.target_value}
                  onChange={(e) =>
                    setKeyResultForm({
                      ...keyResultForm,
                      target_value: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Atual</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={keyResultForm.current_value}
                  onChange={(e) =>
                    setKeyResultForm({
                      ...keyResultForm,
                      current_value: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Unidade</Label>
                <Input
                  placeholder="%, R$, unidades"
                  value={keyResultForm.unit}
                  onChange={(e) =>
                    setKeyResultForm({
                      ...keyResultForm,
                      unit: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Projetos Relacionados (opcional)</Label>
              <Select
                onValueChange={(value) => {
                  if (value === "none") return;
                  if (!keyResultForm.project_ids.includes(value)) {
                    setKeyResultForm({
                      ...keyResultForm,
                      project_ids: [...keyResultForm.project_ids, value],
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Adicionar projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem projeto</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {keyResultForm.project_ids.length > 0 && (
                <div className="mt-2 space-y-1">
                  {keyResultForm.project_ids.map((id) => (
                    <div key={id} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                      <span>{getProjectName(id)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          setKeyResultForm({
                            ...keyResultForm,
                            project_ids: keyResultForm.project_ids.filter((pid) => pid !== id),
                          })
                        }
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenKR(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateKeyResult} disabled={!keyResultForm.name}>
              Criar KR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Adicionar Projetos ao KR */}
      <Dialog open={openAddProject} onOpenChange={setOpenAddProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Projetos ao KR</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecionar Projetos</Label>
              <Select
                onValueChange={(value) => {
                  if (value === "none") return;
                  if (!addProjectForm.project_ids.includes(value)) {
                    setAddProjectForm({
                      project_ids: [...addProjectForm.project_ids, value],
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione</SelectItem>
                  {selectedKR && getAvailableProjects(selectedKR).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addProjectForm.project_ids.length > 0 && (
                <div className="mt-2 space-y-1">
                  {addProjectForm.project_ids.map((id) => (
                    <div key={id} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                      <span>{getProjectName(id)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          setAddProjectForm({
                            project_ids: addProjectForm.project_ids.filter((pid) => pid !== id),
                          })
                        }
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setOpenAddProject(false);
              setAddProjectForm({ project_ids: [] });
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddProjects} disabled={addProjectForm.project_ids.length === 0}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
