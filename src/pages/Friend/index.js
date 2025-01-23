import { useState } from "react";
import { mockFriendRequests } from "../../data/friend-requests";
import FriendCard from "../../components/Friend/FriendCard";
import { Link } from "react-router-dom";
const FriendsPage = () => {
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);

  const handleConfirm = (id) => {
    setFriendRequests(
      friendRequests.map((request) =>
        request.id === id ? { ...request, status: "confirmed" } : request
      )
    );
  };

  const handleDelete = (id) => {
    setFriendRequests(
      friendRequests.map((request) =>
        request.id === id ? { ...request, status: "deleted" } : request
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Lời mời kết bạn</h2>
              <Link
                href="/friends/requests"
                className="text-blue-500 hover:underline"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friendRequests
                .filter((request) => request.status === "pending")
                .map((request) => (
                  <FriendCard
                    key={request.id}
                    request={request}
                    onConfirm={handleConfirm}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage; 