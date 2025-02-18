import axiosInstance from "../api/axiosInstance";

export const createGroup = async (data) => {  
  const response = await axiosInstance.post("/groups", data);
  return response.data;
};

export const joinGroup = async (groupId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/join`);
  return response.data;
};

export const leaveGroup = async (groupId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/leave`);
  return response.data;
};

export const getGroupParticipated = async () => {
  const response = await axiosInstance.get(`/groups/participated`);
  return response.data;
};

export const getGroupById = async (id) => {
  const response = await axiosInstance.get(`/groups/${id}`);
  return response.data;
};

export const getGroupSuggestions = async () => {
  const response = await axiosInstance.get(`/groups/suggested`);
  return response.data;
};

export const getMembers = async (id) => {
  const response = await axiosInstance.get(`/groups/${id}/members`);
  return response.data;
};

export const removeMember = async (groupId, memberId) => {
  const response = await axiosInstance.delete(`/groups/${groupId}/members/${memberId}`);
  return response.data;
};

export const promoteAdmin = async (groupId, memberId) => {
  const response = await axiosInstance.post(`/groups/${groupId}/members/${memberId}/promote`);
  return response.data;
};

