import { useQuery, useMutation } from '@tanstack/react-query';
import { getNotification, markAsRead, removeNotification } from '../services/notificationApi';
import { useQueryClient } from '@tanstack/react-query';

export const useGetNotification = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotification,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, notificationId) => {
      // Cập nhật cache khi API call thành công
      const oldData = queryClient.getQueryData(['notifications']);
      if (oldData) {
        const newData = {
          ...oldData,
          data: oldData.data.map(item => 
            item.id === notificationId
              ? { ...item, read_at: new Date().toISOString() }
              : item
          )
        };
        queryClient.setQueryData(['notifications'], newData);
      }
    }
  });
};

export const useRemoveNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeNotification,
    onSuccess: (_, notificationId) => {
      // Cập nhật cache khi xóa thành công
      const oldData = queryClient.getQueryData(['notifications']);
      if (oldData) {
        const newData = {
          ...oldData,
          data: oldData.data.filter(item => item.id !== notificationId)
        };
        queryClient.setQueryData(['notifications'], newData);
      }
    }
  });
};
