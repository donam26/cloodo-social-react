import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { getGroupById, getGroupParticipated, getGroupSuggestions } from "../services/groupApi";

// Tạo nhóm mới
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/groups", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate và fetch lại danh sách nhóm
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

// Lấy chi tiết nhóm
export const useGetGroupById = (id) => {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => getGroupById(id),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

// Lấy danh sách nhóm đã tham gia
export const useGetGroupParticipated = () => {
  return useQuery({
    queryKey: ["groupsParticipated"],
    queryFn: getGroupParticipated,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Lấy danh sách nhóm gợi ý
export const useGetGroupSuggestions = () => {
  return useQuery({
    queryKey: ["groupSuggestions"],
    queryFn: getGroupSuggestions,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Tham gia nhóm
export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId) => {
      const response = await axiosInstance.post(`/groups/${groupId}/join`);
      return response.data;
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
    },
  });
};

// Rời nhóm
export const useLeaveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId) => {
      const response = await axiosInstance.post(`/groups/${groupId}/leave`);
      return response.data;
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
    },
  });
}; 