import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetPostById, useCreateComment, useLikePost } from "../../hooks/postHook";
import { Skeleton, Avatar, message } from "antd";
import { FaThumbsUp, FaComment, FaShare, FaLock, FaGlobe, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { getTimeAgo } from "../../utils/time";
import CommentSection from "../../components/Post/CommentSection";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useGetPostById(id);
  const [showComments, setShowComments] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { mutate: likePost } = useLikePost();
  const { mutate: createComment } = useCreateComment();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-4 w-full max-w-[500px]">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (!post?.data) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Không tìm thấy bài viết</p>
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

  const handleClose = () => {
    navigate(-1);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? post.data.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === post.data.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center ">
      {/* Close button */}
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
      >
        <FaTimes size={24} />
      </button>

      <div className="w-full h-full md:h-[90vh] md:w-[90vw] max-w-[1400px] flex rounded-xl">
        {/* Phần ảnh bên trái */}
        {post.data?.images?.length > 0 ? (
          <div className="relative hidden md:flex w-[65%] items-center justify-center bg-black">
            <img
              src={post.data.images[currentImageIndex].image}
              alt=""
              className="max-h-full max-w-full object-contain"
            />

            {/* Navigation buttons */}
            {post.data.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        ) : null}

        {/* Phần thông tin và tương tác bên phải */}
        <div 
          className={`${
            post.data?.images?.length > 0 ? 'w-full md:w-[35%]' : 'w-full max-w-3xl mx-auto'
          } bg-white h-full flex flex-col rounded-xl`}
        >
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.data?.author?.id}`}>
                  <Avatar
                    src={post.data?.author?.image}
                    alt={post.data?.author?.name}
                    size={40}
                    className="rounded-full"
                  />
                </Link>
                <div>
                  <Link to={`/profile/${post.data?.author?.id}`}>
                    <h3 className="font-semibold hover:underline">{post.data?.author?.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1">
                    <p className="text-gray-500 text-xs">{getTimeAgo(post.data?.created_at)}</p>
                    <span className="text-gray-500 mx-1">•</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      {post.data?.status === 'private' ? (
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
            </div>
            <p className="mt-4 text-[15px]">{post.data?.content}</p>
          </div>

          {/* Mobile image */}
          {post.data?.images?.length > 0 && (
            <div className="md:hidden w-full">
              <img
                src={post.data.images[currentImageIndex].image}
                alt=""
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Stats */}
          <div className="px-4 py-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <FaThumbsUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-500 text-sm">{post.data?.reactions?.total || 0}</span>
            </div>
            <div className="flex gap-4 text-gray-500 text-sm">
              <span>{post.data?.total_comments || 0} bình luận</span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-1 flex items-center justify-between border-b">
            <button 
              onClick={() => handleLikePost(post.data?.id, post.data?.reactions?.current_user_reacted)}
              className={`flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                post.data?.reactions?.current_user_reacted ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <FaThumbsUp className="w-5 h-5" />
              <span className="font-medium">Thích</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaComment className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Bình luận</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaShare className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Chia sẻ</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto">
            <CommentSection
              postId={post.data?.id}
              comments={post.data?.comments || []}
              onCreateComment={handleCreateComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;