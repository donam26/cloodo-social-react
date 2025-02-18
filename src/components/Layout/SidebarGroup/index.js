import {
  FaImages,
  FaUserFriends,
  FaVideo,
  FaCompass,
  FaRegCalendarAlt,
  FaGamepad,
  FaBookmark,
  FaSearch,
  FaBars,
  FaGlobeAsia,
  FaLock,
  FaEllipsisH,
} from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { MessageOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Skeleton } from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Input, Button, Drawer, Dropdown } from "antd";
import { useGetGroupParticipated } from "../../../hooks/groupHook";

const SidebarGroup = () => {
  const userData = useSelector((state) => state?.user?.user);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: groups, isLoading: isLoadingGroups } = useGetGroupParticipated();

  const menuItems = [
    {
      icon: <FaUserFriends />,
      label: "Nhóm của bạn",
      key: "groups",
      onClick: () => navigate("/groups"),
    },
    {
      icon: <FaCompass />,
      label: "Khám phá",
      key: "discover",
      onClick: () => navigate("/groups/discover"),
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
          placeholder="Tìm kiếm trong nhóm"
          className="rounded-full bg-gray-100 hover:bg-gray-200"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
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

      {/* Groups you've joined */}
      <div className="px-2">
        <h3 className="text-gray-500 font-medium mb-2 px-2">Nhóm bạn đã tham gia</h3>
        <div className="space-y-1">
          {isLoadingGroups ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <Skeleton.Avatar size={32} active />
                <Skeleton.Input style={{ width: 150 }} active size="small" />
              </div>
            ))
          ) : groups?.data?.length > 0 ? (
            groups.data.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{group.name}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    {group.status === "public" ? (
                      <FaGlobeAsia className="w-3 h-3" />
                    ) : (
                      <FaLock className="w-3 h-3" />
                    )}
                    <span>{group.members_count} thành viên</span>
                  </div>
                </div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        label: 'Ghim nhóm',
                      },
                      {
                        key: '2',
                        label: 'Rời nhóm',
                        danger: true,
                      },
                    ]
                  }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    icon={<FaEllipsisH />}
                    size="small"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </div>
            ))
          ) : (
            <div className="text-center py-4 px-2">
              <p className="text-gray-500 text-sm">
                Bạn chưa tham gia nhóm nào
              </p>
              <Button
                type="link"
                onClick={() => navigate("/groups/discover")}
                className="mt-2"
              >
                Khám phá nhóm
              </Button>
            </div>
          )}
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
            <h2 className="text-2xl font-bold">Nhóm</h2>
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
            <h2 className="text-xl font-bold">Menu Nhóm</h2>
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

export default SidebarGroup;
