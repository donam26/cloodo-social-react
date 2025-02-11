import { FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaVideo, FaPhotoVideo, FaSeedling } from "react-icons/fa";
import { useState } from "react";
import CreatePostModal from "./CreateModal";
import PostImages from "./Images";
import CommentSection from "./CommentSection";
import { Link } from "react-router-dom";
import { useCreateComment, useLikePost } from "../../hooks/postHook.js";
import { Avatar, message } from "antd";
import { getTimeAgo } from "../../utils/time.js";
import { useSelector } from "react-redux";

const Post = ({ post }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: createComment } = useCreateComment();
  const user = useSelector((state) => state?.user?.user);

  const handleCreateComment = (postId, content) => {
    const commentData = {
      postId,
      content
    };

    createComment(commentData, {
      onSuccess: () => {
        message.success("Đã tạo bình luận");
      },
      onError: () => {
        message.error("Có lỗi xảy ra khi tạo bình luận");
      }
    });
  };

  const handleLikePost = (postId, isLiked) => {
    likePost(postId, {
      onSuccess: () => {
        if (isLiked) {
          message.success("Đã bỏ thích bài viết");
        } else {
          message.success("Đã thích bài viết");
        }
      },
      onError: () => {
        message.error("Có lỗi xảy ra khi thích/bỏ thích bài viết");
      }
    });
  };

  const renderPreviewComments = (comments = []) => {
    if (comments.length === 0) return null;

    // Lấy 2 comment mới nhất
    const previewComments = comments.slice(0, 2);

    return (
      <div className="px-4 py-2 border-t">
        {previewComments.map((comment) => (
          <div key={comment?.id} className="group mb-2">
            <div className="flex gap-2">
              <Avatar
                src={comment?.author?.image}
                alt={comment?.author?.name}
                size={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="inline-block bg-gray-100 rounded-2xl px-4 py-2">
                  <h4 className="font-semibold text-sm">{comment?.author?.name}</h4>
                  <p className="text-sm">{comment?.content}</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <button className="font-semibold hover:underline">Thích</button>
                  <button className="font-semibold hover:underline">Phản hồi</button>
                  <span>{getTimeAgo(comment?.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {comments.length > 2 && !showComments && (
          <button 
            onClick={() => setShowComments(true)}
            className="text-sm text-gray-500 hover:underline"
          >
            Xem thêm bình luận...
          </button>
        )}
      </div>
    );
  };

  if (!post) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${post?.author?.id}`}>
              <Avatar
                src={post?.author?.image}
                alt={post?.author?.name}
                size={40}
                className="rounded-full"
              />
            </Link>
            <div>
              <Link to={`/profile/${post?.author?.id}`}>
                <h3 className="font-medium">{post?.author?.name}</h3>
              </Link>
              <p className="text-gray-500 text-sm">{getTimeAgo(post?.created_at)}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaEllipsisH className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="mt-2">{post?.content}</p>
      </div>

      {/* Images */}
      {post?.images?.length > 0 && <PostImages images={post?.images?.map(img => img.image)} />}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between border-b">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <FaThumbsUp className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-500 text-sm">{post?.reactions?.total}</span>
        </div>
        <div className="flex gap-4 text-gray-500 text-sm">
          <button onClick={() => setShowComments(!showComments)} className="hover:underline">
            {post?.total_comments} bình luận
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 flex items-center justify-between">
        <button 
          onClick={() => handleLikePost(post?.id, post?.reactions?.current_user_reacted)}
          className={`flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg ${post?.reactions?.current_user_reacted ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <FaThumbsUp className="w-5 h-5" />
          <span className="font-medium">Thích</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
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

      {/* Preview Comments */}
      {!showComments && renderPreviewComments(post?.comments)}

      {/* Full Comments Section */}
      {showComments && (
        <CommentSection
          postId={post?.id}
          comments={post?.comments || []}
          onCreateComment={handleCreateComment}
        />
      )}
    </div>
  );
};

export default Post; 