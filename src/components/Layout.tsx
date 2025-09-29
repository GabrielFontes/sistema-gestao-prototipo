import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { QuickActionButton } from "./QuickActionButton";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300`}
        style={{ marginLeft: collapsed ? "4rem" : "20rem" }}
      >
        <main className="flex-1 p-6">{children}</main>
      </div>

      <QuickActionButton />
    </div>
  );
}
