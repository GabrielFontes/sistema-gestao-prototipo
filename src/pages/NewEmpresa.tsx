import { useAuth } from '@/hooks/useAuth';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

function NewEmpresa() {
  const { user } = useAuth();
  const { setEmpresa } = useEmpresa();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [logo, setLogo] = useState('');
  const [primary_Color, setPrimaryColor] = useState('hsl(220, 60%, 50%)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      console.log('Criando empresa com dados:', { name, subtitle, logo, primary_Color });
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .insert({
          name,
          subtitle,
          logo: logo || '/images/Logo_Claro.png',
          primary_color: primary_Color,
        })
        .select()
        .single();

      if (empresaError) {
        console.error('Erro ao criar empresa:', empresaError);
        throw empresaError;
      }

      console.log('Empresa criado:', empresa);

      const { error: memberError } = await supabase
        .from('empresa_members')
        .insert({
          empresa_id: empresa.id,
          user_id: user.id,
          role: 'member',
        });

      if (memberError) {
        console.error('Erro ao criar associação:', memberError);
        throw memberError;
      }

      console.log('Associação criada para user_id:', user.id);
      setEmpresa(empresa.id);
      toast({
        title: 'Sucesso',
        description: 'Empresa criado com sucesso!',
      });
      navigate(`/empresa/${empresa.id}`);
    } catch (error: any) {
      console.error('Erro geral ao criar empresa:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o empresa: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Criar Novo Empresa</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Empresa
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
              Subtítulo (opcional)
            </label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              URL do Logo (opcional)
            </label>
            <Input
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="Deixe vazio para usar o padrão"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="primary_Color" className="block text-sm font-medium text-gray-700">
              Cor Primária (HSL)
            </label>
            <Input
              id="primary_Color"
              value={primary_Color}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="Ex: hsl(220, 60%, 50%)"
              className="mt-1"
            />
          </div>
          <Button type="submit">Criar Empresa</Button>
        </form>
      </div>
    </div>
  );
}

export default NewEmpresa;