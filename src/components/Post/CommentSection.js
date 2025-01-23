import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

const CommentSection = ({ postId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showReplies, setShowReplies] = useState({});

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: {
        name: "Người dùng",
        avatar: "/images/avatar.jpg",
      },
      content: newComment,
      likes: 0,
      createdAt: "Vừa xong",
    };

    setComments([...comments, comment]);
    setNewComment("");
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
        <img
          src="/images/avatar.jpg"
          alt="User avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
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
        {comments.map((comment) => (
          <div key={comment.id} className="group">
            <div className="flex gap-2">
              <img
                src={comment.user?.avatar}
                alt={comment.user.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="inline-block bg-gray-100 rounded-2xl px-4 py-2">
                  <h4 className="font-semibold text-sm">{comment.user.name}</h4>
                  <p className="text-sm">{comment.content}</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <button className="font-semibold hover:underline">Thích</button>
                  <button className="font-semibold hover:underline">Phản hồi</button>
                  <span>{comment.createdAt}</span>
                </div>

                {/* Like count */}
                {comment.likes > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaThumbsUp className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-xs text-gray-500">{comment.likes}</span>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <>
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="text-sm text-gray-500 mt-1 hover:underline"
                    >
                      {showReplies[comment.id] ? "Ẩn phản hồi" : `Xem ${comment.replies.length} phản hồi`}
                    </button>

                    {showReplies[comment.id] && (
                      <div className="ml-8 mt-2 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <img
                              src={reply.user?.avatar}
                              alt={reply.user.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full"
                            />
                            <div>
                              <div className="inline-block bg-gray-100 rounded-2xl px-4 py-2">
                                <h4 className="font-semibold text-sm">{reply.user.name}</h4>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                              <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                <button className="font-semibold hover:underline">Thích</button>
                                <button className="font-semibold hover:underline">Phản hồi</button>
                                <span>{reply.createdAt}</span>
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