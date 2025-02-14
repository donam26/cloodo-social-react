import { useQuery } from '@tanstack/react-query';
import { getSearch, searchPeople, searchPosts, searchPhotos, searchVideos, searchGroups } from '../services/searchApi';
  
// Hook lấy kết quả tìm kiếm
export const useGetSearch = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => {
      console.log('Calling search API with query:', query);
      return getSearch(query);
    },
    enabled: !!query,
    staleTime: 1000 * 60, // 1 phút
    cacheTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
    ...options
  });
};

export const useSearchPeople = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', 'people', query],
    queryFn: () => searchPeople(query),
    enabled: !!query,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options
  });
};

export const useSearchPosts = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', 'posts', query],
    queryFn: () => searchPosts(query),
    enabled: !!query,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options
  });
};

export const useSearchPhotos = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', 'photos', query],
    queryFn: () => searchPhotos(query),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!query,
    ...options
  });
};

export const useSearchVideos = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', 'videos', query],
    queryFn: () => searchVideos(query),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!query,
    ...options
  });
};

export const useSearchGroups = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', 'groups', query],
    queryFn: () => searchGroups(query),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!query,
    ...options
  });
};
