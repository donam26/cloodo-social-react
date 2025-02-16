import {
  FaVideo,
  FaSearch,
  FaBars,
  FaGamepad,
  FaRegCalendarAlt,
  FaBookmark,
  FaHistory,
  FaRegClock,
  FaHeart,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "antd";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Input, Button, Drawer } from "antd";

const SidebarLivestream = () => {
  const userData = useSelector((state) => state?.user?.user);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: <FaVideo />,
      label: "Bảng tin",
      key: "feed",
      onClick: () => navigate("/livestream"),
    },
    {
      icon: <FaGamepad />,
      label: "Game",
      key: "gaming",
      onClick: () => navigate("/livestream/gaming"),
    },
    {
      icon: <FaRegCalendarAlt />,
      label: "Sự kiện",
      key: "events",
      onClick: () => navigate("/livestream/events"),
    },
    {
      icon: <FaHistory />,
      label: "Video đã xem",
      key: "history",
      onClick: () => navigate("/livestream/history"),
    },
    {
      icon: <FaRegClock />,
      label: "Xem sau",
      key: "watch-later",
      onClick: () => navigate("/livestream/watch-later"),
    },
    {
      icon: <FaHeart />,
      label: "Yêu thích",
      key: "favorites",
      onClick: () => navigate("/livestream/favorites"),
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderSidebar = () => (
    <div className="flex flex-col gap-2">
      <div className="sticky top-0 bg-white p-2">
        <Input
          prefix={<FaSearch className="text-gray-400" />}
          placeholder="Tìm kiếm livestream..."
          className="rounded-full bg-gray-100 hover:bg-gray-200"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Create Livestream Button */}
      <div className="px-2 mb-2">
        <Button
          type="primary"
          icon={<FaVideo />}
          className="w-full flex items-center gap-2 justify-center"
          size="large"
          onClick={() => navigate("/livestream/create")}
        >
          Bắt đầu livestream
        </Button>
      </div>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <Button
          key={item.key}
          type="text"
          icon={item.icon}
          onClick={item.onClick}
          className={`w-full flex items-center gap-3 h-12 px-3 justify-start text-gray-600 hover:bg-gray-100 ${
            location.pathname.includes(item.key)
              ? "bg-blue-50 text-blue-600"
              : ""
          }`}
        >
          <span className="text-base">{item.label}</span>
        </Button>
      ))}

      {/* Divider */}
      <div className="border-t my-2"></div>

      {/* Channels you follow */}
      <div className="px-2">
        <h3 className="text-gray-500 font-medium mb-2 px-2">Kênh đang theo dõi</h3>
        <div className="space-y-1">
          {/* Add followed channels list here */}
          <div className="text-center py-4 px-2">
            <p className="text-gray-500 text-sm">
              Bạn chưa theo dõi kênh nào
            </p>
            <Button
              type="link"
              onClick={() => navigate("/livestream/discover")}
              className="mt-2"
            >
              Khám phá thêm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Left sidebar - Desktop */}
      <div className="hidden lg:block w-[300px] xl:w-[360px] shrink-0">
        <div className="sticky top-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold">Livestream</h2>
          </div>
          <div className="p-2">{renderSidebar()}</div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setShowSidebar(true)}
      >
        <FaBars className="w-5 h-5" />
      </button>

      {/* Mobile sidebar drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Menu Livestream</h2>
          </div>
        }
        placement="left"
        onClose={() => setShowSidebar(false)}
        open={showSidebar}
        className="lg:hidden"
        width={320}
      >
        {renderSidebar()}
      </Drawer>
    </>
  );
};

export default SidebarLivestream; 