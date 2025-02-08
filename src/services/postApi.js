import axiosInstance from "../api/axiosInstance";

export const getPost = async () => {
  const response = await axiosInstance.get('/posts');
  return response.data;
};

export const getPostById = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (data) => {
  const response = await axiosInstance.post('/posts', data);
  return response.data;
};

export const updatePost = async (id, data) => {
  const response = await axiosInstance.put(`/posts/${id}`, data);
  return response.data;
};
