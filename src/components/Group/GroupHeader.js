import { Tabs } from "antd";
import { FaSearch, FaPlus } from "react-icons/fa";

const GroupHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Nhóm</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <FaPlus />
            <span>Tạo nhóm mới</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhóm"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={[
          {
            key: "feed",
            label: "Bảng tin của bạn",
          },
          {
            key: "discover",
            label: "Khám phá",
          },
          {
            key: "your-groups",
            label: "Nhóm của bạn",
          },
        ]}
        className="px-4"
      />
    </div>
  );
};

export default GroupHeader; 