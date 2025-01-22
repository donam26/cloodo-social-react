"use client";

import { Modal, Upload, Button } from "antd";
import { FaImage } from "react-icons/fa";
import { useState } from "react";

const CreateStoryModal = ({ open, onClose }) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Modal
      title="Tạo tin"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={fileList.length === 0}
          onClick={() => {
            // Xử lý đăng story
            onClose();
          }}
        >
          Chia sẻ lên tin
        </Button>,
      ]}
    >
      <div className="py-4">
        <Upload.Dragger
          accept="image/*"
          listType="picture"
          fileList={fileList}
          onChange={handleChange}
          maxCount={1}
          beforeUpload={() => false}
        >
          <p className="text-lg">
            <FaImage className="mx-auto mb-2 text-gray-400 text-2xl" />
          </p>
          <p className="text-gray-500">Kéo thả hoặc click để tải ảnh lên</p>
        </Upload.Dragger>
      </div>
    </Modal>
  );
};

export default CreateStoryModal; 