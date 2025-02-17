import { Modal, Upload, Button, Input, Avatar, Dropdown, message } from "antd";
import { FaGlobeAsia, FaLock, FaUserFriends } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { useCreatePost } from "../../hooks/postHook";
import { useForm, Controller } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreatePostModal = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const { groupId: routeGroupId } = useParams(); 

  const { mutate: createPost, isPending: isPendingCreatePost } = useCreatePost();
  const userData = useSelector((state) => state?.user?.user);

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      content: "",
      privacy: "public",
      fileList: [],
      groupId: routeGroupId || null, 
    },
  });

  const fileList = watch("fileList");

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Giới hạn kích thước file (ví dụ: 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const updatedFileList = newFileList.map((file) => {
      if (file.size && file.size > MAX_FILE_SIZE) {
        file.status = "error";
        file.error = "File quá lớn! Vui lòng chọn file nhỏ hơn 5MB";
      }
      return file;
    });
    setValue("fileList", updatedFileList);
  };

  const resetForm = () => {
    reset({
      content: "",
      privacy: "public",
      fileList: [],
    });
    setIsCreatePostModalOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const images = await Promise.all(
        data.fileList.map(async (file) => {
          if (file.originFileObj) {
            return await getBase64(file.originFileObj);
          }
          return file.url;
        })
      );

      const postData = {
        content: data.content,
        privacy: data.privacy,
        images,
      };

      createPost(postData, {
        onSuccess: () => {
          message.success("Đăng bài viết thành công!");
          resetForm();
        },
        onError: (error) => {
          message.error("Có lỗi xảy ra khi đăng bài!");
          console.error("Error creating post:", error);
        },
      });
    } catch (error) {
      message.error("Có lỗi xảy ra khi xử lý ảnh!");
      console.error("Error processing images:", error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
    </div>
  );

  const privacyOptions = [
    {
      key: "public",
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FaGlobeAsia className="text-gray-600" />
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

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return <FaGlobeAsia className="text-gray-600 w-4 h-4" />;
      case "friends":
        return <FaUserFriends className="text-gray-600 w-4 h-4" />;
      case "private":
        return <FaLock className="text-gray-600 w-4 h-4" />;
      default:
        return <FaGlobeAsia className="text-gray-600 w-4 h-4" />;
    }
  };

  const getPrivacyText = (privacy) => {
    switch (privacy) {
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
    <>
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-3">
          <Avatar
            src={userData?.user?.image}
            alt={userData?.user?.name}
            size={40}
            className="rounded-full"
          />
          <button
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-600 hover:bg-gray-200"
            onClick={() => setIsCreatePostModalOpen(true)}
          >
            Bạn đang nghĩ gì?
          </button>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <button
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
            onClick={() => setIsCreatePostModalOpen(true)}
          >
            <span>🖼️</span>
            <span>Ảnh/Video</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
            onClick={() => setIsCreatePostModalOpen(true)}
          >
            <span>😊</span>
            <span>Cảm xúc</span>
          </button>
          <Link to="/livestreams">
            <button
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
            >
            <span>🎥</span>
              <span>Live Stream</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        title="Tạo bài viết"
        open={isCreatePostModalOpen}
        onCancel={!isPendingCreatePost ? () => setIsCreatePostModalOpen(false) : undefined}
        closeIcon={!isPendingCreatePost}
        maskClosable={!isPendingCreatePost}
        footer={[
          <Button 
            key="back" 
            onClick={() => setIsCreatePostModalOpen(false)} 
            disabled={isPendingCreatePost}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isPendingCreatePost}
            disabled={(!watch("content") && fileList.length === 0) || isPendingCreatePost}
            onClick={handleSubmit(onSubmit)}
          >
            Đăng
          </Button>,
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <Avatar
              src={userData?.user?.image}
              size={40}
              className="rounded-full"
            />
            <div>
              <h4 className="font-medium">{userData?.user?.name}</h4>
              <Controller
                name="privacy"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    menu={{
                      items: privacyOptions,
                      onClick: ({ key }) => field.onChange(key),
                    }}
                    trigger={["click"]}
                  >
                    <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1">
                      {getPrivacyIcon(field.value)}
                      <span className="text-sm">{getPrivacyText(field.value)}</span>
                    </button>
                  </Dropdown>
                )}
              />
            </div>
          </div>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder="Bạn đang nghĩ gì?"
                autoSize={{ minRows: 3, maxRows: 6 }}
                variant={false}
                className="text-lg !border-none !shadow-none focus:!shadow-none !outline-none resize-none"
              />
            )}
          />

          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={4}
            multiple
            accept="image/*,video/*"
            beforeUpload={() => false}
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
        </form>
      </Modal>

      {/* Preview Image Modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        maskClosable={!isPendingCreatePost}
        closeIcon={!isPendingCreatePost}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default CreatePostModal;
