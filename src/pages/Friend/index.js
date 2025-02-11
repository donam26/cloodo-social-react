import { Tabs, Skeleton } from "antd";
import { useGetFriends, useGetFriendRequests, useFriendAction, useGetFriendSuggestions } from "../../hooks/friendHook";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends, FaUserPlus, FaEllipsisH, FaUsersCog } from "react-icons/fa";

const FriendsPage = () => {
  const { data: friends, isLoading: isLoadingFriends } = useGetFriends();
  const { data: requests, isLoading: isLoadingRequests } = useGetFriendRequests();
  const { data: suggestions, isLoading: isLoadingSuggestions } = useGetFriendSuggestions();
  const { mutate: sendFriendAction } = useFriendAction();
  const [loadingStates, setLoadingStates] = useState({});

  const handleAcceptRequest = (userId) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    sendFriendAction(
      { userId, action: 'accept' },
      {
        onSettled: () => {
          setLoadingStates(prev => ({ ...prev, [userId]: false }));
        }
      }
    );
  };

  const handleRejectRequest = (userId) => {
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

  const handleUnfriend = (userId) => {
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

  const handleBlock = (userId) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    sendFriendAction(
      { userId, action: 'block' },
      {
        onSettled: () => {
          setLoadingStates(prev => ({ ...prev, [userId]: false }));
        }
      }
    );
  };

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

  const renderFriendSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <Skeleton.Avatar active size={80} />
            <div className="flex-1">
              <Skeleton active paragraph={{ rows: 2 }} />
              <div className="flex gap-2 mt-3">
                <Skeleton.Button active size="large" />
                <Skeleton.Button active size="large" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <FaUserFriends className="w-5 h-5" />
          Tất cả bạn bè
        </span>
      ),
      children: (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Bạn bè ({friends?.data?.length || 0})</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bạn bè"
                className="px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {isLoadingFriends ? (
            renderFriendSkeleton()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends?.data?.map((friend) => (
                <div key={friend.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={friend.image}
                      alt={friend.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.mutual_friends} bạn chung</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleUnfriend(friend.id)}
                          disabled={loadingStates[friend.id]}
                          className="px-4 py-2 bg-gray-200 text-black rounded-md font-medium hover:bg-gray-300 disabled:opacity-50"
                        >
                          {loadingStates[friend.id] ? 'Đang xử lý...' : 'Hủy kết bạn'}
                        </button>
                        <button
                          onClick={() => handleBlock(friend.id)}
                          disabled={loadingStates[friend.id]}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <FaEllipsisH className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <FaUserPlus className="w-5 h-5" />
          Lời mời kết bạn
          {requests?.data?.length > 0 && (
            <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
              {requests.data.length}
            </span>
          )}
        </span>
      ),
      children: (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Lời mời kết bạn</h2>
          </div>

          {isLoadingRequests ? (
            renderFriendSkeleton()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests?.data?.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={request.sender.image}
                      alt={request.sender.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{request.sender.name}</h3>
                      <p className="text-sm text-gray-500">{request.mutual_friends} bạn chung</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAcceptRequest(request.sender.id)}
                          disabled={loadingStates[request.sender.id]}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:opacity-50"
                        >
                          {loadingStates[request.sender.id] ? 'Đang xử lý...' : 'Chấp nhận'}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.sender.id)}
                          disabled={loadingStates[request.sender.id]}
                          className="px-4 py-2 bg-gray-200 text-black rounded-md font-medium hover:bg-gray-300 disabled:opacity-50"
                        >
                          {loadingStates[request.sender.id] ? 'Đang xử lý...' : 'Từ chối'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <FaUsersCog className="w-5 h-5" />
          Gợi ý kết bạn
        </span>
      ),
      children: (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Gợi ý kết bạn</h2>
          </div>

          {isLoadingSuggestions ? (
            renderFriendSkeleton()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions?.data?.map((suggestion) => (
                <Link to={`/profile/${suggestion.id}`} key={suggestion.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={suggestion.image}
                      alt={suggestion.name}
                      className="w-32 h-32 rounded-lg object-cover mb-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{suggestion.name}</h3>
                      {suggestion.mutual_friends > 0 && (
                        <p className="text-sm text-gray-500 mb-3">
                          {suggestion.mutual_friends} bạn chung
                        </p>
                      )}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAddFriend(suggestion.id)}
                          disabled={loadingStates[suggestion.id]}
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <FaUserPlus className="w-4 h-4" />
                          {loadingStates[suggestion.id] ? 'Đang xử lý...' : 'Thêm bạn bè'}
                        </button>
                        <button
                          onClick={() => handleRemoveSuggestion(suggestion.id)}
                          disabled={loadingStates[suggestion.id]}
                          className="w-full px-4 py-2 bg-gray-200 text-black rounded-md font-medium hover:bg-gray-300 disabled:opacity-50"
                        >
                          {loadingStates[suggestion.id] ? 'Đang xử lý...' : 'Xóa gợi ý'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {suggestions?.data?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có gợi ý kết bạn nào
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[1200px] mx-auto">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default FriendsPage; 