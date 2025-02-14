import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversation, getMessages, getConversationById, sendMessage, createConversation } from '../services/messengerApi';

export const useGetConversation = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversation,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
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
  return useMutation({
    mutationFn: sendMessage,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      // Cập nhật cache danh sách cuộc trò chuyện
      const oldConversations = queryClient.getQueryData(['conversations']);
      if (oldConversations) {
        queryClient.setQueryData(['conversations'], {
          ...oldConversations,
          data: [data.data, ...oldConversations.data]
        });
      }
      
      // Cập nhật cache chi tiết cuộc trò chuyện
      queryClient.setQueryData(['conversation', data.data.id], {
        data: {
          conversation: data.data,
          messages: {
            items: [],
            total: 0
          }
        }
      });
    }
  });
};