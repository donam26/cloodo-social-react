import { useState, useEffect } from "react";
import { Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaCog } from "react-icons/fa";
import GroupSuggestions from "../../components/Group/GroupSuggestions";
import CreateGroupModal from "../../components/Group/CreateGroupModal";

const GroupsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("feed");
  useEffect(() => {
    const path = location.pathname.split("/")[2] || "feed";
    setActiveTab(path);
  }, [location]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "groups":
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-xl font-semibold mb-4">
                Nhóm bạn đã tham gia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Render danh sách nhóm đã tham gia */}
              </div>
            </div>
          </div>
        );
      case "discover":
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-xl font-semibold mb-4">Khám phá nhóm</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Render danh sách nhóm gợi ý */}
                <GroupSuggestions />
              </div>
            </div>
          </div>
        );
      default:
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-100">
      {/* Main content */}
      <div className="flex gap-6 max-w-[1920px] mx-auto">
        {/* Feed */}
        <div className="flex-1 min-w-0 space-y-4">{renderContent()}</div>

        {/* Right sidebar - Desktop */}
        <div className="hidden xl:block w-[360px] shrink-0">
          <div className="sticky top-4 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Nhóm gợi ý cho bạn</h3>
                <Button
                  type="link"
                  onClick={() => navigate("/groups/discover")}
                >
                  Xem tất cả
                </Button>
              </div>
              <GroupSuggestions />
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default GroupsPage;
