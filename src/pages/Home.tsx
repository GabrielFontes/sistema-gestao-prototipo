// /src/pages/Home.tsx
import { useAuth } from '@/hooks/useAuth';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { empresas, isLoading: empresasLoading, setEmpresa } = useEmpresa();
  const navigate = useNavigate();
  const { toast } = useToast();

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
          <h1 className="text-3xl font-bold text-gray-900">Meus Empresas</h1>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <Link to="/new-empresa" className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Novo Empresa
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>

        {empresas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum empresa encontrado.</p>
            <Button asChild className="mt-4">
              <Link to="/new-empresa">Crie o primeiro!</Link>
            </Button>
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
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
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
            e.currentTarget.src = '/src/images/Logo_Claro.png'; // Fallback
          }}
        />
        <p className="text-xs text-gray-500">
          Cor primária: <span style={{ color: empresa.primaryColor }}>{empresa.primaryColor}</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default Home;