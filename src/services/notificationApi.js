import axiosInstance from "../api/axiosInstance";

export const getNotification = async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await axiosInstance.post(`/notifications/${id}/read`);
    return response.data;
};

export const removeNotification = async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
};
