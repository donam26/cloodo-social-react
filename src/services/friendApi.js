import axiosInstance from "../api/axiosInstance";

// Lấy danh sách bạn bè
export const getFriends = async () => {
  const response = await axiosInstance.get('/friends');
  return response.data;
};

// Lấy danh sách gợi ý kết bạn
export const getFriendSuggestions = async () => {
  const response = await axiosInstance.get('/friends/suggests');
  return response.data;
};

// Lấy danh sách lời mời kết bạn đang chờ
export const getFriendRequests = async () => {
  const response = await axiosInstance.get('/friends/waitAccepts');
  return response.data;
};

// Xử lý các action kết bạn
export const sendFriendAction = async ({ userId, action }) => {
  // action có thể là: 'request', 'accept', 'cancel', 'block', 'unblock'
  const response = await axiosInstance.post(`/friends/${userId}/${action}`);
  return response.data;
}; 