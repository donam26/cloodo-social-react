import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStory, createStory, updateStory } from '../services/storyApi';

export const useGetStory = () => {
  return useQuery({
    queryKey: ['stories'],
    queryFn: getStory,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      // Cập nhật lại danh sách bài viết
      queryClient.invalidateQueries(['stories']);
    },
  });
};

export const useLikeStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStory,
    onSuccess: (_, storyId) => {
      // Lấy cache hiện tại
      const oldData = queryClient.getQueryData(['stories']);
      
      if (oldData) {
        // Cập nhật cache với reaction mới
        const newData = {
          ...oldData,
          data: oldData.data.map(story => {
            if (story.id === storyId) {
              const isCurrentlyReacted = story.reactions.current_user_reacted;
              return {
                ...story,
                reactions: {
                  ...story.reactions,
                  total: isCurrentlyReacted ? story.reactions.total - 1 : story.reactions.total + 1,
                  current_user_reacted: !isCurrentlyReacted,
                  types: {
                    ...story.reactions.types,
                    like: isCurrentlyReacted ? story.reactions.types.like - 1 : story.reactions.types.like + 1
                  }
                }
              };
            }
            return story;
          })
        };

        // Cập nhật cache
        queryClient.setQueryData(['stories'], newData);
      }
    }
  });
};
