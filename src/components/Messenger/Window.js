import { Avatar, Input, Button, Tooltip, Popover } from "antd";
import { useGetConversationById } from "../../hooks/messengerHook";
import { useSelector } from "react-redux";
import { getTimeAgo } from "../../utils/time";
import { useEffect, useRef, useState, useMemo } from "react";
import { FaRegSmile, FaImage, FaThumbsUp, FaPaperPlane, FaMicrophone, FaGift, FaPhone, FaVideo, FaInfoCircle } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { BsStickies } from "react-icons/bs";
import EmojiPickerPopover from "./EmojiPickerPopover";

const ChatWindow = ({ id }) => {
    const userData = useSelector((state) => state?.user?.user);
    const { data: conversationData } = useGetConversationById(id);
    const conversation = conversationData?.data;
    const messagesEndRef = useRef(null);
    const [newMessage, setNewMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (conversation) {
            scrollToBottom();
        }
    }, [conversation]);

    const getConversationInfo = () => {
        if (!conversation) return {};
        
        if (conversation?.type === 'private') {
            const otherMember = conversation?.participants?.find(
                member => member?.id !== userData?.user?.id
            );
            return {
                name: otherMember?.name || 'Người dùng',
                image: otherMember?.image
            };
        } else {
            return {
                name: conversation.name,
                image: conversation.image,
                isGroup: true,
                firstLetter: conversation.name ? conversation.name.charAt(0).toUpperCase() : 'G'
            };
        }
    };

    const renderAvatar = () => {
        const info = getConversationInfo();
        
        if (!info.image && !info.firstLetter) return null;

        if (conversation?.type === 'private') {
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

    const handleEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowEmoji(false);
    };

    const emojiPickerContent = useMemo(() => (
        <EmojiPickerPopover onEmojiClick={handleEmojiClick} />
    ), []);

    const inputButtons = useMemo(() => [
        { icon: <FaImage className="w-5 h-5" />, tooltip: 'Thêm ảnh' },
    ], []);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Xử lý gửi tin nhắn ở đây
            setNewMessage("");
        }
    };

    const info = getConversationInfo();

    const headerButtons = useMemo(() => [
        {
            icon: <FaPhone className="w-5 h-5" />,
            tooltip: 'Gọi thoại',
            onClick: () => {/* Xử lý gọi thoại */}
        },
        {
            icon: <FaVideo className="w-5 h-5" />,
            tooltip: 'Gọi video',
            onClick: () => {/* Xử lý gọi video */}
        },
    ], []);

    if (!conversation) {
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
                            {conversation?.participants?.length} thành viên
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
                {conversation?.messages?.map(message => renderMessage(message))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                    {/* Input field */}
                    <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4">
                        <Popover 
                            content={emojiPickerContent}
                            trigger="click"
                            placement="topRight"
                            overlayClassName="emoji-picker-popover"
                            open={showEmoji}
                            onOpenChange={setShowEmoji}
                        >
                            <Button 
                                type="text" 
                                icon={<FaRegSmile className="w-5 h-5" />}
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200"
                            />
                        </Popover>

                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onPressEnter={(e) => {
                                if (!e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Aa"
                            bordered={false}
                            className="flex-1 bg-transparent"
                        />

                        <div className="flex items-center gap-1">
                            {inputButtons.map((button, index) => (
                                <Tooltip key={index} title={button.tooltip} placement="top">
                                    <Button 
                                        type="text" 
                                        icon={button.icon}
                                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200"
                                    />
                                </Tooltip>
                            ))}
                        </div>
                    </div>

                    {/* Send button */}
                    <Tooltip title={newMessage.trim() ? "Gửi" : "Gửi like"}>
                        <Button
                            type="text"
                            onClick={handleSendMessage}
                            icon={newMessage.trim() ? <FaPaperPlane className="w-5 h-5" /> : <FaThumbsUp className="w-5 h-5" />}
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                newMessage.trim() ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow; 