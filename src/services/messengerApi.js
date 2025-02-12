import axiosInstance from "../api/axiosInstance";

export const getConversation = async () => {
  const response = await axiosInstance.get('/conversations');
  return response.data;
};

export const getConversationById = async (id) => {
  const response = await axiosInstance.get(`/conversations/${id}`);
  return response.data;
};

export const createConversation = async (data) => {
  const response = await axiosInstance.post('/conversations', data);
  return response.data;
};

export const sendMessage = async (data) => {
  const response = await axiosInstance.post('/messages', data);
  return response.data;
};

