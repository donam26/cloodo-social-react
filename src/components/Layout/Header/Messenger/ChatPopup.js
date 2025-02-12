import { Avatar } from "antd";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { useGetConversationById } from "../../../../hooks/messengerHook";
import { useSelector } from "react-redux";
import { getTimeAgo } from "../../../../utils/time";
import { useEffect, useRef } from "react";

const ChatPopup = ({ conversation, onClose }) => {
    const { data: messages } = useGetConversationById(conversation?.id);
    const userData = useSelector((state) => state?.user?.user);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getConversationInfo = () => {
        if (conversation.type === 'private') {
            const otherMember = messages?.data?.participants?.find(
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
        const isCurrentUser = message?.sender_id?.id === userData?.user?.id;
        
        return (
            <div key={message.uuid} className={`flex gap-2 mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && (
                    <Avatar src={message?.sender_id?.image} size={28} className="mt-1" />
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

    const info = getConversationInfo();

    return (
        <div className="chat-popup fixed bottom-0 right-[80px] w-[328px] h-[455px] bg-white rounded-t-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-2 border-b cursor-pointer">
                <div className="flex items-center gap-2">
                    {renderAvatar()}
                    <span className="font-semibold">{info.name}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MdOutlineZoomOutMap className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {messages?.data?.messages?.map(message => renderMessage(message))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t">
                <input 
                    type="text" 
                    placeholder="Aa" 
                    className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none"
                />
            </div>
        </div>
    );
};

export default ChatPopup;