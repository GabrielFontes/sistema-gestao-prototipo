import { useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  Brain,
  Activity,
  Heart,
  Footprints,
  AlertCircle,
  CheckCircle,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { EmpresaSelector } from "./EmpresaSelector";

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
      { title: "DRE", url: "dre", icon: AlertCircle },
      { title: "Movimentações", url: "movimentacoes", icon: CheckCircle },
    ],
  },
  {
    title: "Corpo",
    icon: Activity,
    mainUrl: "corpo",
    children: [
      { title: "Fluxos", url: "fluxos", icon: AlertCircle },
      { title: "Indicadores", url: "indicadores", icon: CheckCircle },
    ],
  },
  {
    title: "Alma",
    icon: Heart,
    mainUrl: "alma",
    children: [
      { title: "Notas", url: "app", icon: AlertCircle },
    ],
  },
  {
    title: "Pernas",
    icon: Footprints,
    mainUrl: "pernas",
    children: [
      { title: "Tarefas", url: "tarefas", icon: CheckCircle },
    ],
  },
];

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  const location = useLocation();
  const { empresaId } = useParams();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("sidebar-openSections");
    return saved ? JSON.parse(saved) : { Mente: true, Corpo: false, Alma: false };
  });

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  const { currentEmpresa, isLoading } = useEmpresa();

  return (
    <div className={cn(
      "transition-all duration-300 bg-card border-r border-border h-screen flex flex-col fixed top-0 left-0 z-50",
      collapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center transition-all duration-300",
          collapsed ? "w-8 h-8" : "w-10 h-10"
        )}>
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
            className={cn(
              "mb-2",
              index > 0 ? "mt-4" : ""
            )}
          >
            <div className="flex">
              <NavLink
                to={`/empresa/${empresaId}/${item.mainUrl}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 p-2 text-left hover:bg-accent rounded-lg flex-1 text-sm",
                    isActive ? "bg-primary/10 text-primary" : ""
                  )
                }
              >
                <item.icon className="h-5 w-5 text-primary transition-all duration-300" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </NavLink>
            </div>
            {!collapsed && (
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

      {/* Toggle Button */}
      <div className="p-3 border-t border-border">
        <button onClick={toggleCollapsed} className="w-full flex items-center justify-center p-2 hover:bg-accent rounded-lg">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
  