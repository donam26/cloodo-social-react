import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../../components/Messenger/List";
import ChatWindow from "../../components/Messenger/Window";
import Sidebar from "../../components/Messenger/Sidebar";
import { useGetConversation, useGetConversationById } from "../../hooks/messengerHook";

const MessengerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: conversations } = useGetConversation();
  const { data: conversationDetail } = useGetConversationById(id);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    // Nếu có id trên URL và có dữ liệu chi tiết
    if (id && conversationDetail?.data) {
      setSelectedConversation(conversationDetail.data);
    } 
    // Nếu không có id nhưng có danh sách chat, tự động chọn chat đầu tiên
    else if (!id && conversations?.data?.length > 0) {
      const firstConversation = conversations.data[0];
      navigate(`/messenger/${firstConversation.id}`);
      setSelectedConversation(firstConversation);
    }
  }, [id, conversationDetail, conversations, navigate]);

  return (
    <div className="flex h-full bg-white">
      {/* Danh sách chat */}
      <div className="w-[360px] border-r flex flex-col">
        <ChatList
          conversations={conversations?.data}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Cửa sổ chat */}
      <div className="flex-1 hidden md:block">
        {selectedConversation ? (
          <ChatWindow id={selectedConversation.id} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Sidebar right */}
      <div className="w-[300px] border-l hidden lg:block">
        <Sidebar conversation={selectedConversation} />
      </div>
    </div>
  );
}

export default MessengerPage;