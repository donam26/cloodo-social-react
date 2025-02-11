import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useDeleteComment } from "../../hooks/postHook";
import { useSelector } from "react-redux";
import { Avatar, message } from "antd";
import { getTimeAgo } from "../../utils/time";

const CommentSection = ({ postId, comments, onCreateComment }) => {
  const [newComment, setNewComment] = useState("");
  const [showReplies, setShowReplies] = useState({});

  const { mutate: deleteComment } = useDeleteComment();
  const user = useSelector((state) => state?.user?.user);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onCreateComment(postId, newComment.trim());
    
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    deleteComment({ postId, commentId }, {
      onSuccess: () => {
        message.success("Đã xóa bình luận");
      },
      onError: () => {
        message.error("Có lỗi xảy ra khi xóa bình luận");
      }
    });
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <div className="px-4 py-2">
      {/* Form bình luận */}
      <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
        <Avatar 
          src={user?.user?.image} 
          alt={user?.user?.name}
          size={32}
          className="rounded-full"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment?.id} className="group">
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
                  {comment?.author?.id === user?.user?.id && (
                    <button 
                      onClick={() => handleDeleteComment(comment?.id)}
                      className="font-semibold hover:underline text-red-500"
                    >
                      Xóa
                    </button>
                  )}
                  <span>{getTimeAgo(comment?.created_at)}</span>
                </div>

                {/* Like count */}
                {comment?.likes > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaThumbsUp className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-xs text-gray-500">{comment?.likes}</span>
                  </div>
                )}

                {/* Replies */}
                {comment?.replies?.length > 0 && (
                  <>
                    <button
                      onClick={() => toggleReplies(comment?.id)}
                      className="text-sm text-gray-500 mt-1 hover:underline"
                    >
                      {showReplies[comment?.id] ? "Ẩn phản hồi" : `Xem ${comment?.replies?.length} phản hồi`}
                    </button>

                    {showReplies[comment?.id] && (
                      <div className="ml-8 mt-2 space-y-4">
                        {comment?.replies?.map((reply) => (
                          <div key={reply?.id} className="flex gap-2">
                            <Avatar
                              src={reply?.author?.image}
                              alt={reply?.author?.name}
                              size={24}
                              className="rounded-full"
                            />
                            <div>
                              <div className="inline-block bg-gray-100 rounded-2xl px-4 py-2">
                                <h4 className="font-semibold text-sm">{reply?.author?.name}</h4>
                                <p className="text-sm">{reply?.content}</p>
                              </div>
                              <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                <button className="font-semibold hover:underline">Thích</button>
                                <button className="font-semibold hover:underline">Phản hồi</button>
                                {reply?.author?.id === user?.id && (
                                  <button 
                                    onClick={() => handleDeleteComment(reply?.id)}
                                    className="font-semibold hover:underline text-red-500"
                                  >
                                    Xóa
                                  </button>
                                )}
                                <span>{getTimeAgo(reply?.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection; 