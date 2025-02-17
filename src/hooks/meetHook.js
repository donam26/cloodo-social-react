import { createChannel, joinChannel, endLiveStream, getLiveStream, createLiveStream } from "../services/livestreamApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useCreateChannel = () => {
  return useMutation({
    mutationFn: createChannel,
  });
};

export const useJoinChannel = () => {
  return useMutation({
    mutationFn: joinChannel,
  });
};

export const useEndLiveStream = () => {
  return useMutation({
    mutationFn: endLiveStream,
  });
};


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
