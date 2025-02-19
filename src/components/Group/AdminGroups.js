import { useState } from "react";
import { Input, Button, Skeleton, Dropdown, message } from "antd";
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
import { useGetAdminGroups, useLeaveGroup } from "../../hooks/groupHook";

const AdminGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: groups, isLoading: isLoadingGroups } = useGetAdminGroups();
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

  const filteredGroups = groups?.data?.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <Input
          prefix={<FaSearch className="text-gray-400" />}
          placeholder="Tìm kiếm nhóm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Group List */}
      <div className="space-y-4">
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
              Hãy thử tìm kiếm với từ khóa khác
            </p>
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
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <FaShieldAlt className="w-3 h-3" />
                      Quản trị viên
                    </span>
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
  );
};

export default AdminGroups; 