import { useState, useEffect } from 'react';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Building2, Link2, Users, Trash2, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface EmpresaSettingsDialogProps {
  trigger?: React.ReactNode;
}

interface Member {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
}

export function EmpresaSettingsDialog({ trigger }: EmpresaSettingsDialogProps) {
  const { currentEmpresa } = useEmpresa();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('geral');
  const [empresaName, setEmpresaName] = useState('');
  const [empresaSubtitle, setEmpresaSubtitle] = useState('');
  const [links, setLinks] = useState({
    dre: '',
    movimentacoes: '',
    fluxos: '',
    organograma: '',
    corpo: '',
    notas: '',
    projetos: '',
    operacao: '',
    sprint: '',
  });
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (open && currentEmpresa) {
      loadSettings();
    }
  }, [open, currentEmpresa]);

  const hslToHex = (hsl: string) => {
    const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
    if (!match) return '#3b82f6';
    
    const h = parseInt(match[1]);
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const loadSettings = async () => {
    if (!currentEmpresa) return;

    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('name, subtitle, primary_color, dre_link, movimentacoes_link, fluxos_link, organograma_link, corpo_link, notas_link, projetos_link, operacao_link, sprint_link')
        .eq('id', currentEmpresa.id)
        .single();

      if (error) throw error;

      if (data) {
        setEmpresaName(data.name || '');
        setEmpresaSubtitle(data.subtitle || '');
        setPrimaryColor(hslToHex(data.primary_color || '0 0% 50%'));
        setLinks({
          dre: data.dre_link || '',
          movimentacoes: data.movimentacoes_link || '',
          fluxos: data.fluxos_link || '',
          organograma: data.organograma_link || '',
          corpo: data.corpo_link || '',
          notas: data.notas_link || '',
          projetos: data.projetos_link || '',
          operacao: data.operacao_link || '',
          sprint: data.sprint_link || '',
        });
      }

      // Carregar membros com detalhes
      const { data: membersData, error: membersError } = await supabase
        .rpc('get_empresa_members_with_details', { p_empresa_id: currentEmpresa.id });

      if (membersError) throw membersError;
      setMembers(membersData || []);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Não foi possível carregar as configurações.');
    }
  };

  const handleSubmitGeral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmpresa) return;

    setIsLoading(true);
    try {
      const hslColor = hexToHsl(primaryColor);
      
      const { error } = await supabase
        .from('empresas')
        .update({
          name: empresaName,
          subtitle: empresaSubtitle,
          primary_color: hslColor,
        })
        .eq('id', currentEmpresa.id);

      if (error) throw error;

      document.documentElement.style.setProperty('--primary', hslColor);
      toast.success('Configurações gerais salvas com sucesso!');
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Não foi possível salvar as configurações: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmpresa) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('empresas')
        .update({
          dre_link: links.dre,
          movimentacoes_link: links.movimentacoes,
          fluxos_link: links.fluxos,
          organograma_link: links.organograma,
          corpo_link: links.corpo,
          notas_link: links.notas,
          projetos_link: links.projetos,
          operacao_link: links.operacao,
          sprint_link: links.sprint,
        })
        .eq('id', currentEmpresa.id);

      if (error) throw error;

      toast.success('Links salvos com sucesso!');
      setOpen(false);
    } catch (error: any) {
      console.error('Erro ao salvar links:', error);
      toast.error('Não foi possível salvar os links: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    if (!currentEmpresa) return;

    try {
      const { error } = await supabase
        .from('empresa_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Função do membro atualizada!');
      loadSettings();
    } catch (error: any) {
      console.error('Erro ao atualizar função:', error);
      toast.error('Não foi possível atualizar a função: ' + error.message);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!currentEmpresa) return;

    try {
      const { error } = await supabase
        .from('empresa_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Membro removido da empresa!');
      loadSettings();
    } catch (error: any) {
      console.error('Erro ao remover membro:', error);
      toast.error('Não foi possível remover o membro: ' + error.message);
    }
  };

  const handleDeleteEmpresa = async () => {
    if (!currentEmpresa) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', currentEmpresa.id);

      if (error) throw error;

      toast.success('Empresa excluída com sucesso!');
      setOpen(false);
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao excluir empresa:', error);
      toast.error('Não foi possível excluir a empresa: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentEmpresa) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Configurações da Empresa</DialogTitle>
          <DialogDescription>
            Gerencie as configurações da sua empresa
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-[calc(85vh-120px)]">
          <TabsList className="flex flex-col h-full w-48 justify-start rounded-none border-r bg-transparent p-2">
            <TabsTrigger value="geral" className="w-full justify-start gap-2">
              <Building2 className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="links" className="w-full justify-start gap-2">
              <Link2 className="h-4 w-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="membros" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Membros
            </TabsTrigger>
            <TabsTrigger value="excluir" className="w-full justify-start gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Excluir Empresa
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="geral" className="mt-0">
              <form onSubmit={handleSubmitGeral} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="empresaName">Nome da Empresa</Label>
                    <Input
                      id="empresaName"
                      value={empresaName}
                      onChange={(e) => setEmpresaName(e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresaSubtitle">Subtítulo</Label>
                    <Input
                      id="empresaSubtitle"
                      value={empresaSubtitle}
                      onChange={(e) => setEmpresaSubtitle(e.target.value)}
                      placeholder="Subtítulo da empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="primaryColor"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="links" className="mt-0">
              <form onSubmit={handleSubmitLinks} className="space-y-6">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="dre" className="text-sm">DRE (Google Sheets)</Label>
                    <Input
                      id="dre"
                      value={links.dre}
                      onChange={(e) => setLinks({ ...links, dre: e.target.value })}
                      placeholder="https://docs.google.com/spreadsheets/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="movimentacoes" className="text-sm">Movimentações (Google Sheets)</Label>
                    <Input
                      id="movimentacoes"
                      value={links.movimentacoes}
                      onChange={(e) => setLinks({ ...links, movimentacoes: e.target.value })}
                      placeholder="https://docs.google.com/spreadsheets/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fluxos" className="text-sm">Fluxos (Lucidchart)</Label>
                    <Input
                      id="fluxos"
                      value={links.fluxos}
                      onChange={(e) => setLinks({ ...links, fluxos: e.target.value })}
                      placeholder="https://lucid.app/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="organograma" className="text-sm">Organograma (Lucidchart)</Label>
                    <Input
                      id="organograma"
                      value={links.organograma}
                      onChange={(e) => setLinks({ ...links, organograma: e.target.value })}
                      placeholder="https://lucid.app/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="corpo" className="text-sm">Corpo (Google Drive)</Label>
                    <Input
                      id="corpo"
                      value={links.corpo}
                      onChange={(e) => setLinks({ ...links, corpo: e.target.value })}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="notas" className="text-sm">Notas (AppSheet)</Label>
                    <Input
                      id="notas"
                      value={links.notas}
                      onChange={(e) => setLinks({ ...links, notas: e.target.value })}
                      placeholder="https://appsheet.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="projetos" className="text-sm">Projetos (AppSheet)</Label>
                    <Input
                      id="projetos"
                      value={links.projetos}
                      onChange={(e) => setLinks({ ...links, projetos: e.target.value })}
                      placeholder="https://appsheet.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="operacao" className="text-sm">Operação (AppSheet)</Label>
                    <Input
                      id="operacao"
                      value={links.operacao}
                      onChange={(e) => setLinks({ ...links, operacao: e.target.value })}
                      placeholder="https://appsheet.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="sprint" className="text-sm">Sprint (AppSheet)</Label>
                    <Input
                      id="sprint"
                      value={links.sprint}
                      onChange={(e) => setLinks({ ...links, sprint: e.target.value })}
                      placeholder="https://appsheet.com/..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Links'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="membros" className="mt-0">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Total de membros: {members.length}
                </div>
                <div className="border rounded-lg divide-y">
                  {members.map((member) => (
                    <div key={member.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{member.display_name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleUpdateMemberRole(member.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Membro</SelectItem>
                          </SelectContent>
                        </Select>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <UserX className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover membro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover {member.display_name} da empresa?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveMember(member.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="excluir" className="mt-0">
              <div className="space-y-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <h3 className="font-semibold text-destructive mb-2">Zona de Perigo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A exclusão da empresa é permanente e não pode ser desfeita. Todos os dados, 
                    projetos, tarefas e membros associados serão perdidos.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Empresa Permanentemente
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso irá excluir permanentemente a empresa
                          <span className="font-semibold"> {empresaName}</span> e remover todos os dados
                          associados dos nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteEmpresa}
                          disabled={isLoading}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isLoading ? 'Excluindo...' : 'Sim, excluir empresa'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}