import React, { useState, useEffect } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { Modal, Button } from 'antd';
import { FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoCall = ({ 
    visible, 
    onClose, 
    channelName, 
    appId, // Agora App ID của bạn
    token, // Token từ Agora
    isVideo = true 
}) => {
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Xử lý sự kiện user mới tham gia
    const handleUserPublished = async (user, mediaType) => {
        try {
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
                setRemoteUsers(prev => {
                    // Kiểm tra nếu user đã tồn tại thì không thêm vào nữa
                    if (prev.find(u => u.uid === user.uid)) {
                        return prev;
                    }
                    return [...prev, user];
                });
            }
            if (mediaType === "audio") {
                user.audioTrack?.play();
            }
        } catch (error) {
            console.error("Error subscribing to user:", error);
        }
    };

    // Xử lý sự kiện user rời đi
    const handleUserUnpublished = async (user, mediaType) => {
        try {
            await client.unsubscribe(user, mediaType);
            if (mediaType === "video") {
                setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
            }
            if (mediaType === "audio") {
                user.audioTrack?.stop();
            }
        } catch (error) {
            console.error("Error unsubscribing from user:", error);
        }
    };

    // Xử lý sự kiện user rời khỏi kênh
    const handleUserLeft = (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    useEffect(() => {
        let mounted = true;

        const initCall = async () => {
            if (!visible || !mounted) return;

            try {
                if (!appId || !channelName || !token) {
                    throw new Error('Missing required parameters for video call');
                }

                // Cleanup trước khi khởi tạo cuộc gọi mới
                await cleanup();

                // Đăng ký các event listener
                client.on("user-published", handleUserPublished);
                client.on("user-unpublished", handleUserUnpublished);
                client.on("user-left", handleUserLeft);
                client.on("connection-state-change", (state) => {
                    console.log("Connection state:", state);
                    if (state === "DISCONNECTED") {
                        cleanup();
                    }
                });

                await startCall();
                setIsConnected(true);
            } catch (error) {
                console.error("Error initializing call:", error);
                if (mounted) {
                    cleanup();
                    onClose();
                }
            }
        };

        initCall();

        return () => {
            mounted = false;
            cleanup();
        };
    }, [visible, appId, channelName, token]);

    const cleanup = async () => {
        try {
            console.log("Starting cleanup...");
            
            // Remove all event listeners
            client.removeAllListeners();

            // Unsubscribe and cleanup remote users
            for (const user of remoteUsers) {
                if (user.videoTrack) {
                    user.videoTrack.stop();
                    await client.unsubscribe(user, "video");
                }
                if (user.audioTrack) {
                    user.audioTrack.stop();
                    await client.unsubscribe(user, "audio");
                }
            }

            // Close and cleanup local tracks
            if (localAudioTrack) {
                localAudioTrack.stop();
                localAudioTrack.close();
                setLocalAudioTrack(null);
            }
            if (localVideoTrack) {
                localVideoTrack.stop();
                localVideoTrack.close();
                setLocalVideoTrack(null);
            }

            // Leave channel
            if (client.connectionState === "CONNECTED") {
                await client.leave();
            }

            setRemoteUsers([]);
            setIsConnected(false);
            console.log("Cleanup completed");
        } catch (error) {
            console.error("Error during cleanup:", error);
        }
    };

    const startCall = async () => {
        try {
            console.log("Starting new call...");
            await client.join(appId, channelName, token);

            // Tạo và publish local tracks
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            setLocalAudioTrack(audioTrack);
            
            if (isVideo) {
                const videoTrack = await AgoraRTC.createCameraVideoTrack();
                setLocalVideoTrack(videoTrack);
                await client.publish([audioTrack, videoTrack]);
            } else {
                await client.publish([audioTrack]);
            }
            console.log("Call started successfully");
        } catch (error) {
            console.error("Error joining call:", error);
            throw error;
        }
    };

    const endCall = async () => {
        await cleanup();
        onClose();
    };

    const toggleMute = () => {
        if (localAudioTrack) {
            localAudioTrack.setEnabled(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localVideoTrack) {
            localVideoTrack.setEnabled(!isVideoOff);
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={endCall}
            footer={null}
            width={800}
            centered
            className="video-call-modal"
            maskClosable={false}
        >
            <div className="video-container">
                {/* Local video */}
                {isVideo && localVideoTrack && (
                    <div className="local-video">
                        <div className="video-player" ref={(ref) => ref && localVideoTrack.play(ref)}></div>
                    </div>
                )}

                {/* Remote videos */}
                <div className="remote-videos">
                    {remoteUsers.map((user) => (
                        <div key={user.uid} className="remote-video">
                            <div className="video-player" ref={(ref) => ref && user.videoTrack?.play(ref)}></div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="call-controls">
                    <Button
                        shape="circle"
                        icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                        onClick={toggleMute}
                        className={`control-button ${isMuted ? 'muted' : ''}`}
                    />
                    {isVideo && (
                        <Button
                            shape="circle"
                            icon={isVideoOff ? <FaVideoSlash /> : <FaVideo />}
                            onClick={toggleVideo}
                            className={`control-button ${isVideoOff ? 'video-off' : ''}`}
                        />
                    )}
                    <Button
                        shape="circle"
                        icon={<FaPhoneSlash />}
                        onClick={endCall}
                        className="end-call-button"
                        danger
                    />
                </div>
            </div>
        </Modal>
    );
};

export default VideoCall; 