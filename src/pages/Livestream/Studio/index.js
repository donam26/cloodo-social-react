import { useState, useEffect, useRef } from "react";
import { Card, Button, Input, Space, Row, Col, message, Tooltip, Upload, Modal } from "antd";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaVideo,
    FaVideoSlash,
    FaDesktop,
    FaComments,
    FaCog,
    FaUsers,
    FaTimes,
    FaExpand,
    FaImage,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateChannel } from "../../../hooks/meetHook";

const LiveStudioPage = () => {
    const [isLive, setIsLive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [localTracks, setLocalTracks] = useState({
        videoTrack: null,
        audioTrack: null,
        screenTrack: null
    });

    const videoRef = useRef(null);
    const screenStreamRef = useRef(null);
    const clientRef = useRef(null);
    const navigate = useNavigate();
    const userData = useSelector((state) => state?.user?.user);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const imageRef = useRef(null);
    const [token, setToken] = useState(null);
    const { mutate: createChannel } = useCreateChannel();
    // Lấy stream info từ localStorage
    const streamInfo = JSON.parse(localStorage.getItem("streamInfo"));


    useEffect(() => {
        if (!streamInfo) {
            message.error("Không tìm thấy thông tin stream!");
            navigate("/livestreams/create");
            return;
        }

        const initializeStream = async () => {
            try {
                if (!process.env.REACT_APP_AGORA_APP_ID || !streamInfo.streamId) {
                    throw new Error("Thiếu thông tin cấu hình Agora");
                }
                createChannel({ channelName: streamInfo.streamId }, {
                    onSuccess: async (data) => {
                        const token = data.token;
                        setToken(token);
                        // Tạo client mới mỗi lần mount
                        clientRef.current = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
                        const client = clientRef.current;

                        // Khởi tạo role là host
                        await client.setClientRole("host");

                        // Đăng ký các event listeners
                        client.on("user-joined", handleUserJoined);
                        client.on("user-left", handleUserLeft);
                        client.on("user-published", handleUserPublished);
                        client.on("user-unpublished", handleUserUnpublished);

                        // Tạo local tracks
                        const [audioTrack, videoTrack] = await Promise.all([
                            AgoraRTC.createMicrophoneAudioTrack(),
                            AgoraRTC.createCameraVideoTrack()
                        ]);

                        setLocalTracks({
                            audioTrack,
                            videoTrack,
                            screenTrack: null
                        });

                        // Hiển thị video local
                        if (videoRef.current && videoTrack) {
                            videoTrack.play(videoRef.current);
                        }

                        // Join channel và publish tracks
                        await client.join(process.env.REACT_APP_AGORA_APP_ID, streamInfo.streamId, token, null);
                        console.log("[DEBUG] Host joined channel successfully");

                        if (audioTrack && videoTrack) {
                            console.log("[DEBUG] Publishing tracks:", {
                                audioTrack: {
                                    enabled: audioTrack.enabled,
                                    muted: audioTrack.muted
                                },
                                videoTrack: {
                                    enabled: videoTrack.enabled,
                                    muted: videoTrack.muted
                                }
                            });

                            await client.publish([audioTrack, videoTrack]);
                            console.log("[DEBUG] Tracks published successfully");
                        }

                        setIsLive(true);
                        message.success("Đã bắt đầu phát sóng!");
                    }
                });
            } catch (error) {
                console.error("Lỗi khi khởi tạo stream:", error);
                message.error("Không thể khởi tạo stream. Vui lòng thiết lập lại.");
                navigate("/livestreams/create");
            }
        };

        initializeStream();

        // Cleanup function
        return () => {
            // Cleanup tracks
            if (localTracks.audioTrack) {
                localTracks.audioTrack.stop();
                localTracks.audioTrack.close();
            }
            if (localTracks.videoTrack) {
                localTracks.videoTrack.stop();
                localTracks.videoTrack.close();
            }
            if (localTracks.screenTrack) {
                localTracks.screenTrack.stop();
                localTracks.screenTrack.close();
            }

            // Cleanup client
            if (clientRef.current) {
                const client = clientRef.current;
                client.removeAllListeners();
                if (client.connectionState === "CONNECTED") {
                    client.unpublish().then(() => {
                        client.leave();
                    }).catch(console.error);
                }
                clientRef.current = null;
            }
        };
    }, [navigate]);

    const handleUserJoined = (user) => {
        setViewerCount(prev => prev + 1);
        message.info(`Người xem ${user.uid} đã tham gia`);
    };

    const handleUserLeft = (user) => {
        setViewerCount(prev => prev - 1);
        message.info(`Người xem ${user.uid} đã rời đi`);
    };

    const handleUserPublished = async (user, mediaType) => {
        try {
            if (clientRef.current) {
                console.log("[DEBUG] Remote user published:", {
                    uid: user.uid,
                    mediaType,
                    hasAudio: user.hasAudio,
                    hasVideo: user.hasVideo
                });

                // Subscribe to the user's media
                await clientRef.current.subscribe(user, mediaType);
                console.log("[DEBUG] Subscribed to remote user:", mediaType);

                if (mediaType === "audio") {
                    user.audioTrack?.play();
                    console.log("[DEBUG] Playing remote audio");
                }
            }
        } catch (error) {
            console.error("[DEBUG] Error in handleUserPublished:", error);
        }
    };

    const handleUserUnpublished = async (user) => {
        try {
            if (clientRef.current) {
                await clientRef.current.unsubscribe(user);
                console.log("[DEBUG] Unsubscribed from user:", user.uid);
            }
        } catch (error) {
            console.error("[DEBUG] Error in handleUserUnpublished:", error);
        }
    };

    const handleStopLive = async () => {
        try {
            if (clientRef.current) {
                // Unpublish và cleanup
                await clientRef.current.unpublish();
                await clientRef.current.leave();
            }

            setIsLive(false);
            setViewerCount(0);
            message.warning("Đã dừng phát sóng!");
        } catch (error) {
            console.error("Lỗi khi dừng livestream:", error);
            message.error("Có lỗi xảy ra khi dừng phát sóng");
        }
    };

    const toggleMute = () => {
        if (localTracks.audioTrack) {
            localTracks.audioTrack.setEnabled(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localTracks.videoTrack) {
            localTracks.videoTrack.setEnabled(!isVideoOff);
            setIsVideoOff(!isVideoOff);
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                // Tạo screen track mới
                const screenTrack = await AgoraRTC.createScreenVideoTrack();

                if (isLive) {
                    // Nếu đang livestream, unpublish video track cũ và publish screen track
                    if (clientRef.current) {
                        await clientRef.current.unpublish(localTracks.videoTrack);
                        await clientRef.current.publish(screenTrack);
                    }
                }

                // Lưu video track hiện tại
                screenStreamRef.current = localTracks.videoTrack;

                // Cập nhật local tracks
                setLocalTracks(prev => ({
                    ...prev,
                    screenTrack,
                    videoTrack: screenTrack
                }));

                // Hiển thị screen share
                if (videoRef.current) {
                    screenTrack.play(videoRef.current);
                }

                setIsScreenSharing(true);
            } else {
                // Dừng screen sharing
                if (localTracks.screenTrack) {
                    localTracks.screenTrack.stop();
                    localTracks.screenTrack.close();
                }

                if (isLive && screenStreamRef.current) {
                    // Nếu đang livestream, unpublish screen track và publish lại video track
                    if (clientRef.current) {
                        await clientRef.current.unpublish(localTracks.screenTrack);
                        await clientRef.current.publish(screenStreamRef.current);
                    }
                }

                // Khôi phục video track
                if (screenStreamRef.current) {
                    setLocalTracks(prev => ({
                        ...prev,
                        screenTrack: null,
                        videoTrack: screenStreamRef.current
                    }));

                    if (videoRef.current) {
                        screenStreamRef.current.play(videoRef.current);
                    }
                }

                setIsScreenSharing(false);
            }
        } catch (err) {
            console.error("Lỗi khi chia sẻ màn hình:", err);
            message.error("Không thể chia sẻ màn hình. Vui lòng thử lại.");
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([
                ...messages,
                {
                    id: Date.now(),
                    user: userData?.name || "Người dùng",
                    content: newMessage,
                    timestamp: new Date().toLocaleTimeString()
                }
            ]);
            setNewMessage("");
        }
    };

    const handleImageSelect = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ có thể tải lên file ảnh!');
            return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setImageUrl(e.target.result);
            setSelectedImage(file);
        };
        reader.readAsDataURL(file);
        return false; // Prevent upload
    };

    const handleShowImage = async () => {
        if (!imageUrl) {
            message.error('Vui lòng chọn ảnh trước!');
            return;
        }

        // Tạm dừng video track nếu đang có
        if (localTracks.videoTrack) {
            localTracks.videoTrack.setEnabled(false);
        }

        // Hiển thị ảnh
        if (imageRef.current) {
            imageRef.current.style.backgroundImage = `url(${imageUrl})`;
            imageRef.current.style.backgroundSize = 'contain';
            imageRef.current.style.backgroundPosition = 'center';
            imageRef.current.style.backgroundRepeat = 'no-repeat';
            imageRef.current.style.display = 'block';
        }

        setShowImageModal(false);
    };

    const handleHideImage = () => {
        // Bật lại video track
        if (localTracks.videoTrack) {
            localTracks.videoTrack.setEnabled(true);
        }

        // Ẩn ảnh
        if (imageRef.current) {
            imageRef.current.style.display = 'none';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <Row gutter={16}>
                {/* Main Content */}
                <Col span={18}>
                    <Card className="mb-4">
                        {/* Video Preview */}
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                            <div ref={videoRef} className="w-full h-full"></div>
                            <div
                                ref={imageRef}
                                className="absolute inset-0 bg-black"
                                style={{ display: 'none' }}
                            ></div>
                            {/* Stream Info */}
                            <div className="absolute top-4 left-4 flex items-center space-x-4">
                                <div className={`px-3 py-1 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-500'} text-white font-medium`}>
                                    {isLive ? 'LIVE' : 'PREVIEW'}
                                </div>
                                <div className="flex items-center space-x-2 text-white">
                                    <FaUsers />
                                    <span>{viewerCount}</span>
                                </div>
                            </div>
                            {/* Controls */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                                <Tooltip title={isMuted ? "Bật mic" : "Tắt mic"}>
                                    <Button
                                        shape="circle"
                                        icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                                        onClick={toggleMute}
                                    />
                                </Tooltip>
                                <Tooltip title={isVideoOff ? "Bật camera" : "Tắt camera"}>
                                    <Button
                                        shape="circle"
                                        icon={isVideoOff ? <FaVideoSlash /> : <FaVideo />}
                                        onClick={toggleVideo}
                                    />
                                </Tooltip>
                                <Tooltip title={isScreenSharing ? "Dừng chia sẻ" : "Chia sẻ màn hình"}>
                                    <Button
                                        shape="circle"
                                        icon={<FaDesktop />}
                                        onClick={toggleScreenShare}
                                    />
                                </Tooltip>
                                <Tooltip title="Hiển thị ảnh">
                                    <Button
                                        shape="circle"
                                        icon={<FaImage />}
                                        onClick={() => setShowImageModal(true)}
                                    />
                                </Tooltip>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={handleStopLive}
                                >
                                    Kết thúc
                                </Button>
                            </div>
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
                                <Button type="text" icon={<FaCog />} />
                                <Button type="text" icon={<FaTimes />} />
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

            {/* Image Modal */}
            <Modal
                title="Chọn ảnh hiển thị"
                open={showImageModal}
                onCancel={() => setShowImageModal(false)}
                footer={[
                    <Button key="back" onClick={() => setShowImageModal(false)}>
                        Hủy
                    </Button>,
                    <Button key="hide" onClick={handleHideImage} disabled={!imageUrl}>
                        Ẩn ảnh
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleShowImage} disabled={!imageUrl}>
                        Hiển thị
                    </Button>,
                ]}
            >
                <Upload.Dragger
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleImageSelect}
                    className="mb-4"
                >
                    <p className="ant-upload-drag-icon">
                        <FaImage style={{ fontSize: '48px', color: '#40a9ff' }} />
                    </p>
                    <p className="ant-upload-text">Nhấp hoặc kéo thả ảnh vào đây</p>
                </Upload.Dragger>

                {imageUrl && (
                    <div className="mt-4 text-center">
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default LiveStudioPage; 