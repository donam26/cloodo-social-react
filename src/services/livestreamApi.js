import axiosInstance from "../api/axiosInstance";

export const getLiveStream = async () => {
  const response = await axiosInstance.get('/livestreams');
  return response.data;
};

export const createLiveStream = async (data) => {
  const response = await axiosInstance.post('/livestreams', data);
  return response.data;
};



export const createChannel = async (data) => {
  const response = await axiosInstance.post(`/agora/broadcaster/token`, data);
  return response.data;
};

export const joinChannel = async (data) => {
  const response = await axiosInstance.post(`/agora/viewer/token`, data);
  return response.data;
};

export const endLiveStream = async (data) => {
  const response = await axiosInstance.post(`/livestreams/${data.streamId}/end`, data);
  return response.data;
};

