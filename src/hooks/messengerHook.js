import { useQuery } from '@tanstack/react-query';
import { getConversation } from '../services/messengerApi';

export const useGetConversation = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversation,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
  });
};