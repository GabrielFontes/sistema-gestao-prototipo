import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { toast } from 'sonner';

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  empresa_id: string;
  created_at: string;
  updated_at: string;
  members: ConversationMember[];
  lastMessage?: Message;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  user?: {
    email: string;
    display_name: string;
  };
}

export function useChat() {
  const { currentEmpresa } = useEmpresa();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadConversations();
      subscribeToMessages();
    }
  }, [currentUserId]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const loadConversations = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);

      // Get all conversations for the current user (all empresas)
      const { data: convData, error: convError } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          conversations!inner (
            id,
            empresa_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', currentUserId);

      if (convError) throw convError;

      if (!convData || convData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get all conversation members and their details
      const conversationIds = convData.map((c: any) => c.conversations.id);
      
      const { data: membersData, error: membersError } = await supabase
        .from('conversation_members')
        .select('id, conversation_id, user_id, joined_at')
        .in('conversation_id', conversationIds);

      if (membersError) throw membersError;

      // Get user details for all members
      const userIds = [...new Set(membersData?.map(m => m.user_id) || [])];

      // Get last message for each conversation
      const { data: lastMessages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      if (msgError) throw msgError;

      // Format conversations with members
      const formattedConversations: Conversation[] = convData.map((c: any) => {
        const conv = c.conversations;
        const convMembers = membersData?.filter(m => m.conversation_id === conv.id) || [];
        const lastMsg = lastMessages?.find(m => m.conversation_id === conv.id);

        return {
          id: conv.id,
          empresa_id: conv.empresa_id,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          members: convMembers.map(m => ({
            id: m.id,
            conversation_id: m.conversation_id,
            user_id: m.user_id,
            joined_at: m.joined_at,
          })),
          lastMessage: lastMsg,
        };
      });

      setConversations(formattedConversations);
      console.log('Conversas carregadas:', formattedConversations);
    } catch (error: any) {
      console.error('Erro ao carregar conversas:', error);
      toast.error('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      console.log('Buscando mensagens para conversa:', conversationId);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Mensagens carregadas:', data);
      setMessages(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!currentUserId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: currentUserId,
          content: content.trim(),
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const createConversation = async (memberIds: string[], empresaId?: string) => {
    if (!currentUserId) return;

    const targetEmpresaId = empresaId || currentEmpresa?.id;
    if (!targetEmpresaId) return;

    try {
      // Create conversation
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .insert({
          empresa_id: targetEmpresaId,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add members (including current user)
      const members = [...new Set([currentUserId, ...memberIds])];
      const { error: membersError } = await supabase
        .from('conversation_members')
        .insert(
          members.map(userId => ({
            conversation_id: convData.id,
            user_id: userId,
          }))
        );

      if (membersError) throw membersError;

      await loadConversations();
      return convData.id;
    } catch (error: any) {
      console.error('Erro ao criar conversa:', error);
      toast.error('Erro ao criar conversa');
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          loadConversations(); // Reload to update last message
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    conversations,
    messages,
    loading,
    currentUserId,
    loadMessages,
    sendMessage,
    createConversation,
  };
}
