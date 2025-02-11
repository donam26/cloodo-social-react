import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversation, getMessages, getConversationById, sendMessage } from '../services/messengerApi';

export const useGetConversation = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversation,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
  });
};

export const useGetMessages = (id) => {
  return useQuery({
    queryKey: ['messages', id],
    queryFn: () => getMessages(id),
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
  });
};

export const useGetConversationById = (id) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => getConversationById(id),
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data, variables) => {
      // Cập nhật cache của conversation detail
      queryClient.invalidateQueries(['conversation', variables.conversation_id]);
    }
  });
};