import { Button } from "antd";
import { 
  FaUserFriends, 
  FaImage, 
  FaVideo,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaUsers,
  FaSearch
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const SideBarSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: <FaUserFriends />,
      label: "Mọi người",
      key: "people",
      onClick: () => navigate("/search/people")
    },
    {
      icon: <FaNewspaper />,
      label: "Bài viết",
      key: "posts",
      onClick: () => navigate("/search/posts")
    },
    {
      icon: <FaImage />,
      label: "Hình ảnh",
      key: "photos",
      onClick: () => navigate("/search/photos")
    },
    {
      icon: <FaVideo />,
      label: "Video",
      key: "videos", 
      onClick: () => navigate("/search/videos")
    },
    {
      icon: <FaShoppingBag />,
      label: "Marketplace",
      key: "marketplace",
      onClick: () => navigate("/search/marketplace")
    },
    {
      icon: <FaUsers />,
      label: "Nhóm",
      key: "groups",
      onClick: () => navigate("/search/groups")
    },
    {
      icon: <FaCalendarAlt />,
      label: "Sự kiện",
      key: "events",
      onClick: () => navigate("/search/events")
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Địa điểm",
      key: "places",
      onClick: () => navigate("/search/places")
    }
  ];

  // Lấy active key từ URL
  const activeKey = location.pathname.split('/')[2] || 'all';

  return (
    <div className="w-full max-w-[360px] bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Bộ lọc</h2>
      </div>

      <div className="p-2">
        {/* All Results Button */}
        <Button
          type="text"
          className={`w-full flex items-center gap-3 h-12 px-3 justify-start text-gray-600 hover:bg-gray-100 ${
            activeKey === 'all' ? 'bg-blue-50 text-blue-600' : ''
          }`}
          onClick={() => navigate("/search")}
        >
          <FaSearch className="text-xl" />
          <span className="text-base">Tất cả kết quả</span>
        </Button>

        {/* Filter Menu Items */}
        {menuItems.map(item => (
          <Button
            key={item.key}
            type="text"
            icon={item.icon}
            onClick={item.onClick}
            className={`w-full flex items-center gap-3 h-12 px-3 justify-start text-gray-600 hover:bg-gray-100 ${
              activeKey === item.key ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="text-base">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SideBarSearch;
