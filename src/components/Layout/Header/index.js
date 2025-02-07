import { FaBell, FaFacebookMessenger, FaHome, FaUserFriends, FaVideo, FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoGridSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Search from "./Search";
import { useSelector } from "react-redux";
import { Dropdown, Space } from "antd";
import { notifications } from "../../../data/notification";
import { useContext, useEffect, useState } from "react";

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

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

// Đảm bảo rằng notifications chứa các mục thông báo với cấu trúc phù hợp
const notificationItems = notifications.map((notification, index) => ({
  key: index.toString(),
  label: (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md">
      <span className="text-sm">{notification.title}</span>
    </div>
  ),
}));

const Header = () => {
  const userData = useSelector((state) => state?.user?.user);
  const [echoInstance, setEchoInstance] = useState(null);
  // Thêm trạng thái để theo dõi số lượng thông báo chưa đọc
  const unreadNotifications = notifications.filter(notification => !notification.read).length;

  useEffect(() => {
    const pusher = new Pusher('4geu7tpxuskfouaezc8x', {
      cluster: 'mt1',
      wsHost: '127.0.0.1',
      wsPort: 6001,
      forceTLS: false,
      encrypted: false,
      enabledTransports: ['ws', 'wss'],
      disableStats: true
    });
    const channel = pusher.subscribe('conversation.1');

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Subscribed to conversation.1 channel');
    });

    channel.bind('App\\Events\\MessageSent', (data) => {
      console.log('New WhatsApp message received:', data);
    });

    // Cleanup function
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

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
            <Dropdown menu={{ items: notificationItems }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={['click']}>

              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FaFacebookMessenger className="w-6 h-6" />
              </button>
            </Dropdown>
            <Dropdown menu={{ items: notificationItems }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={['click']}>
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <FaBell className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </Dropdown>
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
