import axiosInstance from "../api/axiosInstance";

export const getStory = async () => {
  const response = await axiosInstance.get('/stories');
  return response.data;
};

export const getStoryById = async (id) => {
  const response = await axiosInstance.get(`/stories/${id}`);
  return response.data;
};

export const createStory = async (data) => {
  const response = await axiosInstance.post('/stories', data);
  return response.data;
};

export const updateStory = async (id, data) => {
  const response = await axiosInstance.put(`/stories/${id}`, data);
  return response.data;
};
