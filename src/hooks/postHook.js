import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPost, createPost, reactPost, createComment, deleteComment, getPostById, updatePost, deletePost } from '../services/postApi';
import { message } from 'antd';

export const useGetPost = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPost,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
  });
};

export const useGetPostById = (id) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Cập nhật lại danh sách bài viết
      queryClient.invalidateQueries(['posts']);
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactPost,
    onSuccess: (_, postId) => {
      // Lấy cache hiện tại
      const oldData = queryClient.getQueryData(['posts']);
      
      if (oldData) {
        // Cập nhật cache với reaction mới
        const newData = {
          ...oldData,
          data: oldData.data.map(post => {
            if (post.id === postId) {
              const isCurrentlyReacted = post.reactions.current_user_reacted;
              return {
                ...post,
                reactions: {
                  ...post.reactions,
                  total: isCurrentlyReacted ? post.reactions.total - 1 : post.reactions.total + 1,
                  current_user_reacted: !isCurrentlyReacted,
                  types: {
                    ...post.reactions.types,
                    like: isCurrentlyReacted ? post.reactions.types.like - 1 : post.reactions.types.like + 1
                  }
                }
              };
            }
            return post;
          })
        };

        // Cập nhật cache
        queryClient.setQueryData(['posts'], newData);
      }
    }
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment, variables) => {
      // Lấy cache hiện tại
      const oldData = queryClient.getQueryData(['posts']);
      
      if (oldData) {
        // Cập nhật cache với comment mới
        const newData = {
          ...oldData,
          data: oldData.data.map(post => {
            if (post.id === variables.postId) {
              return {
                ...post,
                comments: [...post.comments, newComment.data],
                total_comments: post.total_comments + 1
              };
            }
            return post;
          })
        };

        // Cập nhật cache
        queryClient.setQueryData(['posts'], newData);
      }
    }
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, variables) => {
      // Lấy cache hiện tại
      const oldData = queryClient.getQueryData(['posts']);
      
      if (oldData) {
        // Cập nhật cache sau khi xóa comment
        const newData = {
          ...oldData,
          data: oldData.data.map(post => {
            if (post.id === variables.postId) {
              return {
                ...post,
                comments: post.comments.filter(comment => comment.id !== variables.commentId),
                total_comments: post.total_comments - 1
              };
            }
            return post;
          })
        };

        // Cập nhật cache
        queryClient.setQueryData(['posts'], newData);
      }
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      message.success('Cập nhật bài viết thành công');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, postId) => {
      // Lấy cache hiện tại
      const oldData = queryClient.getQueryData(['posts']);
      
      if (oldData) {
        // Cập nhật cache sau khi xóa bài viết
        const newData = {
          ...oldData,
          data: oldData.data.filter(post => post.id !== postId)
        };

        // Cập nhật cache
        queryClient.setQueryData(['posts'], newData);
      }
      message.success('Xóa bài viết thành công');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa bài viết');
    }
  });
};
