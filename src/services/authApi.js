import { notification } from "antd";
import axiosInstance from "../api/axiosInstance";
import { setUser, logout } from "../redux/features/auth/authSlice";

export const loginUser = async (data, dispatch) => {
    try {
        const response = await axiosInstance.post('/login', data);
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

export const logoutUser = async (dispatch) => {
    try {
        await axiosInstance.post('/logout');
        dispatch(logout());
        notification.success({
            message: "Đăng xuất thành công",
            description: "Hẹn gặp lại bạn!",
        });
    } catch (error) {
        // Ngay cả khi API lỗi, vẫn thực hiện logout ở client
        dispatch(logout());
        notification.error({
            message: "Đã có lỗi xảy ra",
            description: "Đã đăng xuất khỏi hệ thống",
        });
    }
};
