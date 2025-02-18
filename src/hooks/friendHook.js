import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFriends, getFriendSuggestions, getFriendRequests, sendFriendAction } from '../services/friendApi';
import { message } from 'antd';

// Hook lấy danh sách bạn bè
export const useGetFriends = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
  });
};

// Hook lấy danh sách gợi ý kết bạn
export const useGetFriendSuggestions = () => {
  return useQuery({
    queryKey: ['friendSuggestions'],
    queryFn: getFriendSuggestions,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Hook lấy danh sách lời mời kết bạn
export const useGetFriendRequests = () => {
  return useQuery({
    queryKey: ['friendRequests'], 
    queryFn: getFriendRequests,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
});
};

// Hook xử lý các action kết bạn
export const useFriendAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFriendAction,
    onSuccess: (data, variables) => {
      // Cập nhật cache tùy theo action
      switch (variables.action) {
        case 'request':
          queryClient.invalidateQueries(['friendSuggestions']);
          break;
          
        case 'accept':
          queryClient.invalidateQueries(['friends']);
          queryClient.invalidateQueries(['friendRequests']);
          break;
          
        case 'cancel':
          queryClient.invalidateQueries(['friends']);
          queryClient.invalidateQueries(['friendRequests']);
          break;
          
        case 'block':
          queryClient.invalidateQueries(['friends']);
          break;

        case 'unblock':
          queryClient.invalidateQueries(['friends']);
          break;
        default:
          break;
      }
    },
    onError: () => {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  });
}; 