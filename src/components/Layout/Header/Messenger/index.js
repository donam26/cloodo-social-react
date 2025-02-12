import { Avatar, Dropdown } from "antd";
import { useGetConversation } from "../../../../hooks/messengerHook";
import { FaFacebookMessenger } from "react-icons/fa";
import { getTimeAgo } from "../../../../utils/time";
import "./styles.css";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { useState } from "react";
import ChatPopup from "./ChatPopup";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ListMessenger = () => {
    const { data: conversations } = useGetConversation();
    const [activeChat, setActiveChat] = useState(null);
    const userData = useSelector((state) => state?.user?.user);

    const handleChatClick = (conversation) => {
        setActiveChat(conversation);
    };

    const getConversationInfo = (conversation) => {
        if (conversation.type === 'private') {
            // Lấy thông tin người còn lại trong cuộc trò chuyện
            const otherMember = conversation?.participants?.find(member => member?.id !== conversation?.last_message?.sender?.id);
            return {
                name: otherMember?.name,
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

    const renderAvatar = (conversation) => {
        const info = getConversationInfo(conversation);
        
        if (conversation.type === 'private') {
            return <Avatar src={info.image} size={48} />;
        } else {
            return info.image ? (
                <Avatar src={info.image} size={48} />
            ) : (
                <Avatar size={48} className="bg-blue-500 flex items-center justify-center">
                    {info.firstLetter}
                </Avatar>
            );
        }
    };

    const conversationItems = conversations?.data?.map((conversation, index) => {
        const info = getConversationInfo(conversation);
        const isCurrentUserLastMessage = conversation?.last_message?.sender?.id === userData?.user?.id;

        return {
            key: index.toString(),
            label: (
                <div 
                    className="flex items-center gap-3 p-2 w-[350px] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleChatClick(conversation)}
                >
                    {renderAvatar(conversation)}
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-[15px] text-gray-900">
                                {info.name}
                            </span>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {getTimeAgo(conversation?.last_message?.created_at)}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 truncate">
                            {isCurrentUserLastMessage ? 'Bạn: ' : ''}{conversation?.last_message?.content}
                        </span>
                    </div>
                </div>
            ),
        };
    });
      
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
                                <Link to="/messenger">
                                    <button className="w-full hover:bg-gray-100 rounded-md p-1">
                                        <MdOutlineZoomOutMap className="w-5 h-5" />
                                    </button>
                                </Link>
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