import { FaSearch, FaBell, FaThumbsUp, FaImage, FaVideo, FaPhone } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Avatar } from "antd";

const Sidebar = ({ chat }) => {
  if (!chat) return null;

  return (
    <div className="h-full p-4">
      {/* Profile */}
      <div className="flex flex-col items-center pb-4 border-b">
        <div className="relative mb-2">
          <Avatar
            src={chat?.avatar}
            alt={chat.name}
            size={80}
            className="rounded-full"
          />
          {chat.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <h2 className="text-xl font-semibold">{chat.name}</h2>
        <p className="text-sm text-gray-500">
          {chat.isOnline ? "Đang hoạt động" : "Không hoạt động"}
        </p>
      </div>

      {/* Actions */}
      <div className="py-4 border-b">
        <div className="grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <FaSearch className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs">Tìm kiếm</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <FaBell className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs">Tắt thông báo</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <FaThumbsUp className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs">Biểu cảm</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <IoMdSettings className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs">Tùy chỉnh</span>
          </button>
        </div>
      </div>

      {/* File sharing */}
      <div className="py-4 border-b">
        <h3 className="text-lg font-semibold mb-4">File phương tiện, file và liên kết</h3>
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg">
            <FaImage className="w-6 h-6 text-gray-600" />
            <span className="text-sm">Ảnh</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg">
            <FaVideo className="w-6 h-6 text-gray-600" />
            <span className="text-sm">Video</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg">
            <FaPhone className="w-6 h-6 text-gray-600" />
            <span className="text-sm">Cuộc gọi</span>
          </button>
        </div>
      </div>

      {/* Privacy & Support */}
      <div className="py-4">
        <button className="w-full text-left p-2 hover:bg-gray-100 rounded-lg">
          <h3 className="font-medium">Quyền riêng tư & hỗ trợ</h3>
          <p className="text-sm text-gray-500">Tùy chỉnh trò chuyện</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 