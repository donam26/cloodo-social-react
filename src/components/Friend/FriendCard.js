import { Avatar } from "antd";

const FriendCard = ({
  request,
  onConfirm,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Avatar
            src={request?.avatar}
            alt={request.name}
            size={96}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg hover:underline cursor-pointer">
            {request.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {request.mutualFriends} bạn chung
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onConfirm(request.id)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-semibold"
            >
              Xác nhận
            </button>
            <button
              onClick={() => onDelete(request.id)}
              className="flex-1 bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendCard; 