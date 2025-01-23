import { Link } from "react-router-dom";
import { BiHome, BiUserPlus, BiUser, BiCake, BiCog } from "react-icons/bi";

const SidebarFriend = () => {
  return (
    < div className="bg-white rounded-lg shadow p-4 sticky top-4" >
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
        Bạn bè
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <BiCog className="text-xl" />
        </button>
      </h1>

      <nav className="space-y-1">
        <Link
          href="/friends"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-blue-500 font-semibold"
        >
          <BiHome className="text-2xl" />
          <span>Trang chủ</span>
        </Link>
        <Link
          href="/friends/requests"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <BiUserPlus className="text-2xl" />
          <span>Lời mời kết bạn</span>
        </Link>
        <Link
          href="/friends/suggestions"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <BiUser className="text-2xl" />
          <span>Gợi ý</span>
        </Link>
        <Link
          href="/friends/all"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <BiUser className="text-2xl" />
          <span>Tất cả bạn bè</span>
        </Link>
        <Link
          href="/friends/birthdays"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <BiCake className="text-2xl" />
          <span>Sinh nhật</span>
        </Link>
       
      </nav>
    </div >
  );
};

export default SidebarFriend;
