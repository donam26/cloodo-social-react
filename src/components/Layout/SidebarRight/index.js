import { FaEllipsisH, FaSearch, FaVideo, FaUserPlus, FaTruckLoading } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useGetFriendSuggestions, useFriendAction } from "../../../hooks/friendHook";
import { Skeleton, Spin } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetConversation } from "../../../hooks/messengerHook";
import { useSelector } from "react-redux";
import ChatPopup from "../Header/Messenger/ChatPopup";
const SidebarRight = () => {
  const { data: suggestions, isLoading: isLoadingSuggestions } = useGetFriendSuggestions();
  const { data: conversations } = useGetConversation();
  const { mutate: sendFriendAction } = useFriendAction();
  const [loadingStates, setLoadingStates] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const userData = useSelector((state) => state?.user?.user);

  const handleAddFriend = (userId) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    sendFriendAction(
      { userId, action: 'request' },
      {
        onSettled: () => {
          setLoadingStates(prev => ({ ...prev, [userId]: false }));
        }
      }
    );
  };

  const handleRemoveSuggestion = (userId) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    sendFriendAction(
      { userId, action: 'cancel' },
      {
        onSettled: () => {
          setLoadingStates(prev => ({ ...prev, [userId]: false }));
        }
      }
    );
  };

  const handleChatClick = (conversation) => {
    setActiveChat(conversation);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
  };

  const getConversationInfo = (conversation) => {
    if (conversation.type === 'private') {
        const otherMember = conversation?.participants?.find(member => member?.id !== conversation?.last_message?.sender?.id);
        return {
            name: otherMember?.name,
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
    return (
      <div className="relative">
        <img
          src={info.image}
          alt={info.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        {conversation.is_online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
    );
  };

  const renderSuggestionSkeleton = () => (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="relative">
          <div className="flex items-start gap-3">
            <Skeleton.Avatar active size={60} shape="square" />
            <div className="flex-1">
              <Skeleton active paragraph={{ rows: 1 }} />
              <div className="flex gap-2 mt-2">
                <Skeleton.Button active size="small" />
                <Skeleton.Button active size="small" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-80px)]">
      {/* Gợi ý kết bạn */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <h2 className="text-gray-500 font-semibold mb-4">Những người bạn có thể biết</h2>
          {isLoadingSuggestions ? (
            renderSuggestionSkeleton()
          ) : (
            <div className="flex flex-col gap-4">
              {suggestions?.data?.map((suggestion) => (
                <div key={suggestion.id} className="relative">
                  <div className="flex items-start gap-3">
                    <Link to={`/profile/${suggestion.id}`}>
                      <img
                        src={suggestion?.image}
                        alt={suggestion.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${suggestion.id}`}>
                        <h3 className="font-medium">{suggestion.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500">{suggestion.mutual_friends} bạn chung</p>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleAddFriend(suggestion.id)}
                          disabled={loadingStates[suggestion.id]}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-1">
                            <FaUserPlus className="w-4 h-4" />
                            Kết bạn {loadingStates[suggestion.id] && <Spin indicator={<FaTruckLoading spin />} size="small" />}
                          </div>
                        </button>
                        <button 
                          onClick={() => handleRemoveSuggestion(suggestion.id)}
                          disabled={loadingStates[suggestion.id]}
                          className="px-3 py-1.5 bg-gray-200 text-black rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveSuggestion(suggestion.id)}
                      disabled={loadingStates[suggestion.id]}
                      className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IoClose className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Người liên hệ */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 font-semibold">Người liên hệ</h2>
            <div className="flex items-center gap-4 text-gray-500">
              <button>
                <FaVideo className="w-4 h-4" />
              </button>
              <button>
                <FaSearch className="w-4 h-4" />
              </button>
              <button>
                <FaEllipsisH className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Danh sách người liên hệ */}
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {conversations?.data?.map((conversation) => {
              const info = getConversationInfo(conversation);
              return (
                <button
                  key={conversation.id}
                  onClick={() => handleChatClick(conversation)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
                >
                  {renderAvatar(conversation)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{info.name}</span>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message.sender.id === userData?.id ? "Bạn: " : ""}
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      {activeChat && (
        <ChatPopup
          conversation={activeChat}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default SidebarRight;
