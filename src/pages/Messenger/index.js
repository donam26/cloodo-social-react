import { useState } from "react";
import ChatList from "../../components/Messenger/List";
import ChatWindow from "../../components/Messenger/Window";
import Sidebar from "../../components/Messenger/Sidebar";
import { useGetConversation } from "../../hooks/messengerHook";

const MessengerPage = () => {
  const { data: conversations } = useGetConversation();
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-full bg-white">
      {/* Danh sách chat */}
      <div className="w-[360px] border-r flex flex-col">
        <ChatList
          conversations={conversations?.data}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>

      {/* Cửa sổ chat */}
      <div className="flex-1 hidden md:block">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
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