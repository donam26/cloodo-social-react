import { FaEllipsisH, FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { groupPosts } from "../../data/groups";
import { Avatar } from "antd";

const GroupFeed = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Create post */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2">
          <Avatar
            src="/images/avatar.jpg"
            alt="User avatar"
            size={40}
            className="rounded-full"
          />
          <button className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-500 hover:bg-gray-200">
            Viết bài...
          </button>
        </div>
      </div>

      {/* Posts */}
      {groupPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm">
          {/* Post header */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  src={post.group?.avatar}
                  alt={post.group.name}
                  size={40}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{post.group.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Avatar
                      src={post.author?.avatar}
                      alt={post.author.name}
                      size={24}
                      className="rounded-full"
                    />
                    <span>{post.author.name}</span>
                    <span>·</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FaEllipsisH className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="mt-2">{post.content}</p>
          </div>

          {/* Post image */}
          {post.image && (
            <div className="relative aspect-video">
                <Avatar
                src={post.image}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Post stats */}
          <div className="px-4 py-2 flex items-center justify-between border-b">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <FaThumbsUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-500 text-sm">{post.stats.likes}</span>
            </div>
            <div className="flex gap-4 text-gray-500 text-sm">
              <span>{post.stats.comments} bình luận</span>
              <span>{post.stats.shares} chia sẻ</span>
            </div>
          </div>

          {/* Post actions */}
          <div className="px-4 py-2 flex items-center justify-between">
            <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <FaThumbsUp className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Thích</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <FaComment className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Bình luận</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <FaShare className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Chia sẻ</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupFeed; 