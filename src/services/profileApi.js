import axiosInstance from "../api/axiosInstance";

export const getMyProfile = async () => {
  const response = await axiosInstance.get(`/profile`);
  return response.data;
};

export const getProfile = async (id) => {
  const response = await axiosInstance.get(`/profile/${id}`);
  return response.data?.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put(`/profile`, data);
  return response.data;
};

export const getMutualFriends = async (id) => {
  const response = await axiosInstance.get(`/profile/${id}/mutual-friends`);
  return response.data;
}; 