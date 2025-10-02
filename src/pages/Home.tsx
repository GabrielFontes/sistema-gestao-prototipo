// /src/pages/Home.tsx
import { useAuth } from '@/hooks/useAuth';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { CreateEmpresaDialog } from '@/components/CreateEmpresaDialog';
import { EmpresaSettingsDialog } from '@/components/EmpresaSettingsDialog';

function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { empresas, isLoading: empresasLoading, setEmpresa } = useEmpresa();
  const navigate = useNavigate();

  console.log('Usuário logado:', user); // Adicione este log
  console.log('Empresas:', empresas); // Adicione este log

  if (authLoading || empresasLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleEmpresaClick = (empresaId: string) => {
    setEmpresa(empresaId); // Atualiza o empresa no contexto
    navigate(`/empresa/${empresaId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Empresas</h1>
          <div className="flex items-center space-x-4">
            <CreateEmpresaDialog />
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>

        {empresas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma empresa encontrada.</p>
            <CreateEmpresaDialog
              trigger={
                <Button className="mt-4">Criar sua primeira empresa!</Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {empresas.map((empresa) => (
              <EmpresaCard
                key={empresa.id}
                empresa={empresa}
                onClick={() => handleEmpresaClick(empresa.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface EmpresaCardProps {
  empresa: {
    id: string;
    name: string;
    subtitle: string;
    logo: string;
    primaryColor: string;
  };
  onClick: () => void;
}

function EmpresaCard({ empresa, onClick }: EmpresaCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow group relative">
      <div onClick={onClick}>
        <CardHeader>
          <CardTitle className="text-xl">{empresa.name}</CardTitle>
          {empresa.subtitle && <CardDescription>{empresa.subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <img
            src={empresa.logo}
            alt={`${empresa.name} logo`}
            className="w-16 h-16 mb-4 object-contain"
            onError={(e) => {
              e.currentTarget.src = '/src/images/Logo_Claro.png';
            }}
          />
        </CardContent>
      </div>
      <div className="absolute top-2 right-2">
        <EmpresaSettingsDialog
          trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <Settings className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </Card>
  );
}

export default Home;