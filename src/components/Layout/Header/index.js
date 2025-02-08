import { FaHome, FaUserFriends, FaVideo, FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoGridSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Search from "./Search";
import { useSelector } from "react-redux";
import { Dropdown, Space } from "antd";
import ListMessenger from "./Messenger";
import Notification from "./Notification";

const items = [
  {
    key: '1',
    label: (
      <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md">
        <FaUserCircle className="w-6 h-6 text-blue-500 mr-2" />
        Profile
      </Link>
    ),
  },
  {
    key: '2',
    label: (
      <Link to="/setting" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md">
        <FaCog className="w-6 h-6 text-blue-500 mr-2" />
        Setting
      </Link>
    ),
  },
  {
    key: '3',
    label: (
      <Link to="/logout" className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md">
        <FaSignOutAlt className="w-6 h-6 text-red-500 mr-2" />
        Logout
      </Link>
    ),
  },
];


const Header = () => {
  const userData = useSelector((state) => state?.user?.user);

    return (
      <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <img
                src="https://cloodo.com/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </Link>
            <Search />
          </div>

          {/* Middle section - Navigation */}
          <div className="flex items-center justify-center flex-1 h-full">
            <nav className="flex h-full">
              <Link
                href="/"
                className="flex items-center px-10 h-full border-b-4 border-blue-500 hover:bg-gray-100"
              >
                <FaHome className="w-6 h-6 text-blue-500" />
              </Link>
              <Link
                href="/friends"
                className="flex items-center px-10 h-full border-blue-500 hover:bg-gray-100"
              >
                <FaUserFriends className="w-6 h-6 text-blue-500" />
              </Link>
              <Link
                href="/videos"
                className="flex items-center px-10 h-full  border-blue-500 hover:bg-gray-100"
              >
                <FaVideo className="w-6 h-6 text-blue-500" />
              </Link>
              <Link
                href="/groups"
                className="flex items-center px-10 h-full  border-blue-500 hover:bg-gray-100"
              >
                <MdGroups2 className="w-6 h-6 text-blue-500" />
              </Link>
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <IoGridSharp className="w-6 h-6" />
            </button>
            <ListMessenger />
            <Notification />
            <Space direction="vertical">
              <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={['click']}>
                <button className="ml-2">
                  <img
                    src={userData?.user?.avatar || "/images/avatar.jpg"}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                </button>
              </Dropdown>
            </Space>
          </div>
        </div>
      </header>
    );
  };

  export default Header;
