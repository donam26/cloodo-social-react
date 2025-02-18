import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Avatar } from "antd";
import { 
  FaUserFriends, 
  FaCog, 
  FaUserPlus,
} from "react-icons/fa";
import { useGetGroupById, useJoinGroup, useLeaveGroup } from "../../../hooks/groupHook";
import GroupTabs from "../../../components/Group/GroupTabs";
import Discussion from "../../../components/Group/TabContent/Discussion";
import Members from "../../../components/Group/TabContent/Members";
import Media from "../../../components/Group/TabContent/Media";
import { useSelector } from "react-redux";

const GroupDetailPage = () => {
  const userData = useSelector((state) => state?.user?.user);
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState("discussion");

  const { data: group, isLoading } = useGetGroupById(groupId);
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
    joinGroup(groupId);
  };

  const handleLeaveGroup = () => {
    leaveGroup(groupId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussion':
        return <Discussion group={group?.data} posts={group?.data?.posts} />;
      case 'members':
        return <Members currentUserIsAdmin={group?.data?.admin?.id === userData?.user?.id} />;
      case 'media':
        return <Media photos={group?.data?.photos} videos={group?.data?.videos} />;
      default:
        return <div>Đang phát triển...</div>;
    }
  };

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
                    {group?.data?.total_members || 0} thành viên
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <GroupTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isAdmin={group?.data?.is_admin}
      />

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-[360px]">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4">Giới thiệu</h3>
              <p className="text-gray-600 mb-4">{group?.data?.description}</p>
              <Button type="link" block>
                Xem tất cả
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;

