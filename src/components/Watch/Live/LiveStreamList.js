import React, { useState } from 'react';
import { Button, Card, Avatar, Modal } from 'antd';
import { FaVideo } from 'react-icons/fa';
import LiveStream from './LiveStream';
import { useSelector } from 'react-redux';

const LiveStreamList = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedStream, setSelectedStream] = useState(null);
    const userData = useSelector((state) => state?.user?.user);

    // Mock data - thay thế bằng API call thực tế
    const liveStreams = [
        {
            id: 1,
            title: "Live Stream Demo",
            hostName: "User Demo",
            hostAvatar: "https://example.com/avatar.jpg",
            viewers: 150,
            thumbnail: "https://example.com/thumbnail.jpg"
        }
    ];

    const startNewStream = () => {
        setIsCreateModalVisible(true);
    };

    const watchStream = (stream) => {
        setSelectedStream(stream);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Livestream</h2>
                <Button
                    type="primary"
                    icon={<FaVideo />}
                    onClick={startNewStream}
                    className="flex items-center gap-2"
                >
                    Bắt đầu livestream
                </Button>
            </div>

            {/* Live Streams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveStreams.map(stream => (
                    <Card
                        key={stream.id}
                        hoverable
                        cover={
                            <div className="relative">
                                <img
                                    alt={stream.title}
                                    src={stream.thumbnail}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                                    {stream.viewers} người xem
                                </div>
                                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                    <Avatar src={stream.hostAvatar} />
                                    <span className="text-white font-medium drop-shadow-lg">
                                        {stream.hostName}
                                    </span>
                                </div>
                            </div>
                        }
                        onClick={() => watchStream(stream)}
                    >
                        <Card.Meta
                            title={stream.title}
                            description="Đang phát trực tiếp"
                        />
                    </Card>
                ))}
            </div>

            {/* Create Stream Modal */}
            <Modal
                title="Bắt đầu Livestream"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
                width={800} 
            >
                <LiveStream
                    channelName="channel-name" 
                    appId={process.env.REACT_APP_AGORA_APP_ID}
                    token={"007eJxTYKiwvm+73e1sVPXk7Eoxofgo3QWMjB4Gt8+ErPxz5jp/lbACQ7K5sYmRQaphsqGJgYmJeZqlpZFxcqqZsYlhSqpBikXaFMcN6Q2BjAy+mY8ZGKEQxOdhSM5IzMtLzdHNS8xNZWAAAKThIGs="} 
                    uid={userData?.id}
                    role="host"
                    onEnd={() => setIsCreateModalVisible(false)}
                />
            </Modal>

            {/* Watch Stream Modal */}
            <Modal
                title={selectedStream?.title}
                open={!!selectedStream}
                onCancel={() => setSelectedStream(null)}
                footer={null}
                width={800}
            >
                {selectedStream && (
                    <LiveStream
                        channelName={`channel-${selectedStream.id}`} // Thay thế bằng channel thực
                        appId="your-app-id"
                        token="your-token"
                        uid={userData?.id}
                        role="audience"
                        onEnd={() => setSelectedStream(null)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default LiveStreamList; 