import axiosInstance from "../api/axiosInstance";

export const createToken = async (data) => {
    const response = await axiosInstance.post(`/agora/token`, data);
    return response.data;
};