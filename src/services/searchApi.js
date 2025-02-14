import axiosInstance from "../api/axiosInstance";

export const getSearch = async (query) => {
  const response = await axiosInstance.get(`/search?query=${query}`);
  return response.data;
};

export const searchPeople = async (query) => {
  const response = await axiosInstance.get(`/search/people?query=${query}`);
  return response.data;
};

export const searchPosts = async (query) => {
  const response = await axiosInstance.get(`/search/posts?query=${query}`);
  return response.data;
};

export const searchPhotos = async (query) => {
  const response = await axiosInstance.get(`/search/photos?query=${query}`);
  return response.data;
};

export const searchVideos = async (query) => {
  const response = await axiosInstance.get(`/search/videos?query=${query}`);
  return response.data;
};

export const searchGroups = async (query) => {
  const response = await axiosInstance.get(`/search/groups?query=${query}`);
  return response.data;
};

