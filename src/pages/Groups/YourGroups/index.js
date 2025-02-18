import { useState } from "react";
import { Input, Button, Skeleton, Tabs, Dropdown, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FaUserFriends,
  FaGlobeAsia,
  FaLock,
  FaEllipsisH,
  FaSearch,
  FaShieldAlt,
  FaRegClock,
} from "react-icons/fa";
import { useGetGroupParticipated, useLeaveGroup } from "../../../hooks/groupHook";

const YourGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const { data: groups, isLoading: isLoadingGroups } = useGetGroupParticipated();
  const { mutate: leaveGroup } = useLeaveGroup();

  const handleLeaveGroup = (groupId) => {
    leaveGroup(groupId, {
      onSuccess: () => {
        message.success("Đã rời khỏi nhóm");
      },
      onError: () => {
        message.error("Có lỗi xảy ra khi rời nhóm");
      },
    });
  };

  const filteredGroups = groups?.data?.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "admin") return matchesSearch && group.is_admin;
    if (activeTab === "recent") {
      // Giả sử có trường last_active để sắp xếp theo hoạt động gần đây
      return matchesSearch && new Date(group.last_active) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    return matchesSearch;
  });

  const items = [
    {
      key: "all",
      label: "Tất cả nhóm",
    },
    {
      key: "admin",
      label: "Nhóm quản lý",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold mb-4">Nhóm của bạn</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              prefix={<FaSearch className="text-gray-400" />}
              placeholder="Tìm kiếm nhóm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              type="primary"
              onClick={() => navigate("/groups/discover")}
              className="sm:w-auto w-full"
            >
              Khám phá thêm
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="px-4"
        />

        {/* Group List */}
        <div className="p-4 space-y-4">
          {isLoadingGroups ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div key={index} className="flex gap-4 items-center p-4 border rounded-lg">
                <Skeleton.Avatar size={64} active />
                <div className="flex-1">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              </div>
            ))
          ) : !filteredGroups?.length ? (
            <div className="text-center py-8">
              <FaUserFriends className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy nhóm nào
              </h3>
              <p className="text-gray-500 mb-4">
                Hãy thử tìm kiếm với từ khóa khác hoặc khám phá thêm các nhóm mới
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/groups/discover")}
              >
                Khám phá nhóm
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full sm:w-20 h-40 sm:h-20 rounded-lg object-cover cursor-pointer"
                    onClick={() => navigate(`/groups/${group.id}`)}
                  />
                  <div 
                    className="flex-1 min-w-0 cursor-pointer" 
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg truncate">
                        {group.name}
                      </h3>
                      {group.is_admin && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                          <FaShieldAlt className="w-3 h-3" />
                          Quản trị viên
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <FaUserFriends className="w-4 h-4" />
                        {group.members_count} thành viên
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        {group.status === "public" ? (
                          <FaGlobeAsia className="w-4 h-4" />
                        ) : (
                          <FaLock className="w-4 h-4" />
                        )}
                        {group.status === "public" ? "Công khai" : "Riêng tư"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <FaRegClock className="w-4 h-4" />
                      <span>Hoạt động {group.last_active_text}</span>
                    </div>
                  </div>
                  <div className="flex sm:block justify-end">
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: "Tắt thông báo",
                          },
                          {
                            key: "2",
                            label: "Ghim nhóm",
                          },
                          {
                            type: "divider",
                          },
                          {
                            key: "3",
                            label: "Rời nhóm",
                            danger: true,
                            onClick: () => handleLeaveGroup(group.id),
                          },
                        ],
                      }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <Button
                        type="text"
                        icon={<FaEllipsisH />}
                        className="sm:opacity-0 group-hover:opacity-100"
                      />
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourGroups; 