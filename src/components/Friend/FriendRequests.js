import { Avatar, message, Skeleton } from "antd";
import { useGetFriendRequests, useFriendAction } from "../../hooks/friendHook";
import { getTimeAgo } from "../../utils/time";
import { useState } from "react";

const FriendRequests = () => {
  const { data: requests, isLoading: isLoadingRequests } = useGetFriendRequests();
  const { mutate: sendFriendAction, isPending: isPendingAction } = useFriendAction();
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

  if (isLoadingRequests) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start gap-3">
              <Skeleton.Avatar active size={60} />
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
  }

  if (!requests?.data?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có lời mời kết bạn nào
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests?.data?.map((request) => (
        <div key={request.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start gap-3">
            <Avatar src={request?.sender?.image} size={60} />
            <div className="flex-1">
              <div>
                <h3 className="font-medium">{request?.sender?.name}</h3>
                <p className="text-sm text-gray-500">
                  Đã gửi lời mời {getTimeAgo(request?.created_at)}
                </p>
                {request?.mutual_friends > 0 && (
                  <p className="text-sm text-gray-500">
                    {request?.mutual_friends} bạn chung
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAcceptRequest(request?.sender?.id)}
                  disabled={loadingStates[request?.sender?.id]}
                  className={`px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingStates[request?.sender?.id] ? 'Đang xử lý...' : 'Chấp nhận'}
                </button>
                <button
                  onClick={() => handleRejectRequest(request?.sender?.id)}
                  disabled={loadingStates[request?.sender?.id]}
                  className={`px-6 py-2 bg-gray-200 text-black rounded-md font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingStates[request?.sender?.id] ? 'Đang xử lý...' : 'Từ chối'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests; 