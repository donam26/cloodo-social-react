import { useState, useEffect } from "react";
import { Drawer, Button, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaBars, 
  FaSearch, 
  FaPlus, 
  FaCog, 
  FaUserFriends, 
  FaCompass,
  FaRegCalendarAlt,
  FaGamepad,
  FaBookmark
} from "react-icons/fa";
import GroupFeed from "../../components/Group/GroupFeed";
import GroupSuggestions from "../../components/Group/GroupSuggestions";

const GroupsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');

  // Xác định active section từ URL
  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'feed';
    setActiveTab(path);
  }, [location]);

  const menuItems = [
    { 
      icon: <FaUserFriends />, 
      label: 'Nhóm của bạn', 
      key: 'your-groups',
      onClick: () => navigate('/groups/your-groups')
    },
    { 
      icon: <FaCompass />, 
      label: 'Khám phá', 
      key: 'discover',
      onClick: () => navigate('/groups/discover')
    },
    { 
      icon: <FaRegCalendarAlt />, 
      label: 'Sự kiện', 
      key: 'events',
      onClick: () => navigate('/groups/events')
    },
    { 
      icon: <FaGamepad />, 
      label: 'Chơi game', 
      key: 'gaming',
      onClick: () => navigate('/groups/gaming')
    },
    { 
      icon: <FaBookmark />, 
      label: 'Đã lưu', 
      key: 'saved',
      onClick: () => navigate('/groups/saved')
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Thêm logic tìm kiếm ở đây
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'your-groups':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-xl font-semibold mb-4">Nhóm bạn đã tham gia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Render danh sách nhóm đã tham gia */}
              </div>
            </div>
          </div>
        );
      case 'discover':
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
        return (
          <>
            {/* Feed Header */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Bảng tin nhóm</h1>
                <Button 
                  type="primary" 
                  icon={<FaPlus />} 
                  size="large" 
                  className="rounded-lg"
                  onClick={() => navigate('/groups/create')}
                >
                  Tạo nhóm mới
                </Button>
              </div>
              <div className="flex gap-2 border-t pt-2">
                <Button 
                  type={activeTab === 'feed' ? 'primary' : 'text'}
                  onClick={() => navigate('/groups')}
                  className="flex-1 h-10"
                >
                  Bảng tin
                </Button>
                <Button
                  type={activeTab === 'discover' ? 'primary' : 'text'}
                  onClick={() => navigate('/groups/discover')}
                  className="flex-1 h-10"
                >
                  Khám phá
                </Button>
              </div>
            </div>

            {/* Feed Content */}
            <GroupFeed />
          </>
        );
    }
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
      {menuItems.map(item => (
        <Button
          key={item.key}
          type="text"
          icon={item.icon}
          onClick={item.onClick}
          className={`w-full flex items-center gap-3 h-12 px-3 justify-start text-gray-600 hover:bg-gray-100 ${
            location.pathname.includes(item.key) ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <span className="text-base">{item.label}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-100">
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

      {/* Main content */}
      <div className="flex gap-6 px-4 py-4 max-w-[1920px] mx-auto">
        {/* Left sidebar - Desktop */}
        <div className="hidden lg:block w-[300px] xl:w-[360px] shrink-0">
          <div className="sticky top-4 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold mb-4">Nhóm</h2>
              <Input
                prefix={<FaSearch className="text-gray-400" />}
                placeholder="Tìm kiếm trong nhóm"
                className="rounded-full bg-gray-100 hover:bg-gray-200"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="p-2">
              {renderSidebar()}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 min-w-0 space-y-4">
          {renderContent()}
        </div>

        {/* Right sidebar - Desktop */}
        <div className="hidden xl:block w-[360px] shrink-0">
          <div className="sticky top-4 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Nhóm gợi ý cho bạn</h3>
                <Button type="link" onClick={() => navigate('/groups/discover')}>
                  Xem tất cả
                </Button>
              </div>
              <GroupSuggestions />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Nhóm bạn quản lý</h3>
                <Button type="text" icon={<FaCog />} />
              </div>
              {/* Add managed groups list here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage; 