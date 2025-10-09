import { useState, useEffect } from "react";
import { X, Maximize2, Minimize2, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChat } from "@/hooks/useChat";
import { ChatConversation } from "./ChatConversation";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Empresa {
  id: string;
  name: string;
}

interface EmpresaMember {
  user_id: string;
  email: string;
  display_name: string;
}

export function ChatPanel({ open, onOpenChange }: ChatPanelProps) {
  const { empresaId } = useParams();
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(empresaId || "all");
  const { conversations, loading, currentUserId, createConversation } = useChat(selectedEmpresaId === "all" ? null : selectedEmpresaId);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [empresaMembers, setEmpresaMembers] = useState<EmpresaMember[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    if (empresaId) {
      setSelectedEmpresaId(empresaId);
    }
  }, [empresaId]);

  useEffect(() => {
    if (open) {
      loadEmpresas();
      loadEmpresaMembers();
    }
  }, [open, selectedEmpresaId]);

  const loadEmpresas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberData } = await supabase
        .from('empresa_members')
        .select('empresa_id')
        .eq('user_id', user.id);

      if (!memberData) return;

      const empresaIds = memberData.map(m => m.empresa_id);
      
      const { data: empresasData } = await supabase
        .from('empresas')
        .select('id, name')
        .in('id', empresaIds);

      if (empresasData) {
        setEmpresas(empresasData);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  };

  const loadEmpresaMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let empresaIds: string[] = [];

      if (selectedEmpresaId === "all") {
        // Get all user's empresas
        const { data: memberData } = await supabase
          .from('empresa_members')
          .select('empresa_id')
          .eq('user_id', user.id);

        if (!memberData || memberData.length === 0) return;
        empresaIds = memberData.map(m => m.empresa_id);
      } else {
        empresaIds = [selectedEmpresaId];
      }

      // Get all members from selected empresas
      const allMembers: EmpresaMember[] = [];
      
      for (const empresaId of empresaIds) {
        const { data, error } = await supabase.rpc('get_empresa_members_with_details', {
          p_empresa_id: empresaId
        });

        if (!error && data) {
          allMembers.push(...data);
        }
      }

      // Remove duplicates by user_id
      const uniqueMembers = Array.from(
        new Map(allMembers.map(m => [m.user_id, m])).values()
      );

      setEmpresaMembers(uniqueMembers);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    }
  };

  const handleMemberClick = async (memberId: string) => {
    console.log('Clicou no membro:', memberId);
    console.log('User ID atual:', currentUserId);
    console.log('Conversas existentes:', conversations);
    
    if (memberId === currentUserId) return;

    // Check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.members.length === 2 &&
      conv.members.some(m => m.user_id === memberId) &&
      conv.members.some(m => m.user_id === currentUserId)
    );

    console.log('Conversa existente encontrada:', existingConv);

    if (existingConv) {
      setSelectedConversationId(existingConv.id);
    } else {
      // Find a common empresa between users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userEmpresas } = await supabase
        .from('empresa_members')
        .select('empresa_id')
        .eq('user_id', user.id);

      const { data: memberEmpresas } = await supabase
        .from('empresa_members')
        .select('empresa_id')
        .eq('user_id', memberId);

      // Find common empresa
      const commonEmpresa = userEmpresas?.find(ue => 
        memberEmpresas?.some(me => me.empresa_id === ue.empresa_id)
      );

      console.log('Empresa em comum:', commonEmpresa);

      if (commonEmpresa) {
        // Create new conversation
        const convId = await createConversation([memberId]);
        console.log('Nova conversa criada:', convId);
        if (convId) {
          setSelectedConversationId(convId);
        }
      }
    }
  };

  const getConversationName = (conversation: any) => {
    const otherMember = conversation.members.find((m: any) => m.user_id !== currentUserId);
    if (!otherMember) return "Conversa";
    
    const memberInfo = empresaMembers.find(em => em.user_id === otherMember.user_id);
    return memberInfo?.display_name || memberInfo?.email || "Usuário";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Agora';
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  if (!open) return null;

  const panelWidth = isMaximized ? 'w-[500px]' : 'w-[320px]';
  const panelHeight = isMaximized ? 'h-[70vh]' : 'h-[450px]';

  return (
    <div 
      className={`fixed bottom-20 right-6 ${panelWidth} ${panelHeight} bg-background border border-border rounded-lg shadow-2xl flex flex-col z-30 transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex flex-col border-b border-border">
        <div className="flex items-center justify-between p-4">
          {selectedConversationId ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversationId(null)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold text-lg flex-1 text-center">
                {getConversationName(conversations.find(c => c.id === selectedConversationId))}
              </h2>
            </>
          ) : (
            <h2 className="font-semibold text-lg">
              Mensagens
            </h2>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-8 w-8"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {!selectedConversationId && (
          <div className="px-4 pb-3">
            <Select value={selectedEmpresaId} onValueChange={setSelectedEmpresaId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Content */}
      {selectedConversationId ? (
        <ChatConversation conversationId={selectedConversationId} />
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Online Members Section */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground px-3 py-2">
                PESSOAS ONLINE
              </p>
              <div className="space-y-1">
                {empresaMembers
                  .filter(member => member.user_id !== currentUserId)
                  .map((member) => (
                    <button
                      key={member.user_id}
                      onClick={() => handleMemberClick(member.user_id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(member.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {member.display_name}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Conversations List */}
            {conversations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground px-3 py-2 mt-4">
                  CONVERSAS
                </p>
                <div className="space-y-1">
                  {conversations.map((conversation) => {
                    const otherMember = conversation.members.find(m => m.user_id !== currentUserId);
                    const memberInfo = empresaMembers.find(em => em.user_id === otherMember?.user_id);
                    const name = memberInfo?.display_name || memberInfo?.email || "Usuário";
                    const hasUnread = false; // Can be implemented later

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversationId(conversation.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-muted">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate">
                              {name}
                            </p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessage.created_at)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage?.content || 'Sem mensagens'}
                            </p>
                            {hasUnread && (
                              <div className="h-2 w-2 bg-primary rounded-full ml-2" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            )}

            {!loading && conversations.length === 0 && empresaMembers.length <= 1 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma conversa ainda
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
