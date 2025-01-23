import { useEffect, useRef, useState } from "react";
import { FaVideo, FaMicrophone, FaDesktop, FaCog } from "react-icons/fa";


const LiveStream = ({ onStart, onStop }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [devices, setDevices] = useState({
    videoDevices: [],
    audioDevices: [],
  });

  useEffect(() => {
    // Lấy danh sách thiết bị
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices({
          videoDevices: devices.filter(device => device.kind === "videoinput"),
          audioDevices: devices.filter(device => device.kind === "audioinput"),
        });
      } catch (error) {
        console.error("Không thể lấy danh sách thiết bị:", error);
      }
    };

    getDevices();
  }, []);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setIsStreaming(true);
      onStart?.();
    } catch (error) {
      console.error("Không thể bắt đầu stream:", error);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setIsStreaming(false);
      onStop?.();
    }
  };

  const toggleStream = () => {
    if (isStreaming) {
      stopStream();
    } else {
      startStream();
    }
  };

  return (
    <div className="space-y-4">
      {/* Video preview */}
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {!stream && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <FaVideo className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Cho phép truy cập camera để xem trước</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleStream}
          className={`p-3 rounded-full ${
            isStreaming ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          <FaVideo className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
          <FaMicrophone className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
          <FaDesktop className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
          <FaCog className="w-6 h-6" />
        </button>
      </div>

      {/* Device selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Camera
          </label>
          <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {devices.videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Microphone
          </label>
          <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {devices.audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LiveStream; 