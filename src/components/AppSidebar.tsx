import { useState } from "react";
import { ChevronDown, Brain, Activity, Heart, FileText, DollarSign, Users, BarChart3, Kanban, StickyNote, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Mente",
    icon: Brain,
    children: [
      { title: "Movimentações", url: "/mente/movimentacoes", icon: DollarSign },
      { title: "DRE", url: "/mente/dre", icon: FileText },
    ],
  },
  {
    title: "Corpo",
    icon: Activity,
    children: [
      { title: "Planilha de Indicadores", url: "/corpo/indicadores", icon: BarChart3 },
      { title: "Projetos | Operação", url: "/corpo/projetos", icon: Kanban },
    ],
  },
  {
    title: "Alma",
    icon: Heart,
    children: [
      { title: "App", url: "/alma/app", icon: StickyNote },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Mente: true,
    Corpo: true,
    Alma: true,
  });
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className={cn("transition-all duration-300 bg-card border-r border-border h-screen flex flex-col", collapsed ? "w-16" : "w-80")}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
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
      <div className="flex-1 p-4">
        {menuItems.map((item) => (
          <div key={item.title} className="mb-2">
            <button
              onClick={() => toggleSection(item.title)}
              className="flex w-full items-center justify-between p-3 text-left hover:bg-accent rounded-lg"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-primary" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </div>
              {!collapsed && (
                <ChevronDown 
                  className={cn("h-4 w-4 transition-transform", openSections[item.title] ? "rotate-180" : "")} 
                />
              )}
            </button>
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
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-accent rounded-lg"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}