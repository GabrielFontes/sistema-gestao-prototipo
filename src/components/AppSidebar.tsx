import { useState } from "react";
import {
  Brain,
  Activity,
  Heart,
  FileText,
  Layers,
  HelpCircle,
  AlertCircle,
  Medal,
  DollarSign,
  Clipboard,
  Gauge,
  CheckCircle,
  StickyNote,
  Menu,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoClaro from "@/images/Logo_Claro.png";

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  {
    title: "Mente",
    icon: Brain,
    mainUrl: "/mente",
    children: [
      { title: "DRE", url: "/mente/dre", icon: HelpCircle },
      { title: "Movimentações", url: "/mente/movimentacoes", icon: AlertCircle },
    ],
  },
  {
    title: "Corpo", 
    icon: Activity,
    mainUrl: "/corpo",
    children: [
      { title: "Iniciativas", url: "/corpo/projetos", icon: HelpCircle },
      { title: "Indicadores", url: "/corpo/indicadores", icon: AlertCircle },
    ],
  },
  {
    title: "Alma",
    icon: Heart,
    mainUrl: "/alma",
    children: [
      { title: "Notas", url: "/alma/app", icon: HelpCircle },
      { title: "Tarefas", url: "/alma/tarefas", icon: AlertCircle },
    ],
  },
];

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  const location = useLocation();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("sidebar-openSections");
    return saved ? JSON.parse(saved) : { Mente: true, Corpo: false, Alma: false };
  });

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (currentPath === "/" && path === "/mente") return true;
    return currentPath === path;
  };

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  return (
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
            src={LogoClaro}
            alt="Logo da Empresa"
            className="object-contain w-full h-full"
          />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-semibold text-base text-foreground">Empresa de corpo</h1>
            <p className="text-muted-foreground text-xs">mente e alma</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 overflow-y-auto">
      {menuItems.map((item, index) => (
  <div
    key={item.title}
    className={cn(
      "mb-2",
      index > 0 ? "mt-4" : "" // adiciona margem extra aos menus principais depois do primeiro
    )}
  >
            <div className="flex">
              <NavLink
                to={item.mainUrl}
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
                    to={child.url}
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
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center p-2 hover:bg-accent rounded-lg"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
