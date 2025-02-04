import { notification } from "antd";
import axiosInstance from "../api/axiosInstance";
import { setUser } from "../redux/features/auth/authSlice";

export const loginUser = async (data, dispatch) => {
    try {
        const response = await axiosInstance.post('/auth/login', data);
        dispatch(setUser(response.data.data));
        notification.success({
            message: "Đăng nhập thành công",
            description: "Chào mừng bạn đã quay trở lại!",
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.";
        notification.error({
            message: "Đăng nhập thất bại",
            description: errorMessage,
        });
        throw error;
    }
};

export const getUser = async () => {
    const response = await axiosInstance.get('/me');
    return response.data;
}
