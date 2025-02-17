import { Avatar, Button } from "antd";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { FaPhone, FaVideo, FaFacebookMessenger } from "react-icons/fa";
import { useCreateConversation, useSendMessage } from "../../../../hooks/messengerHook";
import InputMessage from "../../../Messenger/InputMessage";

const TempChatPopup = ({ user, onClose, onConversationCreated }) => {
    const { mutateAsync: createConversation } = useCreateConversation();
    const { mutate: sendMessage } = useSendMessage();

    const handleSendMessage = async (_, content) => {
        try {
            // Tạo cuộc trò chuyện mới
            const result = await createConversation({ 
                type: 'private',
                participants: [user.id]
            });
            
            // Gửi tin nhắn đầu tiên
            sendMessage({ 
                conversationId: result.data.id, 
                content 
            });

            // Đóng TempChatPopup và mở ChatPopup với cuộc trò chuyện mới
            onClose();
            onConversationCreated(result.data);
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    return (
        <div className="chat-popup fixed bottom-0 right-[80px] w-[328px] h-[455px] bg-white rounded-t-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar src={user.image} size={32} />
                    <span className="font-semibold">{user.name}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        type="text"
                        icon={<FaPhone className="w-3.5 h-3.5" />}
                        className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full"
                        disabled
                    />
                    <Button
                        type="text"
                        icon={<FaVideo className="w-3.5 h-3.5" />}
                        className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-full"
                        disabled
                    />
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
            
            {/* Empty message area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Avatar src={user.image} size={64} className="border-4 border-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">Chưa có cuộc trò chuyện nào</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaFacebookMessenger className="w-4 h-4" />
                        <span>Hãy gửi lời chào để bắt đầu cuộc trò chuyện</span>
                    </div>
                </div>
            </div>
            
            {/* Input Message */}
            <InputMessage 
                onSendMessage={handleSendMessage}
                conversationId={null}
            />
        </div>
    );
};

export default TempChatPopup; 