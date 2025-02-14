import { FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaLock, FaGlobe } from "react-icons/fa";
import { useState } from "react";
import PostImages from "./Images";
import CommentSection from "./CommentSection";
import { Link } from "react-router-dom";
import { useCreateComment, useLikePost } from "../../hooks/postHook.js";
import { Avatar, message, Skeleton } from "antd";
import { getTimeAgo } from "../../utils/time.js";

const Post = ({ post, isLoading }) => {
  const [showComments, setShowComments] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: createComment } = useCreateComment();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Skeleton.Image active size={40} />
            <div className="flex flex-col gap-1">
              <Skeleton.Input active size="small" style={{ width: 120 }} />
              <Skeleton.Input active size="small" style={{ width: 80 }} />
            </div>
          </div>
        </div>
        <Skeleton active paragraph={{ rows: 2 }} />
        <div className="mt-4">
          <Skeleton.Image active />
        </div>
        <div className="flex justify-between mt-4">
          <Skeleton.Button active size="small" style={{ width: 100 }} />
          <Skeleton.Button active size="small" style={{ width: 100 }} />
          <Skeleton.Button active size="small" style={{ width: 100 }} />
        </div>
      </div>
    );
  }

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
                  <span className="text-gray-500 text-xs">{getTimeAgo(comment?.created_at)}</span>
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
              <div className="flex items-center gap-1">
                <Link to={`/posts/${post?.id}`}>
                  <p className="text-gray-500 text-xs">{getTimeAgo(post?.created_at)}</p>
                </Link>
                <span className="text-gray-500 mx-1">•</span>
                <div className="flex items-center gap-1 text-gray-500">
                  {post?.status === 'private' ? (
                    <>
                      <FaLock className="w-3 h-3" />
                      <span className="text-xs">Riêng tư</span>
                    </>
                  ) : (
                    <>
                      <FaGlobe className="w-3 h-3" />
                      <span className="text-xs">Công khai</span>
                    </>
                  )}
                </div>
              </div>
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