import { Tabs } from 'antd';
import { 
  FaRegNewspaper,
  FaUsers,
  FaImage,
  FaVideo,
  FaCalendarAlt,
  FaFileAlt
} from "react-icons/fa";

const GroupTabs = ({ activeTab, onTabChange, isAdmin }) => {
  const items = [
    {
      key: 'discussion',
      label: (
        <span className="flex items-center gap-2">
          <FaRegNewspaper />
          Thảo luận
        </span>
      ),
    },
    {
      key: 'members',
      label: (
        <span className="flex items-center gap-2">
          <FaUsers />
          Thành viên
        </span>
      ),
    },
    {
      key: 'media',
      label: (
        <span className="flex items-center gap-2">
          <FaImage />
          Ảnh
        </span>
      ),
    },
    {
      key: 'videos',
      label: (
        <span className="flex items-center gap-2">
          <FaVideo />
          Video
        </span>
      ),
    },
    {
      key: 'events',
      label: (
        <span className="flex items-center gap-2">
          <FaCalendarAlt />
          Sự kiện
        </span>
      ),
    },
    {
      key: 'files',
      label: (
        <span className="flex items-center gap-2">
          <FaFileAlt />
          Tệp
        </span>
      ),
    },
  ];

  // Nếu là admin, thêm tab quản trị
  if (isAdmin) {
    items.push({
      key: 'admin',
      label: 'Công cụ quản trị',
    });
  }

  return (
    <div className="bg-white shadow mb-4">
      <div className="max-w-[1920px] mx-auto px-4">
        <Tabs
          activeKey={activeTab}
          onChange={onTabChange}
          items={items}
          className="group-tabs"
        />
      </div>
    </div>
  );
};

export default GroupTabs; 