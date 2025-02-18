import { FaCog, FaCalendarAlt, FaBookmark, FaFlag } from "react-icons/fa";
import { Link } from "react-router-dom";
import { userGroups } from "../../data/groups";
import { Avatar } from "antd";

const GroupSidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Menu */}
      <div className="flex flex-col gap-2">
        <Link
          href="/groups/discover"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaCalendarAlt className="w-5 h-5 text-blue-500" />
          <span>Sự kiện</span>
        </Link>
        <Link
          href="/groups"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaCog className="w-5 h-5 text-blue-500" />
          <span>Cài đặt nhóm</span>
        </Link>
      </div>

      <div className="border-t my-4" />

      {/* Your groups */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold px-2">Nhóm của bạn</h3>
        {userGroups.map((group) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Avatar
              src={group?.avatar}
              alt={group.name}
              size={36}
              className="rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{group.name}</h4>
              <p className="text-xs text-gray-500 truncate">
                {group.newPosts} bài viết mới
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Report */}
      <div className="border-t mt-4 pt-4">
        <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg text-left">
          <FaFlag className="w-5 h-5 text-red-500" />
          <span>Báo cáo nhóm</span>
        </button>
      </div>
    </div>
  );
};

export default GroupSidebar; 