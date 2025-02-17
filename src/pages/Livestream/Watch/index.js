import { useState, useEffect, useRef } from "react";
import { Card, Button, Input, Space, Row, Col, message, Tooltip } from "antd";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FaUsers, FaComments } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useJoinChannel } from "../../../hooks/meetHook";

const WatchLiveStreamPage = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [token, setToken] = useState("");
  const { mutate: joinChannel } = useJoinChannel();
  const videoRef = useRef(null);
  const clientRef = useRef(null);
  const userData = useSelector((state) => state?.user?.user);
  const { channelName } = useParams();

  useEffect(() => {
    const initializeViewer = async () => {
      try {
        // Khởi tạo client với cấu hình chi tiết hơn
        clientRef.current = AgoraRTC.createClient({ 
          mode: "live", 
          codec: "vp8",
          role: "audience" // Set role ngay khi khởi tạo
        });
        const client = clientRef.current;

        // Đăng ký các event handlers trước khi join
        client.on("connection-state-change", (curState, prevState) => {
          console.log("Connection state changed from", prevState, "to", curState);
        });

        client.on("user-published", async (user, mediaType) => {
          console.log("User published event triggered:", user.uid, mediaType);
          await handleUserPublished(user, mediaType);
        });

        client.on("user-unpublished", async (user, mediaType) => {
          console.log("User unpublished:", user.uid, mediaType);
          await handleUserUnpublished(user, mediaType);
        });

        client.on("user-joined", (user) => {
          console.log("User joined:", user.uid);
          handleUserJoined(user);
        });

        client.on("user-left", (user) => {
          console.log("User left:", user.uid);
          handleUserLeft(user);
        });

        // Tạo token và đợi cho đến khi có token
        const tokenResult = await new Promise((resolve, reject) => {
          joinChannel(
            {
              channelName: channelName,
              uid: userData?.id || 0,
            },
            {
              onSuccess: (data) => {
                console.log("[DEBUG] Token creation response:", data);
                setToken("007eJxTYDjgs+WstdX+yQGqvkrpXe0c2nP/maUGZKn9L92bO7/uVpUCQ7K5sYmRQaphsqGJgYmJeZqlpZFxcqqZsYlhSqpBikVa68dN6Q2BjAwaV6czMjJAIIivwmCaZpSWYmGapGtuamypa2JqaqKbZJmYpmucYm5oZAkEJoYGDAwAdq8mZw==");
                resolve("007eJxTYDjgs+WstdX+yQGqvkrpXe0c2nP/maUGZKn9L92bO7/uVpUCQ7K5sYmRQaphsqGJgYmJeZqlpZFxcqqZsYlhSqpBikVa68dN6Q2BjAwaV6czMjJAIIivwmCaZpSWYmGapGtuamypa2JqaqKbZJmYpmucYm5oZAkEJoYGDAwAdq8mZw==");
              },
              onError: (error) => {
                console.error("[DEBUG] Token creation failed:", error);
                reject(error);
              },
            }
          );
        });

        // Join channel sau khi có token
        if (tokenResult) {
          try {
            // Set role trước khi join
            await client.setClientRole("audience");
            console.log("[DEBUG] Client role set to audience");
            console.log("[DEBUG] Joining channel with:", {
              appId: process.env.REACT_APP_AGORA_APP_ID,
              channel: channelName,
              token: tokenResult,
              uid: userData?.id
            });

            // Join với uid cụ thể
            const uid = await client.join(
              process.env.REACT_APP_AGORA_APP_ID,
              channelName,
              tokenResult,
              userData?.id || Math.floor(Math.random() * 1000000)
            );

            console.log("[DEBUG] Joined channel successfully with uid:", uid);
            console.log("[DEBUG] Current remote users:", client.remoteUsers);
            setIsJoined(true);
            message.success("Đã tham gia stream!");

            // Subscribe to the host's media
            const remoteClient = client.remoteUsers[0];
            if (remoteClient) {
              console.log("[DEBUG] Found host:", remoteClient);
              console.log("[DEBUG] Host media status:", {
                hasVideo: remoteClient.hasVideo,
                hasAudio: remoteClient.hasAudio
              });
              
              if (remoteClient.hasVideo) {
                await client.subscribe(remoteClient, "video");
                console.log("[DEBUG] Subscribed to host video");
              }
              if (remoteClient.hasAudio) {
                await client.subscribe(remoteClient, "audio");
                console.log("[DEBUG] Subscribed to host audio");
              }
            } else {
              console.log("[DEBUG] No host found in channel yet");
            }
          } catch (joinError) {
            console.error("Error joining channel:", joinError);
            message.error("Không thể tham gia stream. Vui lòng thử lại sau.");
          }
        }
      } catch (error) {
        console.error("Error initializing viewer:", error);
        message.error("Không thể tham gia stream. Vui lòng thử lại sau.");
      }
    };

    if (channelName) {
      initializeViewer();
    }

    return () => {
      if (clientRef.current) {
        const client = clientRef.current;
        // Cleanup all tracks
        setRemoteUsers(prev => {
          prev.forEach(user => {
            if (user.videoTrack) {
              user.videoTrack.stop();
              user.videoTrack.close();
            }
            if (user.audioTrack) {
              user.audioTrack.stop();
              user.audioTrack.close();
            }
          });
          return [];
        });
        
        client.removeAllListeners();
        if (client.connectionState === "CONNECTED") {
          client.leave().then(() => {
            console.log("Left channel successfully");
          }).catch(console.error);
        }
        clientRef.current = null;
      }
    };
  }, [channelName, userData?.id]);

  const handleUserPublished = async (user, mediaType) => {
    try {
      if (!clientRef.current) {
        console.log("[DEBUG] Client reference is null");
        return;
      }

      console.log(`[DEBUG] User ${user.uid} published ${mediaType} track`);
      console.log("[DEBUG] Remote user info:", {
        uid: user.uid,
        hasVideo: user.hasVideo,
        hasAudio: user.hasAudio,
        videoTrack: !!user.videoTrack,
        audioTrack: !!user.audioTrack
      });

      // Subscribe to the track
      await clientRef.current.subscribe(user, mediaType);
      console.log(`[DEBUG] Successfully subscribed to ${mediaType} track`);
      
      if (mediaType === "video") {
        if (user.videoTrack) {
          console.log("[DEBUG] Video container element:", videoRef.current);
          console.log("[DEBUG] Video track info:", {
            enabled: user.videoTrack.enabled,
            muted: user.videoTrack.muted
          });

          try {
            if (videoRef.current) {
              // Clear the container first
              videoRef.current.innerHTML = '';
              
              // Play the video track directly in the container
              await user.videoTrack.play(videoRef.current);
              console.log("[DEBUG] Video track started playing directly");
            } else {
              console.error("[DEBUG] Video container reference is null");
            }
          } catch (playError) {
            console.error("[DEBUG] Error playing video track:", playError);
            // Try alternative method if direct play fails
            try {
              const playerContainer = document.createElement('div');
              playerContainer.style.width = '100%';
              playerContainer.style.height = '100%';
              videoRef.current.appendChild(playerContainer);
              await user.videoTrack.play(playerContainer);
              console.log("[DEBUG] Video track started playing in new container");
            } catch (alternativeError) {
              console.error("[DEBUG] Alternative play method also failed:", alternativeError);
            }
          }
        } else {
          console.log(`[DEBUG] No video track available from user ${user.uid}`);
        }
      }
      
      if (mediaType === "audio") {
        if (user.audioTrack) {
          try {
            await user.audioTrack.play();
            console.log("[DEBUG] Audio track started playing");
          } catch (audioError) {
            console.error("[DEBUG] Error playing audio track:", audioError);
          }
        } else {
          console.log(`[DEBUG] No audio track available from user ${user.uid}`);
        }
      }

      // Update remote users list
      setRemoteUsers(prev => {
        const hasUser = prev.find(u => u.uid === user.uid);
        if (hasUser) {
          console.log(`[DEBUG] Updating existing user ${user.uid} in remote users list`);
          return prev.map(u => u.uid === user.uid ? user : u);
        }
        console.log(`[DEBUG] Adding new user ${user.uid} to remote users list`);
        return [...prev, user];
      });

    } catch (error) {
      console.error("[DEBUG] Error in handleUserPublished:", error);
      message.error("Không thể kết nối tới stream. Vui lòng tải lại trang.");
    }
  };

  const handleUserUnpublished = async (user, mediaType) => {
    try {
      if (!clientRef.current) return;

      await clientRef.current.unsubscribe(user, mediaType);
      console.log("Unsubscribed from", mediaType, "track of user:", user.uid);

      if (mediaType === "video") {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      }
    } catch (error) {
      console.error("Error in handleUserUnpublished:", error);
    }
  };

  const handleUserJoined = (user) => {
    setViewerCount(prev => prev + 1);
    message.info(`Người xem ${user.uid} đã tham gia`);
  };

  const handleUserLeft = (user) => {
    setViewerCount(prev => Math.max(0, prev - 1));
    message.info(`Người xem ${user.uid} đã rời đi`);
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          user: userData?.name || "Người xem",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
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
              ></div>
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
              {!isJoined && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center">
                    <p className="text-xl mb-2">Đang kết nối tới stream...</p>
                    <p className="text-sm">Vui lòng đợi trong giây lát</p>
                  </div>
                </div>
              )}
              {isJoined && remoteUsers.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center">
                    <p className="text-xl mb-2">Đã kết nối thành công</p>
                    <p className="text-sm">Đang đợi host bắt đầu stream...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Chat Sidebar */}
        <Col span={6}>
          <Card
            title="Chat"
            className="h-[calc(100vh-2rem)]"
            extra={
              <Space>
                <Button type="text" icon={<FaComments />} />
              </Space>
            }
          >
            {/* Messages */}
            <div className="h-[calc(100vh-12rem)] overflow-y-auto mb-4">
              {messages.map(msg => (
                <div key={msg.id} className="mb-4">
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="absolute bottom-4 left-4 right-4">
              <Input.TextArea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={e => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                className="mt-2 w-full"
                onClick={handleSendMessage}
              >
                Gửi
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WatchLiveStreamPage; 