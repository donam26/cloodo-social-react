import { Avatar, Button, Tooltip } from "antd";
import { useSendMessage } from "../../hooks/messengerHook";
import { useSelector } from "react-redux";
import { getTimeAgo } from "../../utils/time";
import { useEffect, useRef, useState, useMemo } from "react";
import { FaPhone, FaVideo, FaInfoCircle } from "react-icons/fa";
import VideoCall from "./VideoCall";
import "./VideoCall.css";
import InputMessage from "./InputMessage";
import { useCreateChannel } from "../../hooks/meetHook";

const ChatWindow = ({ selectedConversation }) => {
    console.log(selectedConversation);
    const userData = useSelector((state) => state?.user?.user);
    const { mutate: sendMessage } = useSendMessage();
    const messagesEndRef = useRef(null);
        const [isCallVisible, setIsCallVisible] = useState(false);
    const [isVideoCall, setIsVideoCall] = useState(false);
    const [token, setToken] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedConversation.conversation) {
            scrollToBottom();
        }
    }, [selectedConversation.conversation]);

    const getConversationInfo = () => {
        if (selectedConversation?.conversation?.type === 'private') {
            const otherMember = selectedConversation?.conversation?.participants?.find(
                member => member?.id !== userData?.user?.id
            );
            return {
                name: otherMember?.name || 'Người dùng',
                image: otherMember?.image
            };
        } else {
            return {
                name: selectedConversation?.conversation?.name,
                image: selectedConversation?.conversation?.image,
                isGroup: true,
                firstLetter: selectedConversation?.conversation?.name ? selectedConversation?.conversation?.name.charAt(0).toUpperCase() : 'G'
            };
        }
    };

    const renderAvatar = () => {
        const info = getConversationInfo();

        if (!info.image && !info.firstLetter) return null;

        if (selectedConversation?.conversation?.type === 'private') {
            return <Avatar src={info.image} size={40} />;
        } else {
            return info.image ? (
                <Avatar src={info.image} size={40} />
            ) : (
                <Avatar size={40} className="bg-blue-500 flex items-center justify-center">
                    {info.firstLetter}
                </Avatar>
            );
        }
    };

    const renderMessage = (message) => {
        const isCurrentUser = message?.sender?.id === userData?.user?.id;

        return (
            <div key={message.uuid} className={`flex gap-2 mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && (
                    <Avatar src={message?.sender?.image} size={32} className="mt-1" />
                )}
                <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                    <div className={`px-3 py-2 rounded-2xl ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                        <p className="text-sm">{message.content}</p>
                    </div>
                    {message.created_at && (
                        <span className="text-xs text-gray-500 mt-1">
                            {getTimeAgo(message.created_at)}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const handleSendMessage = (conversationId, content) => {
        sendMessage({ conversationId, content }, {
            onSuccess: () => {
                scrollToBottom();
            }
        });
    };

    const info = getConversationInfo();
    const { mutate: createChannel } = useCreateChannel();
    const handleStartCall = (video = false) => {
        createChannel({
            channelName: selectedConversation?.conversation?.id,
            uid: userData?.user?.id,
        }, {
            onSuccess: (data) => {
                setToken(data.token);
                setIsVideoCall(video);
                setIsCallVisible(true);
            }
        });
    };

    const handleEndCall = () => {
        setIsCallVisible(false);
    };

    const headerButtons = useMemo(() => [
        {
            icon: <FaPhone className="w-5 h-5" />,
            tooltip: 'Gọi thoại',
            onClick: () => handleStartCall(false)
        },
        {
            icon: <FaVideo className="w-5 h-5" />,
            tooltip: 'Gọi video',
            onClick: () => handleStartCall(true)
        },
        {
            icon: <FaInfoCircle className="w-5 h-5" />,
            tooltip: 'Thông tin hội thoại',
            onClick: () => {/* Xử lý xem thông tin */ }
        }
    ], []);

    if (!selectedConversation?.conversation) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    {renderAvatar()}
                    <div>
                        <h2 className="font-semibold text-lg">{info?.name}</h2>
                        <p className="text-sm text-gray-500">
                            {selectedConversation?.conversation?.participants?.length} thành viên
                        </p>
                    </div>
                </div>

                {/* Header buttons */}
                <div className="flex items-center gap-2">
                    {headerButtons.map((button, index) => (
                        <Tooltip key={index} title={button.tooltip} placement="bottom">
                            <Button
                                type="text"
                                icon={button.icon}
                                onClick={button.onClick}
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                            />
                        </Tooltip>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {selectedConversation?.messages?.items?.map(message => renderMessage(message))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <InputMessage
                onSendMessage={handleSendMessage}
                conversationId={selectedConversation?.conversation?.id}
            />

            {/* Video Call Modal */}
            <VideoCall
                visible={isCallVisible}
                onClose={handleEndCall}
                token={token}
                channelName={selectedConversation?.conversation?.id}
                appId={process.env.REACT_APP_AGORA_APP_ID}
                isVideo={isVideoCall}
            />
        </div>
    );
};

export default ChatWindow; 