import { FaEllipsisH, FaSearch, FaVideo, FaUserPlus, FaTruckLoading } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useGetFriendSuggestions, useFriendAction } from "../../../hooks/friendHook";
import { contacts } from "../../../data/contact";
import { Skeleton, Spin } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
  
const SidebarRight = () => {
  const { data: suggestions, isLoading: isLoadingSuggestions } = useGetFriendSuggestions();
  const { mutate: sendFriendAction } = useFriendAction();
  const [loadingStates, setLoadingStates] = useState({});

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
                        className="rounded-lg"
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
                          className={`px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="flex items-center gap-1">
                            <FaUserPlus className="w-4 h-4" />
                            Kết bạn {loadingStates[suggestion.id] ?  <Spin indicator={<FaTruckLoading spin />} size="small" /> : ''} 
                          </div>
                        </button>
                        <button 
                          onClick={() => handleRemoveSuggestion(suggestion.id)}
                          disabled={loadingStates[suggestion.id]}
                          className={`px-3 py-1.5 bg-gray-200 text-black rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveSuggestion(suggestion.id)}
                      disabled={loadingStates[suggestion.id]}
                      className={`absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
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
            {contacts.map((contact) => (
              <button
                key={contact.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors w-full"
              >
                <div className="relative">
                  <img
                    src={contact?.avatar}
                    alt={contact.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <span className="font-medium truncate">{contact.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
