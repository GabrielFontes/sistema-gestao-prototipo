import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
//import { TasksOverviewButton } from '@/components/TasksOverviewButton';
//import { QuickActionButton } from '@/components/QuickActionButton';
import { useState } from 'react';

export default function EmpresaLayout() {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebar-collapsed') === 'true'
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: collapsed ? '4rem' : '20rem' }}
      >
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
{/*      <TasksOverviewButton />
      <QuickActionButton />
*/}
    </div>
  );
}