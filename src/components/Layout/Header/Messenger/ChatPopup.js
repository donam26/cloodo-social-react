import { Avatar } from "antd";
import { MdOutlineZoomOutMap } from "react-icons/md";

const ChatPopup = ({ conversation, onClose }) => {
    return (
        <div className="chat-popup fixed bottom-0 right-[80px] w-[328px] h-[455px] bg-white rounded-t-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-2 border-b cursor-pointer">
                <div className="flex items-center gap-2">
                    <Avatar src={conversation.last_message.sender_id.image} size={32} />
                    <span className="font-semibold">{conversation.name}</span>
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
                {/* Chat messages will go here */}
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