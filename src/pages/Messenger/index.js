import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../../components/Messenger/List";
import ChatWindow from "../../components/Messenger/Window";
import Sidebar from "../../components/Messenger/Sidebar";
import { useGetConversation, useGetConversationById } from "../../hooks/messengerHook";

const MessengerPage = () => {
  const { data: conversations } = useGetConversation();
  const { id } = useParams();
  const { data: conversationDetail } = useGetConversationById(id);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && conversationDetail?.data) {
      setSelectedConversation(conversationDetail.data);
    } else if (!id && conversations?.data?.length > 0) {
      navigate(`/messenger/${conversations.data[0].uuid}`);
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
          <ChatWindow id={selectedConversation.uuid} />
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