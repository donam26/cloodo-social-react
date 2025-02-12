import { Modal, Upload, Button, Input, Radio, ColorPicker, message } from "antd";
import { FaImage, FaFont, FaTrash, FaPalette } from "react-icons/fa";
import { useState, useRef } from "react";
import Draggable from "react-draggable";

const DraggableText = ({ text, onRemove, onDrag }) => {
  const nodeRef = useRef(null);
  
  return (
    <Draggable
      nodeRef={nodeRef}
      position={text.position}
      onDrag={(e, data) => onDrag(text.id, data)}
      bounds="parent"
    >
      <div ref={nodeRef} className="absolute cursor-move group">
        <div 
          className="text-2xl font-bold text-white drop-shadow-lg break-words max-w-[200px]" 
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          {text.content}
        </div>
        <button
          onClick={() => onRemove(text.id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </Draggable>
  );
};

const CreateStoryModal = ({ open, onClose, onSubmit }) => {
  const [fileList, setFileList] = useState([]);
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#1677ff');
  const [backgroundType, setBackgroundType] = useState('color');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      setPreviewImage(null);
    }
  };

  const addText = () => {
    if (newText.trim() && texts.length === 0) {
      setTexts([{ id: Date.now(), content: newText, position: { x: 0, y: 0 } }]);
      setNewText("");
    }
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
  };

  const handleDrag = (id, data) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, position: { x: data.x, y: data.y } } : text
    ));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu story
      const storyData = {
        background: {
          type: backgroundType,
          value: backgroundType === 'color' ? backgroundColor : null,
          image: backgroundType === 'image' ? fileList[0]?.originFileObj : null
        },
        text: texts[0] ? {
          content: texts[0].content,
          position: texts[0].position,
          style: {
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }
        } : null
      };

      // Gọi hàm onSubmit được truyền từ component cha
      await onSubmit(storyData);
      
      // Reset form
      setFileList([]);
      setTexts([]);
      setNewText("");
      setPreviewImage(null);
      setBackgroundColor('#1677ff');
      setBackgroundType('color');
      
      onClose();
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo tin"
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          disabled={(backgroundType === 'image' && fileList.length === 0)}
          onClick={handleSubmit}
        >
          Chia sẻ lên tin
        </Button>,
      ]}
    >
      <div className="flex gap-4">
        <div 
          className="w-2/3 relative" 
          style={{ 
            height: '500px', 
            background: backgroundType === 'color' ? backgroundColor : '#f0f2f5',
            transition: 'background-color 0.3s ease'
          }} 
          ref={canvasRef}
        >
          {backgroundType === 'image' && previewImage && (
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
          )}
          {texts.map((text) => (
            <DraggableText
              key={text.id}
              text={text}
              onRemove={removeText}
              onDrag={handleDrag}
            />
          ))}
        </div>
        <div className="w-1/3 space-y-4">
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold mb-2">Chọn nền</h3>
            <Radio.Group 
              value={backgroundType} 
              onChange={(e) => setBackgroundType(e.target.value)}
              className="mb-4 w-full"
            >
              <Radio.Button value="color" className="w-1/2 text-center">
                <FaPalette className="inline-block mr-1" /> Màu
              </Radio.Button>
              <Radio.Button value="image" className="w-1/2 text-center">
                <FaImage className="inline-block mr-1" /> Ảnh
              </Radio.Button>
            </Radio.Group>

            {backgroundType === 'color' ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Chọn màu:</span>
                <ColorPicker
                  value={backgroundColor}
                  onChange={(color) => setBackgroundColor(color.toHexString())}
                  className="flex-grow"
                />
              </div>
            ) : (
              <Upload.Dragger
                accept="image/*"
                listType="picture"
                fileList={fileList}
                onChange={handleChange}
                maxCount={1}
                beforeUpload={() => false}
                className="bg-gray-50"
              >
                <p className="text-gray-500">Kéo thả hoặc click để tải ảnh lên</p>
              </Upload.Dragger>
            )}
          </div>
          
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaFont /> Thêm chữ {texts.length > 0 && "(Đã thêm)"}
            </h3>
            <div className="space-y-2">
              <Input.TextArea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Nhập nội dung văn bản..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                disabled={texts.length > 0}
              />
              <Button 
                type="primary" 
                block 
                onClick={addText}
                disabled={texts.length > 0}
              >
                Thêm văn bản
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateStoryModal; 