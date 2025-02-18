import { Avatar, Dropdown, Badge, notification } from "antd";
import { IoNotifications } from "react-icons/io5";
import { getTimeAgo } from "../../../../utils/time";
import "./styles.css";
import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useGetNotification, useMarkAsRead } from "../../../../hooks/notificationHook";
import { Link } from "react-router-dom";
import { useWebSocket } from "../../../../providers/WebSocketProvider";

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'NewCommentNotification':
      return (
        <div className="absolute -right-2 -bottom-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">💬</span>
        </div>
      );
    case 'NewLikeNotification':
      return (
        <div className="absolute -right-2 -bottom-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">👍</span>
        </div>
      );
    case 'NewFriendRequestNotification':
      return (
        <div className="absolute -right-2 -bottom-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">👥</span>
        </div>
      );
    default:
      return null;
  }
};

const NotificationItem = ({ notification }) => {
  const { mutate: markAsRead } = useMarkAsRead();

  const handleClick = () => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
  };

  const getNotificationLink = () => {
    switch (notification.type) {
      case 'NewCommentNotification':
        return `/posts/${notification.data.post_id}`;
      case 'NewLikeNotification':
        return `/posts/${notification.data.post_id}`;
      case 'NewFriendRequestNotification':
        return `/profile/${notification.data.user.id}`;
      default:
        return '#';
    }
  };

  return (
    <Link to={getNotificationLink()} onClick={handleClick}>
      <div className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 relative ${!notification.read_at ? 'bg-blue-50' : ''}`}>
        <div className="relative flex-shrink-0">
          <Avatar src={notification?.data?.user?.image} size={40} />
          <NotificationIcon type={notification?.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{notification?.data?.user?.name}</span>
                {' '}{notification?.data?.message}
              </p>
              <span className="text-xs text-blue-500 font-medium">
                {getTimeAgo(notification?.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const NotificationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'unread', label: 'Chưa đọc' },
  ];

  return (
    <div className="flex gap-1 px-2 my-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            activeTab === tab.id 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const Notification = () => {
  const { data: notifications, refetch } = useGetNotification();
  const [activeTab, setActiveTab] = useState('all');
  const { newNotification, setNewNotification } = useWebSocket();
  const [api, contextHolder] = notification.useNotification();
  const unreadCount = notifications?.data?.filter(notification => !notification.read_at).length || 0;

  // Xử lý hiển thị notification khi có thông báo mới
  useEffect(() => {
    if (newNotification) {
      refetch();
      
      // Hiển thị notification của Antd
      api.info({
        message: newNotification.data.user.name,
        description: newNotification.data.message,
        placement: 'bottomLeft',
        duration: 30,
        icon: (
          <div className="">
            <Avatar src={newNotification.data.user.image} size={40} />
            <NotificationIcon type={newNotification.type} />
          </div>
        ),
        className: 'custom-notification',
        onClick: () => {
          // Xử lý click vào notification
          let link = '#';
          switch (newNotification.type) {
            case 'NewCommentNotification':
              link = `/posts/${newNotification.data.post_id}`;
              break;
            case 'NewLikeNotification':
              link = `/posts/${newNotification.data.post_id}`;
              break;
            case 'NewFriendRequestNotification':
              link = `/profile/${newNotification.data.user.id}`;
              break;
          }
          window.location.href = link;
        }
      });

      setNewNotification(null);
    }
  }, [newNotification, refetch, setNewNotification, api]);

  const filteredNotifications = activeTab === 'all' 
    ? notifications?.data 
    : notifications?.data?.filter(notification => !notification.read_at);

  return (
    <>
      {contextHolder}
      <Dropdown 
        menu={{ items: [] }} 
        placement="bottomRight" 
        arrow={{ pointAtCenter: true }} 
        trigger={['click']}
        overlayClassName="notification-dropdown"
        dropdownRender={() => (
          <div className="notification-dropdown-content shadow-md bg-white rounded-lg w-[360px]">
            <div className="flex justify-between items-center px-3 py-2 border-b">
              <h4 className="text-2xl font-bold">Thông báo</h4>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <BsThreeDots className="w-5 h-5" />
              </button>
            </div>
            <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="max-h-[600px] overflow-y-auto px-1">
              {filteredNotifications?.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                />
              ))}
              {(!filteredNotifications || filteredNotifications.length === 0) && (
                <div className="p-4 text-center text-gray-500">
                  Không có thông báo nào
                </div>
              )}
            </div>
          </div>
        )}
      >
        <Badge count={unreadCount} size="small">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <IoNotifications className="w-6 h-6" />
          </button>
        </Badge>
      </Dropdown>
    </>
  );
};

export default Notification;