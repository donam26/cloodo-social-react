import { FaSearch, FaBell, FaThumbsUp, FaImage, FaVideo, FaPhone } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ conversation }) => {
  const userData = useSelector((state) => state?.user?.user);

  const getConversationInfo = () => {
    if (!conversation) return null;

    if (conversation.type === 'private') {
      const otherMember = conversation?.participants?.find(
        member => member?.id !== userData?.user?.id
      );
      return {
        name: otherMember?.name || 'Người dùng',
        image: otherMember?.image,
        bio: otherMember?.bio
      };
    } else {
      return {
        name: conversation.name,
        image: conversation.image,
        isGroup: true,
        firstLetter: conversation.name ? conversation.name.charAt(0).toUpperCase() : 'G',
        members: conversation.participants
      };
    }
  };

  const renderAvatar = () => {
    const info = getConversationInfo();
    if (!info) return null;
    
    if (conversation.type === 'private') {
      return <Avatar src={info.image} size={80} />;
    } else {
      return info.image ? (
        <Avatar src={info.image} size={80} />
      ) : (
        <Avatar size={80} className="bg-blue-500 flex items-center justify-center">
          {info.firstLetter}
        </Avatar>
      );
    }
  };

  const info = getConversationInfo();
  if (!info) return null;

  return (
    <div className="h-full p-4">
      {/* Profile */}
      <div className="flex flex-col items-center pb-4 border-b">
        <div className="relative mb-2">
          {renderAvatar()}
        </div>
        <h2 className="text-xl font-semibold">{info.name}</h2>
        {info.bio && (
          <p className="text-sm text-gray-500">{info.bio}</p>
        )}
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

      {/* Members */}
      {info.isGroup ? (
        <div className="py-4 border-b">
          <h3 className="text-lg font-semibold mb-4">Thành viên nhóm</h3>
          <div className="space-y-3">
            {info.members?.map((member) => (
              <Link key={member.id} to={`/profile/${member.id}`} className="flex items-center gap-2">
                <Avatar src={member.image} size={40} className="rounded-full" />
                <div>
                  <p className="font-medium">{member.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Giới thiệu</h3>
            <p className="text-gray-600">
              {info.bio || 'Chưa có thông tin giới thiệu'}
            </p>
          </div>
        </div>
      )}

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