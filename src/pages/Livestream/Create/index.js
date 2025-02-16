import { useState } from "react";
import { Card, Radio, Input, Button, Form, Select, Checkbox, message } from "antd";
import {
  FaVideo,
  FaDesktop,
  FaMicrophone,
  FaCamera,
  FaExpand,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const CreateLivestream = () => {
  const [selectedSource, setSelectedSource] = useState("webcam");
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.user?.user);

  const [form] = Form.useForm();

  const handleSourceChange = (source) => {
    setSelectedSource(source);
    // Reset stream when changing source
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setCameraPermission(false);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      setMediaStream(stream);
      setCameraPermission(true);

      // Display stream in video element
      const videoElement = document.getElementById('preview-video');
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      message.error("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const handleStartStream = async (values) => {
    try {
      // Implement your streaming logic here
      console.log("Stream values:", values);
      message.success("Bắt đầu phát trực tiếp!");
      // Navigate to streaming page
      navigate("/livestream/studio");
    } catch (error) {
      message.error("Có lỗi xảy ra khi bắt đầu stream");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-4">
        <h1 className="text-2xl font-bold mb-6">Tạo video trực tiếp</h1>

        {/* Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div 
            className={`p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
              selectedSource === "webcam" ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => handleSourceChange("webcam")}
          >
            <div className="flex items-center gap-3 mb-2">
              <FaCamera className="text-2xl text-blue-500" />
              <h3 className="text-lg font-medium">Webcam</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Phát trực tiếp bằng webcam và microphone của bạn
            </p>
          </div>

          <div 
            className={`p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
              selectedSource === "screen" ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => handleSourceChange("screen")}
          >
            <div className="flex items-center gap-3 mb-2">
              <FaDesktop className="text-2xl text-blue-500" />
              <h3 className="text-lg font-medium">Chia sẻ màn hình</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Chia sẻ màn hình máy tính của bạn
            </p>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Thiết lập camera</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FaCamera className="text-gray-500" />
              <Select
                className="w-64"
                placeholder="Chọn camera"
                options={[
                  { label: "Camera mặc định", value: "default" }
                ]}
              />
            </div>
            <div className="flex items-center gap-4">
              <FaMicrophone className="text-gray-500" />
              <Select
                className="w-64"
                placeholder="Chọn microphone"
                options={[
                  { label: "Microphone mặc định", value: "default" }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
          {!cameraPermission ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <FaCamera className="text-5xl mb-4" />
              <h3 className="text-xl font-medium mb-2">Cho phép truy cập camera</h3>
              <p className="text-sm text-gray-300 mb-4">
                Trình duyệt cần quyền truy cập camera và microphone của bạn
              </p>
              <Button 
                type="primary" 
                size="large"
                icon={<FaVideo />}
                onClick={requestCameraPermission}
              >
                Bắt đầu
              </Button>
            </div>
          ) : (
            <video
              id="preview-video"
              className="w-full h-full"
              autoPlay
              playsInline
              muted
            />
          )}
          <Button
            icon={<FaExpand />}
            className="absolute bottom-4 right-4"
            type="text"
            ghost
          />
        </div>

        {/* Stream Details Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStartStream}
          initialValues={{
            shareToStory: true,
            privacy: "public"
          }}
        >
          <div className="space-y-4">
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề cho stream của bạn" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea
                placeholder="Mô tả về nội dung stream của bạn"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="privacy"
              label="Quyền riêng tư"
            >
              <Radio.Group>
                <Radio value="public">Công khai</Radio>
                <Radio value="friends">Bạn bè</Radio>
                <Radio value="private">Riêng tư</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="shareToStory"
              valuePropName="checked"
            >
              <Checkbox>Chia sẻ lên story</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<FaVideo />}
                disabled={!cameraPermission}
                block
              >
                Bắt đầu phát trực tiếp
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateLivestream; 