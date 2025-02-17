import { useState, useEffect, useRef } from "react";
import { Card, Button, Input, Space, Row, Col, message, Tooltip } from "antd";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
    FaMicrophone,
    FaMicrophoneSlash,
    FaVideo,
    FaVideoSlash,
    FaDesktop,
    FaCog,
    FaUsers,
    FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateChannel } from "../../../hooks/meetHook";
import { useEndLiveStream } from "../../../hooks/livestreamHook";
import SidebarChatComponent from "../../../components/Watch/Live/SidebarChatComponent";

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
    const { mutate: createChannel, isPending: isCreatingChannel } = useCreateChannel();
    const { mutate: endLiveStream } = useEndLiveStream();
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

                // Lưu trữ tất cả MediaStream tracks để cleanup
                const mediaStreamTracks = [];

                // Lấy stream từ camera/mic
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                mediaStream.getTracks().forEach(track => mediaStreamTracks.push(track));

                createChannel({ channelName: streamInfo.streamId }, {
                    onSuccess: async (data) => {
                        const token = data.token;
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

                        // Lưu mediaStreamTracks vào window để có thể cleanup sau
                        window.mediaStreamTracks = mediaStreamTracks;
                    }
                });
            } catch (error) {
                console.error("Lỗi khi khởi tạo stream:", error);
                message.error("Không thể khởi tạo stream. Vui lòng thiết lập lại.");
                navigate("/livestreams/create");
            }
        };

        initializeStream();

        // Cleanup function khi unmount component
        return () => {
            const cleanup = async () => {
                try {
                    console.log("[DEBUG] Starting cleanup process...");

                    // 1. Dừng tất cả MediaStream tracks trước
                    if (window.mediaStreamTracks) {
                        console.log("[DEBUG] Stopping all MediaStream tracks");
                        window.mediaStreamTracks.forEach(track => {
                            if (track && !track.stopped) {
                                track.enabled = false;
                                track.stop();
                                console.log(`[DEBUG] Stopped MediaStream track: ${track.kind}`);
                            }
                        });
                        window.mediaStreamTracks = null;
                    }

                    // 2. Dừng tất cả tracks đang hoạt động từ browser
                    try {
                        const allTracks = [];
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        for (const device of devices) {
                            if (device.kind === 'videoinput' || device.kind === 'audioinput') {
                                const stream = await navigator.mediaDevices.getUserMedia({
                                    [device.kind === 'videoinput' ? 'video' : 'audio']: {
                                        deviceId: device.deviceId
                                    }
                                }).catch(() => null);

                                if (stream) {
                                    stream.getTracks().forEach(track => allTracks.push(track));
                                }
                            }
                        }

                        allTracks.forEach(track => {
                            if (track && !track.stopped) {
                                track.enabled = false;
                                track.stop();
                                console.log(`[DEBUG] Stopped additional track: ${track.kind}`);
                            }
                        });
                    } catch (err) {
                        console.error("[DEBUG] Error stopping browser tracks:", err);
                    }

                    // 3. Cleanup Agora client
                    if (clientRef.current) {
                        const client = clientRef.current;
                        console.log("[DEBUG] Cleaning up Agora client");

                        try {
                            // Remove all event listeners
                            client.removeAllListeners();

                            // Unpublish all tracks
                            if (client.connectionState === "CONNECTED") {
                                const localTracks = client.localTracks;
                                for (const track of localTracks) {
                                    if (track) {
                                        track.stop();
                                        track.close();
                                        await client.unpublish(track).catch(console.error);
                                    }
                                }

                                await client.leave().catch(console.error);
                            }
                        } catch (error) {
                            console.error("[DEBUG] Error in client cleanup:", error);
                        } finally {
                            clientRef.current = null;
                        }
                    }

                    // 4. Cleanup local tracks
                    const cleanupTrack = async (track, type) => {
                        if (!track) return;
                        try {
                            // Kiểm tra và vô hiệu hóa track nếu có thể
                            if (typeof track.setEnabled === 'function') {
                                try {
                                    await track.setEnabled(false);
                                } catch (err) {
                                    console.log(`[DEBUG] Could not disable ${type} track:`, err);
                                }
                            }

                            // Dừng MediaStreamTrack nếu có
                            if (track._mediaStreamTrack) {
                                try {
                                    track._mediaStreamTrack.enabled = false;
                                    track._mediaStreamTrack.stop();
                                } catch (err) {
                                    console.log(`[DEBUG] Could not stop MediaStreamTrack for ${type}:`, err);
                                }
                            }

                            // Dừng track
                            if (typeof track.stop === 'function') {
                                try {
                                    await track.stop();
                                } catch (err) {
                                    console.log(`[DEBUG] Could not stop ${type} track:`, err);
                                }
                            }

                            // Đóng track
                            if (typeof track.close === 'function') {
                                try {
                                    await track.close();
                                } catch (err) {
                                    console.log(`[DEBUG] Could not close ${type} track:`, err);
                                }
                            }

                            console.log(`[DEBUG] Cleaned up ${type} track`);
                        } catch (error) {
                            console.error(`[DEBUG] Error cleaning up ${type} track:`, error);
                        }
                    };

                    // Cleanup all local tracks
                    await Promise.all([
                        cleanupTrack(localTracks.audioTrack, 'audio'),
                        cleanupTrack(localTracks.videoTrack, 'video'),
                        cleanupTrack(localTracks.screenTrack, 'screen')
                    ]);

                    // Cleanup screen share if exists
                    if (screenStreamRef.current) {
                        await cleanupTrack(screenStreamRef.current, 'screen-ref');
                        screenStreamRef.current = null;
                    }

                    // Reset states
                    setLocalTracks({
                        videoTrack: null,
                        audioTrack: null,
                        screenTrack: null
                    });

                    // Clear video container
                    if (videoRef.current) {
                        videoRef.current.innerHTML = '';
                    }

                    // 5. End stream API call
                    if (isLive && streamInfo?.streamId) {
                        console.log("[DEBUG] Calling end stream API");
                        try {
                            await new Promise((resolve, reject) => {
                                endLiveStream(
                                    { streamId: streamInfo.streamId },
                                    {
                                        onSuccess: () => {
                                            console.log("[DEBUG] Stream ended successfully");
                                            localStorage.removeItem("streamInfo");
                                            resolve();
                                        },
                                        onError: (error) => {
                                            console.error("[DEBUG] Error ending stream:", error);
                                            reject(error);
                                        }
                                    }
                                );
                            });
                        } catch (error) {
                            console.error("[DEBUG] Error ending stream:", error);
                        }
                    }

                    console.log("[DEBUG] Cleanup completed successfully");
                } catch (error) {
                    console.error("[DEBUG] Error in cleanup:", error);
                }
            };

            cleanup().catch(error => {
                console.error("[DEBUG] Fatal error during cleanup:", error);
            });
        };
    }, [navigate, endLiveStream, isLive]);

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
            // 1. Unpublish tất cả track từ client trước
            if (clientRef.current) {
                console.log("[DEBUG] Starting unpublish tracks...");
                const tracks = clientRef.current.localTracks;
                for (const track of tracks) {
                    if (track) {
                        try {
                            await clientRef.current.unpublish(track);
                            console.log("[DEBUG] Unpublished track:", track.trackMediaType);
                        } catch (err) {
                            console.error("[DEBUG] Error unpublishing track:", err);
                        }
                    }
                }
            }

            // 2. Giải phóng local tracks
            const cleanupTrack = async (track, type) => {
                if (!track) return;
                try {
                    console.log(`[DEBUG] Cleaning up ${type} track...`);
                    // Vô hiệu hóa track
                    if (track.setEnabled) {
                        await track.setEnabled(false);
                        console.log(`[DEBUG] Disabled ${type} track`);
                    }

                    // Dừng MediaStreamTrack nếu có
                    if (track._mediaStreamTrack) {
                        track._mediaStreamTrack.enabled = false;
                        track._mediaStreamTrack.stop();
                        console.log(`[DEBUG] Stopped MediaStreamTrack for ${type}`);
                    }

                    // Dừng track
                    if (track.stop) {
                        track.stop();
                        console.log(`[DEBUG] Stopped ${type} track`);
                    }

                    // Đóng track
                    if (track.close) {
                        track.close();
                        console.log(`[DEBUG] Closed ${type} track`);
                    }
                } catch (error) {
                    console.error(`[DEBUG] Error cleaning up ${type} track:`, error);
                }
            };

            // Cleanup từng track riêng biệt
            await Promise.all([
                cleanupTrack(localTracks.audioTrack, 'audio'),
                cleanupTrack(localTracks.videoTrack, 'video'),
                cleanupTrack(localTracks.screenTrack, 'screen')
            ]);

            // 3. Dừng tất cả MediaStream tracks từ browser
            try {
                console.log("[DEBUG] Stopping all browser media tracks...");
                const streams = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                    .catch(() => null);

                if (streams) {
                    streams.getTracks().forEach(track => {
                        track.enabled = false;
                        track.stop();
                        console.log("[DEBUG] Stopped browser track:", track.kind);
                    });
                }
            } catch (err) {
                console.error("[DEBUG] Error stopping browser tracks:", err);
            }

            // 4. Leave channel và cleanup client
            if (clientRef.current) {
                try {
                    console.log("[DEBUG] Leaving channel...");
                    await clientRef.current.leave();
                    clientRef.current.removeAllListeners();
                    clientRef.current = null;
                    console.log("[DEBUG] Left channel and cleaned up client");
                } catch (err) {
                    console.error("[DEBUG] Error leaving channel:", err);
                }
            }

            // 5. Reset states và UI
            setLocalTracks({
                videoTrack: null,
                audioTrack: null,
                screenTrack: null
            });

            if (videoRef.current) {
                videoRef.current.innerHTML = '';
                console.log("[DEBUG] Cleared video container");
            }

            // 6. Gọi API end stream
            if (streamInfo?.streamId) {
                endLiveStream(
                    { streamId: streamInfo.streamId },
                    {
                        onSuccess: () => {
                            setIsLive(false);
                            setViewerCount(0);
                            localStorage.removeItem("streamInfo");
                            message.success("Đã kết thúc phát sóng!");
                            navigate("/livestreams");
                            console.log("[DEBUG] Stream ended successfully");
                        },
                        onError: (error) => {
                            console.error("[DEBUG] Error ending stream:", error);
                            message.error("Có lỗi xảy ra khi dừng phát sóng");
                        }
                    }
                );
            }
        } catch (error) {
            console.error("[DEBUG] Error in handleStopLive:", error);
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

    return (
        <Row gutter={16}>
            {/* Main Content */}
            <Col span={18}>
                <Card className="mb-4">
                    {/* Video Preview */}
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                        <div ref={videoRef} className="w-full h-full"></div>
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

            <SidebarChatComponent />
        </Row>
    );
};

export default LiveStudioPage; 