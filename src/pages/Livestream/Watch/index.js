import { useState, useEffect, useRef } from "react";
import { Card, Row, Col, message } from "antd";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FaUsers } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useJoinChannel } from "../../../hooks/meetHook";
import SidebarChatComponent from "../../../components/Watch/Live/SidebarChatComponent";
const WatchLiveStreamPage = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mutate: joinChannel } = useJoinChannel();
  const videoRef = useRef(null);
  const clientRef = useRef(null);
  const userData = useSelector((state) => state?.user?.user);
  const { channelName } = useParams();

  useEffect(() => {
    let client = null;

    const initializeViewer = async () => {
      try {
        setIsLoading(true);
        // Khởi tạo Agora client
        client = AgoraRTC.createClient({
          mode: "live",
          codec: "vp8",
          role: "audience"
        });
        clientRef.current = client;

        // Xử lý sự kiện user publish stream
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          
          if (mediaType === "video") {
            setRemoteUsers(prev => [...prev, user]);
            user.videoTrack?.play(videoRef.current);
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        // Xử lý sự kiện user unpublish stream
        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
          }
        });

        // Xử lý sự kiện user join/leave
        client.on("user-joined", handleUserJoined);
        client.on("user-left", handleUserLeft);

        // Join channel với token
        try {
          joinChannel(
            {
              channelName,
              uid: userData?.id || Math.floor(Math.random() * 100000),
            },
            {
              onSuccess: async (response) => {
                // Response trả về trực tiếp là object chứa token, appID và channelName
                const { token, appID, channelName: channel } = response;
                
                if (!token || !channel || !appID) {
                  throw new Error("Token, AppID hoặc channel không hợp lệ");
                }

                await client.join(
                  appID, // Sử dụng appID từ response
                  channel,
                  token,
                  userData?.id || Math.floor(Math.random() * 100000)
                );

                setIsJoined(true);
                setIsLoading(false);
                message.success("Đã tham gia stream thành công!");
              },
              onError: (error) => {
                console.error("Lỗi khi join channel:", error);
                message.error("Không thể tham gia stream. Vui lòng thử lại.");
                setIsLoading(false);
              }
            }
          );
        } catch (error) {
          console.error("Lỗi khi join channel:", error);
          message.error("Không thể tham gia stream. Vui lòng thử lại.");
          setIsLoading(false);
        }

      } catch (error) {
        console.error("Lỗi khởi tạo client:", error);
        message.error("Có lỗi xảy ra. Vui lòng tải lại trang.");
        setIsLoading(false);
      }
    };

    if (channelName) {
      initializeViewer();
    }

    // Cleanup function
    return () => {
      if (client) {
        setRemoteUsers([]);
        setIsJoined(false);
        client.removeAllListeners();
        client.leave().catch(console.error);
      }
    };
  }, [channelName, userData?.id]);

  const handleUserJoined = (user) => {
    setViewerCount(prev => prev + 1);
    console.log("User joined:", user.uid);
  };

  const handleUserLeft = (user) => {
    setViewerCount(prev => Math.max(0, prev - 1));
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    console.log("User left:", user.uid);
  };


  return (
      <Row gutter={16}>
        {/* Main Content */}
        <Col span={18}>
          <Card className="mb-4">
            {/* Video Stream */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <div
                ref={videoRef}
                className="w-full h-full"
                style={{
                  minHeight: "400px",
                  backgroundColor: "#000000"
                }}
              />
              
              {/* Stream Info */}
              <div className="absolute top-4 left-4 flex items-center space-x-4">
                <div className="px-3 py-1 rounded-full bg-red-500 text-white font-medium">
                  {isJoined ? "LIVE" : "Đang kết nối..."}
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <FaUsers />
                  <span>{viewerCount}</span>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center">
                    <p className="text-xl mb-2">Đang kết nối tới stream...</p>
                    <p className="text-sm">Vui lòng đợi trong giây lát</p>
                  </div>
                </div>
              )}

              {/* No Stream State */}
              {!isLoading && isJoined && remoteUsers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center">
                    <p className="text-xl mb-2">Phiên live không tồn tại hoặc đã kết thúc</p>
                    <p className="text-sm">Vui lòng thử lại sau</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <SidebarChatComponent />
      </Row>
  );
};

export default WatchLiveStreamPage; 