import { FaImages, FaUserFriends, FaVideo } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { MessageOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const userData = useSelector((state) => state?.user?.user);

  return (
    <div className="flex flex-col gap-4">
      <Link className="flex items-center justify-start gap-2 hover:bg-gray-200 p-2 rounded-md " to="/profile">
        <Avatar src={userData?.user?.image || "/images/avatar.jpg"} alt="avatar" size={40} className="rounded-full" />
        <span className="font-medium">{userData?.user?.name}</span>
      </Link>
      <Link className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md" to="/friend">
        <FaUserFriends className="w-6 h-6" style={{ color: '#1B74E4' }} />
        <span>Bạn bè</span>
      </Link>
      <Link className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md " to="/messenger">
        <MessageOutlined className="w-6 h-6" style={{ color: '#41B35D' }} />
        <span>Tin nhắn</span>
      </Link>
      <Link className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md" to="/groups">
        <MdGroups2 className="w-6 h-6" style={{ color: '#1B74E4' }} />
        <span>Nhóm</span>
      </Link>
      <Link className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md " to="/videos">
        <FaVideo className="w-6 h-6" style={{ color: '#E42645' }} />
        <span>Video ngắn</span>
      </Link>
      <Link className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md " to="/photos">
        <FaImages className="w-6 h-6" style={{ color: '#41B35D' }} />
        <span>Ảnh</span>
      </Link>

    </div>
  );
};

export default Sidebar;
