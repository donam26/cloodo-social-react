import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Tabs, Avatar, Input } from "antd";
import { 
  FaUserFriends, 
  FaCog, 
  FaEllipsisH, 
  FaSearch,
  FaUserPlus,
  FaRegNewspaper,
  FaUsers,
  FaImage,
  FaVideo,
  FaCalendarAlt,
  FaFileAlt
} from "react-icons/fa";
import { useGetGroupById, useJoinGroup, useLeaveGroup } from "../../../hooks/groupHook";
import CreatePostModal from "../../../components/Post/CreateModal";
import Post from "../../../components/Post";

const GroupDetailPage = () => {
  const { id } = useParams();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discussion");

  const { data: group, isLoading } = useGetGroupById(id);
  const { mutate: joinGroup, isPending: isJoining } = useJoinGroup();
  const { mutate: leaveGroup, isPending: isLeaving } = useLeaveGroup();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleJoinGroup = () => {
    joinGroup(id);
  };

  const handleLeaveGroup = () => {
    leaveGroup(id);
  };

  const items = [
    {
      key: "discussion",
      label: "Thảo luận",
      icon: <FaRegNewspaper />,
      children: (
        <div className="space-y-4">
          {/* Create Post Box */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-3">
              <Avatar size={40} src={group?.data?.image} />
              <button
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-600 hover:bg-gray-200"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                Viết bài...
              </button>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t">
              <button
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                <FaImage className="text-green-500" />
                <span>Ảnh</span>
              </button>
              <button
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                <FaVideo className="text-red-500" />
                <span>Video trực tiếp</span>
              </button>
              <button
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                <FaCalendarAlt className="text-purple-500" />
                <span>Sự kiện</span>
              </button>
              <button
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                <FaFileAlt className="text-blue-500" />
                <span>Tệp</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {group?.data?.posts?.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "about",
      label: "Giới thiệu",
      icon: <FaUsers />,
      children: (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Giới thiệu</h3>
          <p className="text-gray-600 mb-6">{group?.data?.description}</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaUserFriends className="text-gray-500 w-5 h-5" />
              <div>
                <p className="font-medium">Thành viên</p>
                <p className="text-gray-500 text-sm">
                  {group?.data?.members_count || 0} thành viên
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FaRegNewspaper className="text-gray-500 w-5 h-5" />
              <div>
                <p className="font-medium">Quyền riêng tư</p>
                <p className="text-gray-500 text-sm">
                  {group?.data?.status === "public" ? "Nhóm công khai" : "Nhóm riêng tư"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "members",
      label: "Thành viên",
      icon: <FaUserFriends />,
      children: (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Thành viên</h3>
            <Input 
              prefix={<FaSearch className="text-gray-400" />}
              placeholder="Tìm kiếm thành viên"
              className="max-w-xs"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group?.data?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <Avatar src={member.avatar} size={48} />
                <div className="flex-1">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-gray-500 text-sm">
                    {member.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  </p>
                </div>
                <Button type="text" icon={<FaEllipsisH />} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover & Info */}
      <div className="bg-white shadow mb-4">
        <div className="max-w-[1920px] mx-auto">
          {/* Cover Image */}
          <div 
            className="h-[350px] bg-cover bg-center rounded-b-lg"
            style={{ 
              backgroundImage: `url(${group?.data?.image})`,
              backgroundColor: '#f0f2f5'
            }}
          />

          {/* Group Info */}
          <div className="px-4 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{group?.data?.name}</h1>
                <div className="flex items-center gap-4 text-gray-500">
                  <span className="flex items-center gap-2">
                    <FaUserFriends />
                    {group?.data?.members_count || 0} thành viên
                  </span>
                  <span>•</span>
                  <span>
                    {group?.data?.status === "public" ? "Nhóm công khai" : "Nhóm riêng tư"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {group?.data?.is_member ? (
                  <>
                    <Button
                      icon={<FaUserPlus />}
                      onClick={handleLeaveGroup}
                      loading={isLeaving}
                    >
                      Đã tham gia
                    </Button>
                    {group?.data?.is_admin && (
                      <Button icon={<FaCog />}>
                        Công cụ quản trị
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    type="primary"
                    icon={<FaUserPlus />}
                    onClick={handleJoinGroup}
                    loading={isJoining}
                  >
                    Tham gia nhóm
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={items}
              className="mt-4"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {items.find(item => item.key === activeTab)?.children}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-[360px] space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4">Giới thiệu</h3>
              <p className="text-gray-600 mb-4">{group?.data?.description}</p>
              <Button type="link" block>
                Xem tất cả
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Quản trị viên</h3>
                <Button type="link">Xem tất cả</Button>
              </div>
              {group?.data?.admins?.map((admin) => (
                <div key={admin.id} className="flex items-center gap-3 mb-2">
                  <Avatar src={admin.avatar} />
                  <div>
                    <h4 className="font-medium">{admin.name}</h4>
                    <p className="text-gray-500 text-sm">Quản trị viên</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
    </div>
  );
};

export default GroupDetailPage;

