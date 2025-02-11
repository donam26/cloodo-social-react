import { Modal, Upload, Button, Input, Avatar, Dropdown, message } from "antd";
import { FaImage, FaSmile, FaGlobeAsia, FaLock, FaUserFriends } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { PlusOutlined } from '@ant-design/icons';
import { useCreatePost } from "../../hooks/postHook";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreatePostModal = ({ open, onClose }) => {
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [privacy, setPrivacy] = useState('public');

  const { mutate: createPost, isPending: isPendingCreatePost } = useCreatePost();
  const user = useSelector((state) => state?.user?.user);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Giới hạn kích thước file (ví dụ: 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const updatedFileList = newFileList.map(file => {
      if (file.size && file.size > MAX_FILE_SIZE) {
        file.status = 'error';
        file.error = 'File quá lớn! Vui lòng chọn file nhỏ hơn 5MB';
      }
      return file;
    });
    setFileList(updatedFileList);
  };

  const handleSubmit = async () => {
    try {
      const images = await Promise.all(
        fileList.map(async (file) => {
          if (file.originFileObj) {
            return await getBase64(file.originFileObj);
          }
          return file.url;
        })
      );

      const postData = {
        content,
        privacy,
        images
      };

      createPost(postData, {
        onSuccess: () => {
          message.success('Đăng bài viết thành công!');
          setContent('');
          setFileList([]);
          setPrivacy('public');
          onClose();
        },
        onError: (error) => {
          message.error('Có lỗi xảy ra khi đăng bài!');
          console.error('Error creating post:', error);
        }
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi xử lý ảnh!');
      console.error('Error processing images:', error);
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
      key: 'public',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FaGlobeAsia className="text-gray-600" />
          <div>
            <p className="font-medium">Công khai</p>
            <p className="text-xs text-gray-500">Mọi người đều thấy bài viết này</p>
          </div>
        </div>
      ),
    },
    {
      key: 'friends',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FaUserFriends className="text-gray-600" />
          <div>
            <p className="font-medium">Bạn bè</p>
            <p className="text-xs text-gray-500">Chỉ bạn bè mới thấy bài viết này</p>
          </div>
        </div>
      ),
    },
    {
      key: 'private',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FaLock className="text-gray-600" />
          <div>
            <p className="font-medium">Chỉ mình tôi</p>
            <p className="text-xs text-gray-500">Chỉ bạn mới thấy bài viết này</p>
          </div>
        </div>
      ),
    },
  ];

  const getPrivacyIcon = () => {
    switch (privacy) {
      case 'public':
        return <FaGlobeAsia className="text-gray-600 w-4 h-4" />;
      case 'friends':
        return <FaUserFriends className="text-gray-600 w-4 h-4" />;
      case 'private':
        return <FaLock className="text-gray-600 w-4 h-4" />;
      default:
        return <FaGlobeAsia className="text-gray-600 w-4 h-4" />;
    }
  };

  const getPrivacyText = () => {
    switch (privacy) {
      case 'public':
        return 'Công khai';
      case 'friends':
        return 'Bạn bè';
      case 'private':
        return 'Chỉ mình tôi';
      default:
        return 'Công khai';
    }
  };

  return (
    <>
      <Modal
        title="Tạo bài viết"
        open={open}
        onCancel={!isPendingCreatePost ? onClose : undefined}
        closeIcon={!isPendingCreatePost}
        maskClosable={!isPendingCreatePost}
        footer={[
          <Button key="back" onClick={onClose} disabled={isPendingCreatePost}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isPendingCreatePost}
            disabled={(!content && fileList.length === 0) || isPendingCreatePost}
            onClick={handleSubmit}
          >
            Đăng
          </Button>,
        ]}
      >
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <Avatar src={user?.user?.image} size={40} className="rounded-full" />
            <div>
              <h4 className="font-medium">{user?.user?.name}</h4>
              <Dropdown 
                menu={{ 
                  items: privacyOptions,
                  onClick: ({ key }) => setPrivacy(key)
                }} 
                trigger={['click']}
              >
                <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1">
                  {getPrivacyIcon()}
                  <span className="text-sm">{getPrivacyText()}</span>
                </button>
              </Dropdown>
            </div>
          </div>

          <TextArea
            placeholder="Bạn đang nghĩ gì?"
            autoSize={{ minRows: 3, maxRows: 6 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant={false}
            className="text-lg !border-none !shadow-none focus:!shadow-none !outline-none resize-none"
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
        </div>
      </Modal>

      <Modal 
        open={previewOpen} 
        title={previewTitle} 
        footer={null} 
        onCancel={handleCancel}
        maskClosable={!isPendingCreatePost}
        closeIcon={!isPendingCreatePost}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default CreatePostModal; 