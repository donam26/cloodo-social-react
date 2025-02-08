import { useQuery } from '@tanstack/react-query';
import { getPost } from '../services/postApi';
export const useGetPost = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPost,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
  });
};