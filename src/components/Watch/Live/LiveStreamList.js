import React, { useState } from 'react';
import { Button, Card, Avatar, Modal, Empty } from 'antd';
import { FaVideo } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useGetLiveStream } from '../../../hooks/livestreamHook';
import { Link } from 'react-router-dom';

const LiveStreamList = () => {
    const { data: livestreams, isLoading, error } = useGetLiveStream();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Video trực tiếp cho bạn</h2>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-red-500 text-center">
                        <p className="text-xl font-semibold">Đã có lỗi xảy ra</p>
                        <p className="text-gray-600">Vui lòng thử lại sau</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && (!livestreams?.data || livestreams.data.length === 0) && (
                <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
                    <div className="text-center p-8">
                        <div className="mb-4">
                            <FaVideo className="mx-auto text-6xl text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Không có video trực tiếp nào
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Hiện tại chưa có ai đang phát trực tiếp. Hãy quay lại sau nhé!
                        </p>
                        <Link to="/livestreams/create">
                            <Button type="primary" icon={<FaVideo />} size="large">
                                Tạo phát trực tiếp
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Live Streams Grid */}
            {!isLoading && !error && livestreams?.data && livestreams.data.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {livestreams.data.map(stream => (
                        <Link to={`/livestreams/watch/${stream.id}`} key={stream.id}>
                            <Card
                                hoverable
                                cover={
                                    <div className="relative">
                                        <img
                                            alt={stream.title}
                                            src={stream.image}
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
                            >
                                <Card.Meta
                                    title={stream.title}
                                    description="Đang phát trực tiếp"
                                />
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveStreamList; 