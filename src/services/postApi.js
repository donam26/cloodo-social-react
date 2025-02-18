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

export const reactPost = async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/react`);
  return response.data;
};

export const createComment = async (data) => {
  const response = await axiosInstance.post(`/posts/${data.postId}/comment`, data);
  return response.data;
};

export const deleteComment = async (postId, commentId) => {
  const response = await axiosInstance.delete(`/posts/${postId}/comment/${commentId}`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};
