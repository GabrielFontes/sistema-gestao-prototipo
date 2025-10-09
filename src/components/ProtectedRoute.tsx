import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles: AppRole[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles,
  fallback 
}: ProtectedRouteProps) {
  const { currentEmpresa } = useEmpresa();
  const { hasAnyRole, isLoading } = useUserRoles(currentEmpresa?.id || null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAnyRole(...requiredRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
        <div className="rounded-full bg-muted p-6">
          <Lock className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Acesso Restrito</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Você não tem permissão para acessar esta página. Entre em contato com o administrador da empresa para solicitar acesso.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
