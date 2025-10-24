import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { useEmpresa } from '@/contexts/EmpresaContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [],
  fallback 
}: ProtectedRouteProps) {
  const { currentEmpresa } = useEmpresa();

  if (!currentEmpresa) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Acesso Restrito
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Selecione uma empresa para continuar
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
