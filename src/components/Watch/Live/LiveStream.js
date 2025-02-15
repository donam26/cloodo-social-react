import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { Button, Input, message } from 'antd';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaStop } from 'react-icons/fa';

const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

const LiveStream = ({ 
    channelName,
    appId,
    token,
    uid,
    role = "host", // 'host' hoặc 'audience'
    onEnd 
}) => {
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    const streamRef = useRef(null);

    useEffect(() => {
        const initializeLiveStream = async () => {
            try {
                // Thiết lập client role
                await client.setClientRole(role);
                
                // Đăng ký các event listeners
                client.on("user-published", handleUserPublished);
                client.on("user-unpublished", handleUserUnpublished);
                client.on("user-joined", handleUserJoined);
                client.on("user-left", handleUserLeft);

                // Join channel
                await client.join(appId, channelName, token, uid);

                if (role === "host") {
                    // Tạo và publish tracks cho host
                    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                    const videoTrack = await AgoraRTC.createCameraVideoTrack();
                    
                    setLocalAudioTrack(audioTrack);
                    setLocalVideoTrack(videoTrack);
                    
                    await client.publish([audioTrack, videoTrack]);
                    videoTrack.play(streamRef.current);
                }

                setIsStreaming(true);
            } catch (error) {
                console.error("Error initializing livestream:", error);
                message.error("Không thể bắt đầu livestream. Vui lòng thử lại!");
            }
        };

        initializeLiveStream();

        return () => cleanup();
    }, [channelName, appId, token, uid, role]);

    const handleUserPublished = async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === "video") {
            setRemoteUsers(prev => [...prev, user]);
        }
        if (mediaType === "audio") {
            user.audioTrack?.play();
        }
    };

    const handleUserUnpublished = (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    const handleUserJoined = () => {
        setViewerCount(prev => prev + 1);
    };

    const handleUserLeft = () => {
        setViewerCount(prev => Math.max(0, prev - 1));
    };

    const cleanup = async () => {
        try {
            if (localAudioTrack) {
                localAudioTrack.stop();
                localAudioTrack.close();
            }
            if (localVideoTrack) {
                localVideoTrack.stop();
                localVideoTrack.close();
            }
            
            // Leave the channel
            await client.leave();
            
            setLocalAudioTrack(null);
            setLocalVideoTrack(null);
            setRemoteUsers([]);
            setIsStreaming(false);
            
            if (onEnd) onEnd();
        } catch (error) {
            console.error("Error during cleanup:", error);
        }
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

    const handleComment = () => {
        if (newComment.trim()) {
            setComments(prev => [...prev, {
                id: Date.now(),
                content: newComment,
                user: "Current User" // Thay thế bằng thông tin user thực
            }]);
            setNewComment('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            {/* Stream View */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <div 
                    ref={streamRef} 
                    className="w-full h-full bg-black rounded-lg overflow-hidden"
                >
                    {role === "audience" && remoteUsers.length > 0 && (
                        <div ref={el => remoteUsers[0].videoTrack?.play(el)} className="w-full h-full" />
                    )}
                </div>
                
                {/* Viewer count */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {viewerCount} người xem
                </div>
            </div>

            {/* Controls for host */}
            {role === "host" && (
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        shape="circle"
                        icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                        onClick={toggleMute}
                        className={`text-xl ${isMuted ? 'bg-red-500 text-white' : ''}`}
                    />
                    <Button
                        shape="circle"
                        icon={isVideoOff ? <FaVideoSlash /> : <FaVideo />}
                        onClick={toggleVideo}
                        className={`text-xl ${isVideoOff ? 'bg-red-500 text-white' : ''}`}
                    />
                    <Button
                        shape="circle"
                        icon={<FaStop />}
                        onClick={cleanup}
                        className="bg-red-500 text-white text-xl"
                    />
                </div>
            )}

            {/* Comments section */}
            <div className="mt-4 border-t pt-4">
                <div className="h-60 overflow-y-auto mb-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="mb-2">
                            <span className="font-semibold">{comment.user}: </span>
                            <span>{comment.content}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        onPressEnter={handleComment}
                    />
                    <Button type="primary" onClick={handleComment}>
                        Gửi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LiveStream; 