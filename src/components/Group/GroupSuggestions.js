import { FaUserPlus } from "react-icons/fa";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { useGetGroupSuggestions } from "../../hooks/groupHook";
const GroupSuggestions = () => {
  const { data: groupSuggestions } = useGetGroupSuggestions();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col gap-4">
        {groupSuggestions?.data?.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`} className="flex items-center gap-3">
            <Avatar
              src={group?.avatar}
              alt={group.name}
              size={56}
              className="rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium">{group.name}</h3>
              <p className="text-sm text-gray-500">
                {group?.members?.length} thành viên · {group?.postsPerDay} bài viết/ngày
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FaUserPlus className="w-4 h-4" />
              <span>Tham gia</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupSuggestions; 