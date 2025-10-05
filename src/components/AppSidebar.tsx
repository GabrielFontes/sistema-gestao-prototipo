import { useState } from "react";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Brain,
  Activity,
  Layers,
  Heart,
  ArrowUpZA,
  Filter,
  Atom,
  BarChart,
  ListFilter,
  Footprints,
  FileText,
  ListChecks,
  Repeat,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { useAuth } from "@/hooks/useAuth";
import { EmpresaSelector } from "./EmpresaSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      { title: "Fluxos", url: "fluxos", icon: Repeat },
      { title: "Indicadores", url: "indicadores", icon: TrendingUp },
    ],
  },
  {
    title: "Alma",
    icon: Heart,
    mainUrl: "alma",
    children: [
      { title: "Iniciativas", url: "iniciativas", icon: ListFilter },
      { title: "Tarefas", url: "tarefas", icon: CheckCircle },
    ],
  },
];

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  const location = useLocation();
  const { empresaId } = useParams();
  const navigate = useNavigate();
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

  const { currentEmpresa } = useEmpresa();
  const { user, signOut } = useAuth();

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

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
              src={currentEmpresa.logo}
              alt="Logo da Empresa"
              className="object-contain w-full h-full"
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
            <div
              key={item.title}
              className={cn("mb-2", index > 0 ? "mt-4" : "")}
            >
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center p-2 rounded-lg cursor-pointer transition-colors",
                        item.mainUrl === "iniciativas"
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
                      item.mainUrl === "iniciativas"
                        ? "bg-primary/20 text-foreground"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 text-primary transition-all duration-300" />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              )}

              {/* Só renderiza filhos se existirem */}
              {!collapsed && item.children.length > 0 && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.children.map((child) => (
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
                      {child.title}
                    </NavLink>
                  ))}
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
