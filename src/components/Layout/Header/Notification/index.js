import { Avatar, Dropdown } from "antd";
import { IoNotifications } from "react-icons/io5";
import { getTimeAgo } from "../../../../utils/time";
import "./styles.css";
import { useState } from "react";
import { notifications } from "../../../../data/notification";
import { BsThreeDots } from "react-icons/bs";

const NotificationItem = ({ notification }) => {
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);

    return (
        <div className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 relative ${!notification.read ? 'bg-blue-50' : ''}`}>
            <div className="relative">
                <Avatar src={notification?.user?.image} size={56} className="flex-shrink-0" />
                {notification.type === 'like' && (
                    <div className="absolute -right-2 -bottom-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">👍</span>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between group">
                    <div className="flex-1">
                        <p className="text-sm text-gray-900">
                            <span className="font-semibold">{notification?.user?.name}</span>
                            {' '}{notification?.content}
                        </p>
                        <span className="text-xs text-blue-500 font-medium">{getTimeAgo(notification?.createdAt)}</span>
                    </div>
                    <button 
                        className="p-2 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsOptionsVisible(!isOptionsVisible)}
                    >
                        <BsThreeDots className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {isOptionsVisible && (
                <div className="absolute right-2 top-12 bg-white shadow-lg rounded-lg py-1 z-10">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
                        Đánh dấu là đã đọc
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
                        Gỡ thông báo này
                    </button>
                </div>
            )}
        </div>
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
    const [activeTab, setActiveTab] = useState('all');
    const unreadCount = notifications.filter(notification => !notification.read).length;
    
    const filteredNotifications = activeTab === 'all' 
        ? notifications 
        : notifications.filter(notification => !notification.read);

    return (
        <>
            <Dropdown 
                menu={{ 
                    items: [],
                }} 
                placement="bottomRight" 
                arrow={{ pointAtCenter: true }} 
                trigger={['click']}
                overlayClassName="notification-dropdown"
                dropdownRender={() => (
                    <div className="notification-dropdown-content shadow-md">
                        <div className="flex justify-between items-center px-3 py-2 border-b">
                            <h4 className="text-2xl font-bold">Thông báo</h4>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <BsThreeDots className="w-5 h-5" />
                            </button>
                        </div>
                        <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />
                        <div className="max-h-[600px] overflow-y-auto">
                            {filteredNotifications.map((notification, index) => (
                                <NotificationItem key={index} notification={notification} />
                            ))}
                        </div>
                    </div>
                )}
            >
                <div className="relative">
                    <button className="p-2 hover:bg-gray-200 rounded-full">
                        <IoNotifications className="w-6 h-6" />
                    </button>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </Dropdown>
        </>
    );
};

export default Notification;