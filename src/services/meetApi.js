import axiosInstance from "../api/axiosInstance";

export const createChannel = async (data) => {
    const response = await axiosInstance.post(`/agora/broadcaster/token`, data);
    return response.data;
};

export const joinChannel = async (data) => {
    const response = await axiosInstance.post(`/agora/viewer/token`, data);
    return response.data;
};

