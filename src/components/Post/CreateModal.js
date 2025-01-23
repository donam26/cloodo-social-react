import { Modal, Upload, Button, Input } from "antd";
import { FaImage, FaSmile } from "react-icons/fa";
import { useState } from "react";

const { TextArea } = Input;

const CreatePostModal = ({ open, onClose }) => {
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Modal
      title="Tạo bài viết"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!content && fileList.length === 0}
          onClick={() => {
            // Xử lý đăng bài
            onClose();
          }}
        >
          Đăng
        </Button>,
      ]}
    >
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <img
            src="/images/avatar.jpg"
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h4 className="font-medium">Hoàng Nam</h4>
            <div className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
              <span className="text-xs">🌍</span>
              <span className="text-sm">Công khai</span>
            </div>
          </div>
        </div>

        <TextArea
          placeholder="Bạn đang nghĩ gì?"
          autoSize={{ minRows: 3, maxRows: 6 }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant={false}
          className="text-lg !p-0"
        />

        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          maxCount={4}
          multiple
          beforeUpload={() => false}
        >
          Thêm ảnh/video
        </Upload>

        <div className="mt-4 p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Thêm vào bài viết</span>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FaImage className="w-6 h-6 text-green-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FaSmile className="w-6 h-6 text-yellow-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePostModal; 