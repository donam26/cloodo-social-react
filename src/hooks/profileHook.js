import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, getMutualFriends, getMyProfile } from '../services/profileApi';
import { message } from 'antd';

export const useGetMyProfile = () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: () => getMyProfile(),
      refetchOnWindowFocus: false,
    });
  };

  
export const useGetProfile = (id) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateProfile(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['profile', variables.id]);
      message.success('Cập nhật thông tin thành công');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetMutualFriends = (id) => {
  return useQuery({
    queryKey: ['mutualFriends', id],
    queryFn: () => getMutualFriends(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}; 