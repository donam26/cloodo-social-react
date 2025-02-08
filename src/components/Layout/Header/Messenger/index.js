import { Avatar, Dropdown } from "antd";
import { useGetConversation } from "../../../../hooks/messengerHook";
import { FaFacebookMessenger } from "react-icons/fa";
import { getTimeAgo } from "../../../../utils/time";
import "./styles.css";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { useState } from "react";
import ChatPopup from "./ChatPopup";



const ListMessenger = () => {
    const { data: conversations } = useGetConversation();
    const [activeChat, setActiveChat] = useState(null);

    const handleChatClick = (conversation) => {
        setActiveChat(conversation);
    };

    const conversationItems = conversations?.data?.map((conversation, index) => ({
        key: index.toString(),
        label: (
          <div 
            className="flex items-center gap-3 p-2 w-[350px] cursor-pointer hover:bg-gray-100"
            onClick={() => handleChatClick(conversation)}
          >
            <Avatar src={conversation.last_message.sender_id.image} size={48} />
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-[15px] text-gray-900">{conversation.name}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{getTimeAgo(conversation.last_message.created_at)}</span>
                </div>
                <span className="text-sm text-gray-500 truncate">{conversation.last_message.content}</span>
            </div>
          </div>
        ),
    }));
      
    return (
        <>
            <Dropdown 
                menu={{ 
                    items: conversationItems,
                    className: "messenger-menu"
                }} 
                placement="bottomRight" 
                arrow={{ pointAtCenter: true }} 
                trigger={['click']}
                overlayClassName="messenger-dropdown"
                dropdownRender={(menu) => (
                    <div className="messenger-dropdown-content shadow-md">
                        <div className="flex justify-between items-center px-3 pb-2 border-b">
                            <h4 className="text-xl font-bold pt-1">Tin nhắn</h4>
                            <div className="flex justify-between gap-1 items-center">
                                <button className="w-full hover:bg-gray-100 rounded-md p-1">
                                    <IoCreateOutline className="w-5 h-5" />
                                </button>
                                <button className="w-full hover:bg-gray-100 rounded-md p-1">
                                    <MdOutlineZoomOutMap className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        {menu}
                    </div>
                )}
            >
                <button className="p-2 hover:bg-gray-200 rounded-full">
                    <FaFacebookMessenger className="w-6 h-6" />
                </button>
            </Dropdown>

            {activeChat && (
                <ChatPopup
                    conversation={activeChat} 
                    onClose={() => setActiveChat(null)}
                />
            )}
        </>
    );
};

export default ListMessenger;