import {
  FaEllipsisH,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaLock,
  FaGlobe,
  FaChevronRight,
  FaUserFriends,
} from "react-icons/fa";
import { useState } from "react";
import PostImages from "./Images";
import CommentSection from "./CommentSection";
import { Link } from "react-router-dom";
import {
  useCreateComment,
  useLikePost,
  useDeletePost,
  useUpdatePost,
} from "../../hooks/postHook.js";
import {
  Avatar,
  message,
  Skeleton,
  Modal,
  Dropdown,
  Input,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getTimeAgo } from "../../utils/time.js";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Post = ({ post, isLoading }) => {
  const [showComments, setShowComments] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState("public");
  const [editFileList, setEditFileList] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const userData = useSelector((state) => state?.user?.user);

  const { mutate: likePost } = useLikePost();
  const { mutate: createComment } = useCreateComment();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  const isAuthor = post?.author?.id === userData?.user?.id;

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
      content,
    };

    createComment(commentData, {
      onSuccess: () => {
        message.success("Đã tạo bình luận");
      },
      onError: () => {
        message.error("Có lỗi xảy ra khi tạo bình luận");
      },
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
      },
    });
  };

  const handleEditPost = () => {
    setEditContent(post?.content);
    setEditStatus(post?.status || "public");
    // Reset danh sách ảnh đã xóa
    setRemovedImages([]);
    // Chuyển đổi ảnh từ post sang định dạng của Upload
    setEditFileList(
      post?.images?.map((img) => ({
        uid: img.uuid,
        name: `image-${img.uuid}`,
        status: 'done',
        url: img.image,
        isExisting: true, // Đánh dấu là ảnh đã tồn tại
      })) || []
    );
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!editContent.trim()) {
      message.error("Nội dung bài viết không được để trống");
      return;
    }

    try {
      // Xử lý ảnh mới (nếu có)
      const newImages = editFileList.filter(file => !file.isExisting);
      const base64Images = await Promise.all(
        newImages.map(async (file) => {
          if (file.originFileObj) {
            return await getBase64(file.originFileObj);
          }
          return null;
        })
      );

      // Lọc bỏ các giá trị null
      const validImages = base64Images.filter(img => img !== null);

      const postData = {
        content: editContent,
        status: editStatus,
        images: validImages,
      };

      // Thêm danh sách ảnh đã xóa nếu có
      if (removedImages.length > 0) {
        postData.removed_images = removedImages;
      }

      updatePost(
        {
          id: post?.id,
          data: postData,
        },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setRemovedImages([]);
          },
        }
      );
    } catch (error) {
      message.error("Có lỗi xảy ra khi xử lý ảnh!");
      console.error("Error processing images:", error);
    }
  };

  const handleEditFileChange = ({ fileList: newFileList, file }) => {
    // Nếu là xóa file
    if (file.status === 'removed') {
      // Nếu là ảnh đã tồn tại, thêm vào danh sách ảnh cần xóa
      if (file.isExisting) {
        setRemovedImages(prev => [...prev, file.uid]);
      }
    }

    // Giới hạn kích thước file (ví dụ: 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const updatedFileList = newFileList.map((file) => {
      if (file.size && file.size > MAX_FILE_SIZE) {
        file.status = "error";
        file.error = "File quá lớn! Vui lòng chọn file nhỏ hơn 5MB";
      }
      return file;
    });
    setEditFileList(updatedFileList);
  };

  const handleDeletePost = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deletePost(post?.id, {
      onSuccess: () => {
        message.success("Đã xóa bài viết thành công");
        setIsDeleteModalOpen(false);
      },
    });
  };

  const menuItems = [
    ...(isAuthor
      ? [
          {
            key: "edit",
            label: "Chỉnh sửa bài viết",
            onClick: handleEditPost,
          },
          {
            key: "delete",
            label: "Xóa bài viết",
            danger: true,
            onClick: handleDeletePost,
          },
        ]
      : []),
    {
      key: "report",
      label: "Báo cáo bài viết",
      danger: true,
    },
  ];

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
                  <h4 className="font-semibold text-sm">
                    {comment?.author?.name}
                  </h4>
                  <p className="text-sm">{comment?.content}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <button className="font-semibold hover:underline">
                    Thích
                  </button>
                  <button className="font-semibold hover:underline">
                    Phản hồi
                  </button>
                  <span className="text-gray-500 text-xs">
                    {getTimeAgo(comment?.created_at)}
                  </span>
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

  const statusOptions = [
    {
      key: "public",
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FaGlobe className="text-gray-600" />
          <div>
            <p className="font-medium">Công khai</p>
            <p className="text-xs text-gray-500">
              Mọi người đều thấy bài viết này
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "friends",
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FaUserFriends className="text-gray-600" />
          <div>
            <p className="font-medium">Bạn bè</p>
            <p className="text-xs text-gray-500">
              Chỉ bạn bè mới thấy bài viết này
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "private",
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FaLock className="text-gray-600" />
          <div>
            <p className="font-medium">Chỉ mình tôi</p>
            <p className="text-xs text-gray-500">
              Chỉ bạn mới thấy bài viết này
            </p>
          </div>
        </div>
      ),
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "public":
        return <FaGlobe className="text-gray-600 w-4 h-4" />;
      case "friends":
        return <FaUserFriends className="text-gray-600 w-4 h-4" />;
      case "private":
        return <FaLock className="text-gray-600 w-4 h-4" />;
      default:
        return <FaGlobe className="text-gray-600 w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "public":
        return "Công khai";
      case "friends":
        return "Bạn bè";
      case "private":
        return "Chỉ mình tôi";
      default:
        return "Công khai";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            <Link to={`/profile/${post?.author?.id}`} className="flex-shrink-0">
              <Avatar
                src={post?.author?.image}
                alt={post?.author?.name}
                size={40}
                className="rounded-full"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="leading-4">
                <div className="flex items-center flex-wrap">
                  <Link
                    to={`/profile/${post?.author?.id}`}
                    className="font-semibold text-[15px] hover:underline"
                  >
                    {post?.author?.name}
                  </Link>
                  {post?.group && (
                    <div className="flex items-center">
                      <FaChevronRight className="mx-1 w-2.5 h-2.5 text-gray-500" />
                      <Link
                        to={`/groups/${post?.group?.id}`}
                        className="font-semibold text-[15px] hover:underline"
                      >
                        {post?.group?.name}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-[13px] text-gray-500 mt-1">
                  <Link to={`/posts/${post?.id}`} className="hover:underline">
                    {getTimeAgo(post?.created_at)}
                  </Link>
                  <span className="mx-1">•</span>
                  {post?.status === "private" ? (
                    <div className="flex items-center gap-1">
                      <FaLock className="w-3 h-3" />
                      <span>Riêng tư</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <FaGlobe className="w-3 h-3" />
                      <span>Công khai</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaEllipsisH className="w-5 h-5 text-gray-500" />
              </button>
            </Dropdown>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 text-[15px]">
          <p className="whitespace-pre-line">{post?.content}</p>
        </div>
      </div>

      {/* Images */}
      {post?.images?.length > 0 && (
        <div className="px-4">
          <PostImages images={post?.images?.map((img) => img.image)} />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between border-t border-b border-gray-200 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-[18px] bg-blue-500 rounded-full flex items-center justify-center">
            <FaThumbsUp className="w-[10px] h-[10px] text-white" />
          </div>
          <span className="text-[15px] text-gray-500">
            {post?.reactions?.total || 0}
          </span>
        </div>
        <div className="flex gap-4 text-[15px] text-gray-500">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {post?.total_comments || 0} bình luận
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button
          onClick={() =>
            handleLikePost(post?.id, post?.reactions?.current_user_reacted)
          }
          className={`flex-1 flex items-center justify-center gap-2 py-2 mx-2 rounded-lg hover:bg-gray-100 transition-colors ${
            post?.reactions?.current_user_reacted
              ? "text-blue-500"
              : "text-gray-500"
          }`}
        >
          <FaThumbsUp className="w-[18px] h-[18px]" />
          <span className="font-medium text-[15px]">Thích</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 mx-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <FaComment className="w-[18px] h-[18px]" />
          <span className="font-medium text-[15px]">Bình luận</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 mx-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <FaShare className="w-[18px] h-[18px]" />
          <span className="font-medium text-[15px]">Chia sẻ</span>
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

      {/* Edit Post Modal */}
      <Modal
        title="Chỉnh sửa bài viết"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdatePost}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isUpdating}
        width={600}
      >
        <div className="py-4">
          <div className="mb-4">
            <Dropdown
              menu={{
                items: statusOptions,
                onClick: ({ key }) => setEditStatus(key),
              }}
              trigger={["click"]}
            >
              <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1">
                {getStatusIcon(editStatus)}
                <span className="text-sm">{getStatusText(editStatus)}</span>
              </button>
            </Dropdown>
          </div>

          <TextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Nội dung bài viết"
            autoSize={{ minRows: 3, maxRows: 6 }}
            className="w-full mb-4"
          />

          <Upload
            listType="picture-card"
            fileList={editFileList}
            onChange={handleEditFileChange}
            maxCount={4}
            multiple
            accept="image/*"
            beforeUpload={() => false}
          >
            {editFileList.length >= 4 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Thêm ảnh</div>
              </div>
            )}
          </Upload>
        </div>
      </Modal>

      {/* Delete Post Modal */}
      <Modal
        title="Xóa bài viết"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleConfirmDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
          loading: isDeleting,
        }}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
      </Modal>
    </div>
  );
};

export default Post;
