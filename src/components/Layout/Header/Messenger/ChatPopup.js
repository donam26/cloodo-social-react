import { Avatar, Button } from "antd";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { FaPhone, FaVideo } from "react-icons/fa";
import { useGetConversationById, useSendMessage } from "../../../../hooks/messengerHook";
import { useSelector } from "react-redux";
import { getTimeAgo } from "../../../../utils/time";
import { useEffect, useRef, useState } from "react";
import VideoCall from "../../../Messenger/VideoCall";
import InputMessage from "../../../Messenger/InputMessage";
import { Link } from "react-router-dom";
import { useCreateChannel } from "../../../../hooks/meetHook";

const ChatPopup = ({ conversation, onClose }) => {
    const { data: messages } = useGetConversationById(conversation?.id);
    const { mutate: sendMessage } = useSendMessage();
    const userData = useSelector((state) => state?.user?.user);
    const messagesEndRef = useRef(null);
    const [isCallVisible, setIsCallVisible] = useState(false);
    const [isVideoCall, setIsVideoCall] = useState(true);
    const [token, setToken] = useState(null);
    const { mutate: createChannel } = useCreateChannel();

    const handleStartCall = (video = false) => {
        createChannel({
            channelName: conversation?.id,
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (conversationId, content) => {
        sendMessage({ conversationId, content }, {
            onSuccess: () => {
                scrollToBottom();
            }
        });
    };

    const getConversationInfo = () => {
        if (conversation.type === 'private') {
            const otherMember = messages?.data?.conversation?.participants?.find(
                member => member?.id !== userData?.user?.id
            );
            return {
                name: otherMember?.name || 'Người dùng',
                image: otherMember?.image
            };
        } else {
            return {
                name: messages?.data?.name || conversation?.name,
                image: messages?.data?.image || conversation?.image,
                isGroup: true,
                firstLetter: (messages?.data?.name || conversation?.name || 'G').charAt(0).toUpperCase()
            };
        }
    };

    const renderAvatar = () => {
        const info = getConversationInfo();
        
        if (conversation.type === 'private') {
            return <Avatar src={info.image} size={32} />;
        } else {
            return info.image ? (
                <Avatar src={info.image} size={32} />
            ) : (
                <Avatar size={32} className="bg-blue-500 flex items-center justify-center">
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
                    <Avatar src={message?.sender?.image} size={28} className="mt-1" />
                )}
                <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                    <div className={`px-3 py-2 rounded-2xl ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                        <p className="text-sm">{message?.content}</p>
                    </div>
                    {message?.created_at && (
                        <span className="text-xs text-gray-500 mt-1">
                            {getTimeAgo(message?.created_at)}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const info = getConversationInfo();

    return (
        <>
            <div className="chat-popup fixed bottom-0 right-[80px] w-[328px] h-[455px] bg-white rounded-t-lg shadow-lg flex flex-col">
                <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center gap-2 cursor-pointer">
                        {renderAvatar()}
                        <span className="font-semibold">{info.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Call Buttons */}
                        <Button
                            type="text"
                            icon={<FaPhone className="w-3.5 h-3.5" />}
                            onClick={() => handleStartCall(false)}
                            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full"
                        />
                        <Button
                            type="text"
                            icon={<FaVideo className="w-3.5 h-3.5" />}
                            onClick={() => handleStartCall(true)}
                            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full"
                        />
                        <Link to={`/messenger/${conversation?.id}`}>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <MdOutlineZoomOutMap className="w-4 h-4" />
                            </button>
                        </Link>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {messages?.data?.messages?.items?.map(message => renderMessage(message))}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Input Message */}
                <InputMessage 
                    onSendMessage={handleSendMessage}
                    conversationId={conversation?.id}
                />
            </div>

            {/* Video Call Modal */}
            <VideoCall
                visible={isCallVisible}
                onClose={handleEndCall}
                channelName={conversation?.id}
                appId={process.env.REACT_APP_AGORA_APP_ID}
                token={token}
                isVideo={isVideoCall}
            />
        </>
    );
};

export default ChatPopup;