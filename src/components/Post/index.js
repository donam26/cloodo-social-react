import { FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaVideo, FaPhotoVideo, FaSeedling } from "react-icons/fa";
import { useState } from "react";           
import CreatePostModal from "./CreateModal";
import PostImages from "./Images";
import CommentSection from "./CommentSection";
import { posts } from "../../data/posts";
import { Link } from "react-router-dom";

const Post = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showComments, setShowComments] = useState({});

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tạo bài viết mới */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2">
          <img
            src="/images/avatar.jpg"
            alt="User avatar"
            width={40}
            height={40}
            className="w-14 h-auto rounded-full"
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-left text-gray-500 hover:bg-gray-200"
          >
            Bạn đang nghĩ gì?
          </button>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Link className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg" href="/live/setting">
            <FaVideo />
            <span className="font-medium">Video trực tiếp</span>
          </Link>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaPhotoVideo />
            <span className="font-medium">Ảnh/Video</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaSeedling />
            <span className="font-medium">Cảm xúc/Hoạt động</span>
          </button>
        </div>
      </div>

      {/* Danh sách bài viết */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={post?.user?.avatar}
                  alt={post?.user?.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium">{post?.user?.name}</h3>
                  <p className="text-gray-500 text-sm">{post?.createdAt}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FaEllipsisH className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="mt-2">{post?.content}</p>
          </div>

          {/* Images */}
          {post?.images && <PostImages images={post?.images} />}

          {/* Stats */}
          <div className="px-4 py-2 flex items-center justify-between border-b">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <FaThumbsUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-500 text-sm">{post?.stats?.likes}</span>
            </div>
            <div className="flex gap-4 text-gray-500 text-sm">
              <button onClick={() => toggleComments(post?.id)} className="hover:underline">
                {post?.stats?.comments} bình luận
              </button>
              <span>{post?.stats?.shares} chia sẻ</span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-2 flex items-center justify-between">
            <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <FaThumbsUp className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Thích</span>
            </button>
            <button 
              onClick={() => toggleComments(post?.id)}
              className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaComment className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Bình luận</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <FaShare className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Chia sẻ</span>
            </button>
          </div>

          {/* Comments section */}
          {showComments[post.id] && (
            <CommentSection
              postId={post?.id}
              comments={post?.comments || []}
            />
          )}
        </div>
      ))}

      <CreatePostModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Post; 