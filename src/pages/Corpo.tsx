import { useState, useEffect } from "react";
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
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const colaboradores = [
  { nome: "João Silva", produtividade: 89, horas: "5h 35min", color: "success" },
  { nome: "Maria Santos", produtividade: 78, horas: "5h 35min", color: "warning" },
  { nome: "Pedro Costa", produtividade: 46, horas: "5h 35min", color: "info" },
  { nome: "Ana Lima", produtividade: 45, horas: "5h 35min", color: "info" },
  { nome: "Carlos Rocha", produtividade: 46, horas: "5h 35min", color: "info" },
  { nome: "Lucas Alves", produtividade: 46, horas: "5h 35min", color: "info" },
];

// Circular Progress Component
const CircularProgress = ({ value, color }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const colorMap = {
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  return (
    <svg className="w-12 h-12" viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="4"
      />
      <circle
        cx="25"
        cy="25"
        r={radius}
        fill="none"
        stroke={colorMap[color] || "#3b82f6"}
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 25 25)"
      />
      <text x="25" y="25" textAnchor="middle" dy="0.3em" className="text-xs">
        {Math.round(value)}%
      </text>
    </svg>
  );
};

export default function Corpo() {
  const { empresaId } = useParams();
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
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [collapsedObjectives, setCollapsedObjectives] = useState({});

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
    project_ids: [],
    target_value: "",
    current_value: "0",
  });

  // Initialize collapsed state for all objectives
  useEffect(() => {
    const initialCollapsedState = objectives.reduce((acc, o) => ({
      ...acc,
      [o.id]: true // true means collapsed by default
    }), {});
    setCollapsedObjectives(initialCollapsedState);
  }, [objectives]);

  // Toggle collapse state for an objective
  const toggleCollapse = (objectiveId) => {
    setCollapsedObjectives(prev => ({
      ...prev,
      [objectiveId]: !prev[objectiveId]
    }));
  };

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
    });
    setKeyResultForm({
      name: "",
      description: "",
      project_ids: [],
      target_value: "",
      current_value: "0",
    });
    setOpenKR(false);
    setSelectedObjective(null);
  };

  const handleUpdateProgress = async (krId, newValue) => {
    const value = parseFloat(newValue);
    if (!isNaN(value)) await updateKeyResult(krId, { current_value: value });
  };

  const getProgress = (current, target) =>
    !target || target === 0 || !current ? 0 : Math.min((current / target) * 100, 100);

  const getProjectName = (id) =>
    id ? projects.find((p) => p.id === id)?.name || "Projeto não encontrado" : "Sem projeto";

  const getProjectOwner = (id) =>
    id ? projects.find((p) => p.id === id)?.owner || "Não atribuído" : "Não atribuído";

  const getProjectStatus = (id) =>
    id ? projects.find((p) => p.id === id)?.status || "Desconhecido" : "Desconhecido";

  const getProjectProgress = (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project || !project.target_value) return 0;
    return getProgress(project.current_value || 0, project.target_value);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const grouped = objectives.reduce((acc, o) => {
    const key = `${o.year}-T${o.trimestre}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(o);
    return acc;
  }, {});

  const sorted = Object.keys(grouped).sort().reverse();
  const currentTrimestre = `${new Date().getFullYear()}-T${Math.ceil((new Date().getMonth() + 1) / 3)}`;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Corpo</h1>
        <Dialog open={openObjective} onOpenChange={setOpenObjective}>
          <DialogTrigger asChild>
            <Button size="sm">Novo Objetivo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Objetivo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome"
                value={objectiveForm.name}
                onChange={(e) =>
                  setObjectiveForm({ ...objectiveForm, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Descrição"
                value={objectiveForm.description}
                onChange={(e) =>
                  setObjectiveForm({ ...objectiveForm, description: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={objectiveForm.trimestre}
                  onValueChange={(v) =>
                    setObjectiveForm({ ...objectiveForm, trimestre: v })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Trimestre" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Trimestre</SelectItem>
                    <SelectItem value="2">2º Trimestre</SelectItem>
                    <SelectItem value="3">3º Trimestre</SelectItem>
                    <SelectItem value="4">4º Trimestre</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Ano"
                  value={objectiveForm.year}
                  onChange={(e) =>
                    setObjectiveForm({ ...objectiveForm, year: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpenObjective(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateObjective} disabled={!objectiveForm.name}>
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas principais */}
{/*      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtividade</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <CircularProgress value={colaboradores[0].produtividade} color={colaboradores[0].color} />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Colaborador</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center p-4 gap-2">
            <Avatar className="w-16 h-16">
              <AvatarFallback>{getInitials(colaboradores[0].nome)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{colaboradores[0].nome}</span>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full border border-gray-300 rounded-lg hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Horas Trabalhadas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center">
            <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>
              {colaboradores[0].horas}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de trimestres */}
      <Card className="border-muted">
        <CardContent className="p-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Carregando...</p>
          ) : (
            <Tabs defaultValue={currentTrimestre} className="w-full">
              <CardHeader>
                <div className="flex justify-center">
                  <TabsList className="flex gap-4">
                    {allPeriods.map((period) => {
                      const value = `${new Date().getFullYear()}-${period}`;
                      return (
                        <TabsTrigger
                          key={period}
                          value={value}
                          className={`w-32 text-center px-4 py-2 rounded-md ${
                            value === currentTrimestre
                              ? "bg-primary text-primary-foreground"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {period}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>
              </CardHeader>

              {allPeriods.map((period) => {
                const value = `${new Date().getFullYear()}-${period}`;
                const objectivesForPeriod = grouped[value] || [];

                return (
                  <TabsContent key={period} value={value}>
                    {objectivesForPeriod.length > 0 ? (
                      objectivesForPeriod.map((o) => (
                        <Card key={o.id} className="border-muted p-4 mb-4 w-[130vh] mx-auto">
                          <CardHeader className="p-0 mb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base font-medium">{o.name}</CardTitle>
                              <div className="flex gap-2 items-center">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => toggleCollapse(o.id)}
                                >
                                  {collapsedObjectives[o.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  setSelectedObjective(o.id);
                                  setOpenKR(true);
                                }}>+ KR</Button>
                                <Button size="sm" variant="ghost" onClick={() => deleteObjective(o.id)}>✕</Button>
                              </div>
                            </div>
                          </CardHeader>
                          {o.description && collapsedObjectives[o.id] && (
                            <p className="text-sm text-muted-foreground mb-3">{o.description}</p>
                          )}
                          {!collapsedObjectives[o.id] && (
                            <CardContent className="space-y-3 p-0">
                              {keyResults[o.id]?.length ? (
                                keyResults[o.id].map((kr) => (
                                  <div key={kr.id} className="space-y-2 border-t pt-3">
                                    <div className="flex items-start gap-4">
                                      <CircularProgress value={getProgress(kr.current_value, kr.target_value)} color="info" />
                                      <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="text-sm font-medium">{kr.name}</p>
                                            {kr.description && (
                                              <p className="text-sm text-muted-foreground">{kr.description}</p>
                                            )}
                                          </div>
                                          <div className="flex gap-2">
                                            <Input
                                              type="number"
                                              className="w-20"
                                              defaultValue={kr.current_value}
                                              onBlur={(e) => handleUpdateProgress(kr.id, e.target.value)}
                                              placeholder="Atualizar"
                                            />
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => deleteKeyResult(kr.id)}
                                            >
                                              ✕
                                            </Button>
                                          </div>
                                        </div>
                                        {kr.project_ids?.length > 0 && (
                                          <div className="mt-3">
                                            <table className="w-full">
                                              <tbody>
                                                {kr.project_ids.map((projectId) => (
                                                  <tr key={projectId}>
                                                    <td className="py-1 text-xs">{getProjectName(projectId)}</td>
                                                    <td className="py-1 text-xs text-muted-foreground">
                                                      {getProjectOwner(projectId)}
                                                    </td>
                                                    <td className="py-1 text-xs text-muted-foreground">
                                                      {getProjectStatus(projectId)}
                                                    </td>
                                                    <td className="py-1 w-1/3">
                                                      <Progress value={getProjectProgress(projectId)} className="h-1" />
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">Nenhum resultado-chave.</p>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-10">
                        Nenhum objetivo criado ainda.
                      </p>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Key Result */}
      <Dialog open={openKR} onOpenChange={setOpenKR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Resultado-Chave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome"
              value={keyResultForm.name}
              onChange={(e) =>
                setKeyResultForm({ ...keyResultForm, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Descrição"
              value={keyResultForm.description}
              onChange={(e) =>
                setKeyResultForm({ ...keyResultForm, description: e.target.value })
              }
            />
            <div>
              <Label>Projetos</Label>
              <Select
                onValueChange={(value) => {
                  if (value === "none") return;
                  setKeyResultForm({
                    ...keyResultForm,
                    project_ids: [...keyResultForm.project_ids, value],
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar projetos" />
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
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Projetos selecionados:</p>
                  <ul className="list-disc pl-5">
                    {keyResultForm.project_ids.map((id) => (
                      <li key={id} className="text-sm flex justify-between items-center">
                        {getProjectName(id)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setKeyResultForm({
                              ...keyResultForm,
                              project_ids: keyResultForm.project_ids.filter((pid) => pid !== id),
                            })
                          }
                        >
                          ✕
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Meta"
                value={keyResultForm.target_value}
                onChange={(e) =>
                  setKeyResultForm({
                    ...keyResultForm,
                    target_value: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Atual"
                value={keyResultForm.current_value}
                onChange={(e) =>
                  setKeyResultForm({
                    ...keyResultForm,
                    current_value: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenKR(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateKeyResult} disabled={!keyResultForm.name}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}