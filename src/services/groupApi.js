import axiosInstance from "../api/axiosInstance";

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



