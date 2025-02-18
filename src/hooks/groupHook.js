import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, joinGroup, leaveGroup, getGroupById, getGroupParticipated, getGroupSuggestions, getMembers, removeMember, promoteAdmin } from "../services/groupApi";

// Tạo nhóm mới
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

// Lấy chi tiết nhóm
export const useGetGroupById = (id) => {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => getGroupById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
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
    mutationFn: joinGroup,
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
    mutationFn: leaveGroup,
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
    },
  });
}; 

// Lấy danh sách thành viên nhóm
export const useGetMembers = (id) => {
  return useQuery({
    queryKey: ["members", id],
    queryFn: () => getMembers(id),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Xóa thành viên khỏi nhóm
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMember,
    onSuccess: (_, { groupId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: ["members", groupId] });
    },
  });
};

// Thêm quản trị viên mới
export const usePromoteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promoteAdmin,
    onSuccess: (_, { groupId, memberId }) => {
      queryClient.invalidateQueries({ queryKey: ["members", groupId] });
    },
  });
};

