import { FaSearch, FaEllipsisH, FaVideo, FaEdit } from "react-icons/fa";
import { Avatar } from "antd";

const ChatList = ({ chats, selectedChat, onSelectChat }) => {
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Chat</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FaEllipsisH className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FaVideo className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FaEdit className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`flex items-center gap-3 w-full p-2 hover:bg-gray-100 relative
              ${selectedChat.id === chat.id ? "bg-blue-50" : ""}`}
          >
            {/* Avatar */}
            <div className="relative">
                <Avatar
                src={chat?.avatar}
                alt={chat.name}
                size={56}
                className="rounded-full"
              />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Chat info */}
            <div className="flex-1 text-left">
              <h3 className="font-semibold">{chat.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage.content}
                </p>
                <span className="text-xs text-gray-500">
                  · {chat.lastMessage.time}
                </span>
              </div>
            </div>

            {/* Unread indicator */}
            {chat.unreadCount > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {chat.unreadCount}
                  </span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default ChatList; 