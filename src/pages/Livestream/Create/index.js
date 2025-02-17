import { useState, useEffect, useRef } from "react";
import { Card, Radio, Input, Button, Select, Checkbox, message, Upload } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  FaVideo,
  FaDesktop,
  FaMicrophone,
  FaCamera,
  FaExpand,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateLiveStream } from "../../../hooks/livestreamHook";

const { TextArea } = Input;

const CreateLivestream = () => {
  const [selectedSource, setSelectedSource] = useState("webcam");
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [devices, setDevices] = useState({ videoDevices: [], audioDevices: [] });
  const [selectedCamera, setSelectedCamera] = useState('default');
  const [selectedMicrophone, setSelectedMicrophone] = useState('default');
  const navigate = useNavigate();
  const userData = useSelector((state) => state?.user?.user);
  const { mutate: createLiveStream } = useCreateLiveStream();
  const videoRef = useRef(null);
  const [thumbnailBase64, setThumbnailBase64] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
    }
  });

  // Lấy danh sách thiết bị
  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');

      setDevices({
        videoDevices: videoDevices.map(device => ({
          label: device.label || `Camera ${videoDevices.indexOf(device) + 1}`,
          value: device.deviceId
        })),
        audioDevices: audioDevices.map(device => ({
          label: device.label || `Microphone ${audioDevices.indexOf(device) + 1}`,
          value: device.deviceId
        }))
      });
    } catch (err) {
      console.error("Lỗi khi lấy danh sách thiết bị:", err);
    }
  };

  useEffect(() => {
    getDevices();
  }, []);

  const handleSourceChange = async (source) => {
    setSelectedSource(source);
    // Reset stream when changing source
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setCameraPermission(false);

    if (source === "screen") {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setMediaStream(stream);
        setCameraPermission(true);
      } catch (err) {
        console.error("Lỗi khi chia sẻ màn hình:", err);
        message.error("Không thể chia sẻ màn hình. Vui lòng thử lại.");
      }
    }
  };

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }

    // Cleanup function
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  const requestCameraPermission = async () => {
    try {
      const constraints = {
        video: selectedCamera !== 'default' ? { deviceId: selectedCamera } : true,
        audio: selectedMicrophone !== 'default' ? { deviceId: selectedMicrophone } : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);
      setCameraPermission(true);

      await getDevices();
    } catch (err) {
      console.error("Error accessing camera:", err);
      message.error("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // Xử lý khi thay đổi camera
  const handleCameraChange = async (deviceId) => {
    setSelectedCamera(deviceId);
    if (cameraPermission) {
      // Dừng stream hiện tại
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      // Tạo stream mới với camera đã chọn
      await requestCameraPermission();
    }
  };

  // Xử lý khi thay đổi microphone
  const handleMicrophoneChange = async (deviceId) => {
    setSelectedMicrophone(deviceId);
    if (cameraPermission) {
      // Dừng stream hiện tại
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      // Tạo stream mới với microphone đã chọn
      await requestCameraPermission();
    }
  };

  const handleThumbnailUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ có thể tải lên file ảnh!');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      setThumbnailPreview(base64String);
      setThumbnailBase64(base64String.split(',')[1]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const onSubmit = async (values) => {
    try {
      if (!mediaStream) {
        throw new Error("Chưa có stream");
      }

      if (!thumbnailBase64) {
        message.error("Vui lòng tải lên ảnh thumbnail");
        return;
      }

      const streamData = {
        ...values,
        image: thumbnailBase64
      };

      createLiveStream(streamData, {
        onSuccess: (data) => {
          message.success("Tạo stream thành công!");
          console.log('data', data);
          const streamInfo = {
            streamId: data.data.id,
            image: data.data.image,
            selectedCamera,
            selectedMicrophone,
            selectedSource,
            hostId: userData.id,
            viewers: 0,
            tracks: mediaStream.getTracks().map(track => ({
              kind: track.kind,
              label: track.label,
              deviceId: track.getSettings().deviceId,
              enabled: track.enabled
            }))
          };

          localStorage.setItem("streamInfo", JSON.stringify(streamInfo));
          window.currentStream = mediaStream;
          message.success("Bắt đầu phát trực tiếp!");
          navigate("/livestreams/studio");
        }
      })

    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi bắt đầu stream");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-4">
        <h1 className="text-2xl font-bold mb-6">Tạo video trực tiếp</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Source Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              className={`p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${selectedSource === "webcam" ? "border-blue-500 bg-blue-50" : ""
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
              className={`p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${selectedSource === "screen" ? "border-blue-500 bg-blue-50" : ""
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
                  value={selectedCamera}
                  onChange={handleCameraChange}
                  options={[
                    { label: "Camera mặc định", value: "default" },
                    ...devices.videoDevices
                  ]}
                />
              </div>
              <div className="flex items-center gap-4">
                <FaMicrophone className="text-gray-500" />
                <Select
                  className="w-64"
                  placeholder="Chọn microphone"
                  value={selectedMicrophone}
                  onChange={handleMicrophoneChange}
                  options={[
                    { label: "Microphone mặc định", value: "default" },
                    ...devices.audioDevices
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
                ref={videoRef}
                className="w-full h-full object-cover"
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

          {/* Thumbnail Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh thumbnail <span className="text-red-500">*</span>
            </label>
            <Upload.Dragger
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleThumbnailUpload}
              className="mb-4"
            >
              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="max-h-[200px] object-contain mx-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
                    <span className="text-white">Nhấp để thay đổi ảnh</span>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <p className="ant-upload-drag-icon">
                    <FaImage style={{ fontSize: '48px', color: '#40a9ff' }} />
                  </p>
                  <p className="ant-upload-text">Nhấp hoặc kéo thả ảnh vào đây</p>
                  <p className="ant-upload-hint text-gray-500">
                    Hỗ trợ file ảnh JPG, PNG. Kích thước tối đa 2MB
                  </p>
                </div>
              )}
            </Upload.Dragger>
          </div>

          {/* Stream Details */}
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Vui lòng nhập tiêu đề" }}
                render={({ field }) => (
                  <Input 
                    {...field}
                    placeholder="Nhập tiêu đề cho stream của bạn"
                    className={errors.title ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Mô tả về nội dung stream của bạn"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                )}
              />
            </div>

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
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateLivestream; 