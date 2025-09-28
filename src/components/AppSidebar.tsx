import { useState } from "react";
import {
  ChevronDown,
  Brain,
  Activity,
  Heart,
  FileText,
  Medal,
  DollarSign,
  Gauge,
  CheckCircle,
  StickyNote,
  Menu
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
      { title: "Movimentações", url: "/mente/movimentacoes", icon: DollarSign },
      { title: "DRE", url: "/mente/dre", icon: FileText },
    ],
  },
  {
    title: "Corpo", 
    icon: Activity,
    mainUrl: "/corpo",
    children: [
      { title: "Indicadores", url: "/corpo/indicadores", icon: Gauge },
      { title: "Realizações", url: "/corpo/projetos", icon: Medal },
    ],
  },
  {
    title: "Alma",
    icon: Heart,
    mainUrl: "/alma",
    children: [
      { title: "Notas", url: "/alma/app", icon: StickyNote },
      { title: "Tarefas", url: "/alma/tarefas", icon: CheckCircle },
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

  const toggleSection = (title: string) => {
    setOpenSections(prev => {
      const updated = { ...prev, [title]: !prev[title] };
      localStorage.setItem("sidebar-openSections", JSON.stringify(updated));
      return updated;
    });
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
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src={LogoClaro}
              alt="Logo da Empresa"
              className="w-10 h-10 object-contain"
            />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-semibold text-lg text-foreground">Empresa de corpo</h1>
              <p className="text-muted-foreground text-sm">mente e alma</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.title} className="mb-2">
            <div className="flex">
              <NavLink
                to={item.mainUrl}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 p-3 text-left hover:bg-accent rounded-lg flex-1",
                    isActive ? "bg-primary/10 text-primary" : ""
                  )
                }
              >
                <item.icon className="h-5 w-5 text-primary" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </NavLink>
              {!collapsed && (
                <button
                  onClick={() => toggleSection(item.title)}
                  className="p-3 hover:bg-accent rounded-lg ml-1"
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openSections[item.title] ? "rotate-180" : ""
                    )}
                  />
                </button>
              )}
            </div>
            {!collapsed && openSections[item.title] && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.url}
                    to={child.url}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
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
      <div className="p-4 border-t border-border">
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
