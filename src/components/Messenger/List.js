import { FaSearch, FaEllipsisH, FaVideo, FaEdit } from "react-icons/fa";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../../utils/time";

const ChatList = ({ conversations, selectedConversation }) => {
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
        {conversations?.map((conversation) => (
          <Link
            key={conversation?.uuid}
            to={`/messenger/${conversation?.uuid}`}
            className={`flex items-center gap-3 w-full p-2 hover:bg-gray-100 relative
              ${selectedConversation?.uuid === conversation?.uuid ? "bg-blue-50" : ""}`}
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={conversation?.last_message?.sender?.image}
                size={56}
                className="rounded-full"
              />
            </div>

            {/* Chat info */}
            <div className="flex-1 text-left">
              <h3 className="font-semibold">{conversation?.last_message?.sender?.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 truncate">
                  {conversation?.last_message?.content}
                </p>
                <span className="text-xs text-gray-500">
                  · {getTimeAgo(conversation?.last_message?.created_at)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ChatList; 