import { FaSearch, FaEllipsisH, FaVideo, FaEdit } from "react-icons/fa";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../../utils/time";
import { useSelector } from "react-redux";

const ChatList = ({ conversations, selectedConversation }) => {
  const userData = useSelector((state) => state?.user?.user);

  const getConversationInfo = (conversation) => {
    if (conversation.type === 'private') {
      const otherMember = conversation?.participants?.find(
        member => member?.id !== userData?.user?.id
      );
      return {
        name: otherMember?.name || 'Người dùng',
        image: otherMember?.image
      };
    } else {
      return {
        name: conversation.name,
        image: conversation.image,
        isGroup: true,
        firstLetter: conversation.name ? conversation.name.charAt(0).toUpperCase() : 'G'
      };
    }
  };

  const renderAvatar = (conversation) => {
    const info = getConversationInfo(conversation);
    
    if (conversation.type === 'private') {
      return <Avatar src={info.image} size={56} />;
    } else {
      return info.image ? (
        <Avatar src={info.image} size={56} />
      ) : (
        <Avatar size={56} className="bg-blue-500 flex items-center justify-center">
          {info.firstLetter}
        </Avatar>
      );
    }
  };

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
        <div className="space-y-1">
          {conversations?.map((conversation) => {
            const info = getConversationInfo(conversation);
            const isSelected = selectedConversation?.id === conversation.id;
            const isCurrentUserLastMessage = conversation?.last_message?.sender?.id === userData?.user?.id;

            return (
              <Link 
                key={conversation.id} 
                to={`/messenger/${conversation.id}`}
                className={`flex items-center gap-3 p-2 hover:bg-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}
              >
                {renderAvatar(conversation)}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[15px] text-gray-900">
                      {info.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(conversation?.last_message?.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {isCurrentUserLastMessage ? 'Bạn: ' : ''}{conversation?.last_message?.content}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChatList; 