import axiosInstance from "../api/axiosInstance";

export const getLiveStream = async () => {
  const response = await axiosInstance.get('/livestreams');
  return response.data;
};

export const createLiveStream = async (data) => {
  const response = await axiosInstance.post('/livestreams', data);
  return response.data;
};
