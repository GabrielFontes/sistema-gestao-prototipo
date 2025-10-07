import { useState } from "react";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { AwardWithNumber } from "@/components/icons/AwardWithNumber";
import { MedalWithNumber } from "@/components/icons/MedalWithNumber";
import {
  Brain,
  Activity,
  KanbanIcon,
  AlignStartHorizontal,
  Columns,
  Columns2Icon,
  FolderTree,
  Medal,
  Award,
  Heart,
  BarChart,
  ListChecks,
  Repeat2,
  TrendingUp,
  StickyNote,
  Target,
  ListFilter,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  Kanban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { useAuth } from "@/hooks/useAuth";
import { EmpresaSelector } from "./EmpresaSelector";
import { useAlmaStats } from "@/hooks/useAlmaStats";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  {
    title: "Mente",
    icon: Brain,
    mainUrl: "mente",
    children: [
      { title: "DRE", url: "dre", icon: BarChart },
      { title: "Movimentações", url: "movimentacoes", icon: ListChecks },
    ],
  },
  {
    title: "Corpo",
    icon: Activity,
    mainUrl: "corpo",
    children: [
      { title: "Organograma", url: "organograma", icon: FolderTree },
      { title: "Fluxos", url: "fluxos", icon: Repeat2 },
      { title: "Indicadores", url: "indicadores", icon: TrendingUp },
    ],
  },
  {
    title: "Alma",
    icon: Heart,
    mainUrl: "alma",
    children: [
      { title: "Notas", url: "notas", icon: StickyNote },
      {
        title: "🥇Processos",
        url: "processos",
//        icon: () => <AwardWithNumber number={1} color="gold" />,
        icon: AlignStartHorizontal,
      },
      {
        title: "🥈Projetos",
        url: "projetos",
//        icon: () => <AwardWithNumber number={2} color="silver" />,
        icon: AlignStartHorizontal,
      },
      {
        title: "🥉Tarefas",
        url: "tarefas",
//        icon: () => <AwardWithNumber number={3} color="#cd7f32" />,
        icon: AlignStartHorizontal,
      },
    ],
  },
];


export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  const location = useLocation();
  const { empresaId } = useParams();
  const navigate = useNavigate();
  const { currentEmpresa, isLoading } = useEmpresa();
  const { user } = useAuth();
  const almaStats = useAlmaStats(empresaId || null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("sidebar-openSections");
    return saved ? JSON.parse(saved) : { Mente: true, Corpo: false, Alma: false };
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-card border-r border-border flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!currentEmpresa) {
    return (
      <div className="h-screen bg-card border-r border-border flex items-center justify-center">
        <div className="text-muted-foreground">Nenhuma empresa selecionada</div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "transition-all duration-300 bg-card border-r border-border h-screen flex flex-col fixed top-0 left-0 z-50",
          collapsed ? "w-16" : "w-80"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
              collapsed ? "w-8 h-8" : "w-10 h-10"
            )}
          >
            <img
              src={currentEmpresa.logo || "/images/Sem_Imagem.png"}
              alt="Logo da Empresa"
              className="object-cover w-full h-full rounded-full aspect-square border-4"
              style={{
                borderColor: currentEmpresa.primaryColor || "#ccc",
              }}
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 flex flex-col">
              <h1 className="font-semibold text-base text-foreground truncate">
                {currentEmpresa.name}
              </h1>
              <p className="text-muted-foreground text-xs truncate">
                {currentEmpresa.subtitle}
              </p>
            </div>
          )}
          {!collapsed && <EmpresaSelector />}
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={item.title} className={cn("mb-2", index > 0 ? "mt-4" : "")}>
              {/* Item principal */}
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center p-2 rounded-lg cursor-pointer transition-colors",
                        item.mainUrl === "processos"
                          ? "bg-primary/20"
                          : "hover:bg-accent"
                      )}
                      onClick={() =>
                        navigate(`/empresa/${empresaId}/${item.mainUrl}`)
                      }
                    >
                      <item.icon className="h-5 w-5 text-primary transition-all duration-300" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-primary text-primary-foreground"
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <NavLink
                  to={`/empresa/${empresaId}/${item.mainUrl}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 p-2 text-left rounded-lg flex-1 text-sm transition-colors",
                      item.mainUrl === "processos"
                        ? "bg-primary/20 text-foreground"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 text-primary transition-all duration-300" />
                  <span className="font-medium">{item.title}</span>
                  {!collapsed && item.title === "Corpo" && (
                    <div
                      className="flex items-center justify-center w-4 h-4 ml-auto rounded-full text-[10px] font-semibold text-white border border-gray-300"
                      style={{
                        backgroundColor: currentEmpresa?.primaryColor
                          ? `hsl(${currentEmpresa.primaryColor})`
                          : "#000",
                      }}
                    >
                      {almaStats.activeProcesses}
                    </div>
                  )}
                </NavLink>
              )}

              {/* Filhos */}
              {!collapsed && item.children.length > 0 && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const getStatCount = () => {
                      if (item.title !== "Alma") return null;

                      switch (child.url) {
                        case "tarefas":
                          return almaStats.sprintTasks;
                        case "processos":
                          return almaStats.activeProcesses;
                        case "projetos":
                          return almaStats.activeProjects;
                        case "notas":
                          return null;
                        default:
                          return null;
                      }
                    };

                    const statCount = getStatCount();

                    return (
                      <NavLink
                        key={child.url}
                        to={`/empresa/${empresaId}/${child.url}`}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 p-1 rounded-lg text-xs transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )
                        }
                      >
                        <child.icon className="h-4 w-4" />
                        <span className="flex-1">{child.title}</span>
                        {item.title === "Alma" && statCount !== null && (
                          <div
                            className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold text-white border border-gray-300"
                            style={{
                              backgroundColor: currentEmpresa?.primaryColor
                                ? `hsl(${currentEmpresa.primaryColor})`
                                : "#000",
                            }}
                          >
                            {statCount}
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <button
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}