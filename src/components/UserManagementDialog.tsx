import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";
import { useEmpresa } from "@/contexts/EmpresaContext";
import { useUserRoles, AppRole } from "@/hooks/useUserRoles";

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmpresaMember {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  role: string;
}

interface UserEmpresa {
  id: string;
  name: string;
  isOwnerOrAdmin: boolean;
}

export function UserManagementDialog({ open, onOpenChange }: UserManagementDialogProps) {
  const { empresas } = useEmpresa();
  const [email, setEmail] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("membro");
  const [members, setMembers] = useState<EmpresaMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableEmpresas, setAvailableEmpresas] = useState<UserEmpresa[]>([]);

  useEffect(() => {
    if (open) {
      loadAvailableEmpresas();
      if (selectedEmpresa) {
        loadMembers();
      }
    }
  }, [open, selectedEmpresa, empresas]);

  const loadAvailableEmpresas = async () => {
    try {
      const empresasWithPermissions = await Promise.all(
        empresas.map(async (empresa) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('empresa_id', empresa.id)
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

          const isOwnerOrAdmin = roles?.some(r => r.role === 'owner' || r.role === 'admin') || false;
          
          return {
            id: empresa.id,
            name: empresa.name,
            isOwnerOrAdmin
          };
        })
      );

      setAvailableEmpresas(empresasWithPermissions.filter(e => e.isOwnerOrAdmin));
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  const loadMembers = async () => {
    if (!selectedEmpresa) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_empresa_members_with_details', {
        p_empresa_id: selectedEmpresa
      });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar membros:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!email || !selectedEmpresa || !selectedRole) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Buscar user_id pelo email usando a função RPC
      const { data: userId, error: userError } = await supabase
        .rpc('get_user_id_by_email', { p_email: email });

      if (userError || !userId) {
        toast.error('Usuário não encontrado. Verifique o email.');
        setLoading(false);
        return;
      }

      // Adicionar como membro da empresa
      const { error: memberError } = await supabase
        .from('empresa_members')
        .insert({
          empresa_id: selectedEmpresa,
          user_id: userId,
          role: 'member'
        });

      if (memberError) {
        if (memberError.code === '23505') {
          toast.error('Usuário já é membro desta empresa');
        } else {
          throw memberError;
        }
        setLoading(false);
        return;
      }

      // Adicionar role específica
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          empresa_id: selectedEmpresa,
          role: selectedRole
        });

      if (roleError) {
        if (roleError.code !== '23505') {
          throw roleError;
        }
      }

      toast.success('Usuário adicionado com sucesso');
      setEmail("");
      setSelectedRole("membro");
      loadMembers();
    } catch (error: any) {
      console.error('Erro ao adicionar usuário:', error);
      toast.error(error.message || 'Erro ao adicionar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('empresa_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Membro removido com sucesso');
      loadMembers();
    } catch (error: any) {
      console.error('Erro ao remover membro:', error);
      toast.error('Erro ao remover membro');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const roleMap: Record<string, string> = {
      owner: "bg-purple-500",
      admin: "bg-blue-500",
      gerente_financeiro: "bg-green-500",
      gerente_operacao: "bg-yellow-500",
      gerente_projetos: "bg-orange-500",
      membro: "bg-gray-500"
    };
    return roleMap[role] || "bg-gray-500";
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      owner: "Proprietário",
      admin: "Administrador",
      gerente_financeiro: "Gerente Financeiro",
      gerente_operacao: "Gerente de Operação",
      gerente_projetos: "Gerente de Projetos",
      membro: "Membro"
    };
    return roleMap[role] || role;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Usuários</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção de Empresa */}
          <div className="space-y-2">
            <Label>Empresa</Label>
            <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {availableEmpresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmpresa && (
            <>
              {/* Adicionar Usuário */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Adicionar Novo Usuário
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="gerente_financeiro">Gerente Financeiro</SelectItem>
                        <SelectItem value="gerente_operacao">Gerente de Operação</SelectItem>
                        <SelectItem value="gerente_projetos">Gerente de Projetos</SelectItem>
                        <SelectItem value="membro">Membro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={handleAddUser} disabled={loading} className="w-full">
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de Membros */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : members.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Nenhum membro encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.display_name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(member.role)}>
                              {getRoleLabel(member.role)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {member.role !== 'owner' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveMember(member.id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
