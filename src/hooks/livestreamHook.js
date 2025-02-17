import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLiveStream, createLiveStream } from '../services/livestreamApi';

export const useGetLiveStream = () => {
  return useQuery({
    queryKey: ['livestreams'],
    queryFn: getLiveStream,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
  });
};

export const useCreateLiveStream = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLiveStream,
    onSuccess: () => {
      // Cập nhật lại danh sách bài viết
      queryClient.invalidateQueries(['livestreams']);
    },
  });
};
