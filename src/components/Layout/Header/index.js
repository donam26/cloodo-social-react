import { FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";
import { IoGridSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Dropdown, Space } from "antd";
import ListMessenger from "./Messenger";
import Notification from "./Notification";
import { logoutUser } from "../../../services/authApi";

const Header = () => {
  const userData = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate('/login');
  };

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
        <div 
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md cursor-pointer"
        >
          <FaSignOutAlt className="w-6 h-6 text-red-500 mr-2" />
          Đăng xuất
        </div>
      ),
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50 shadow-gray-300">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img
              src="https://media-cloodo.s3.amazonaws.com/Icon_2d75277193.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </Link>
          <Search />
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
                <Avatar
                  src={userData?.user?.image}
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
