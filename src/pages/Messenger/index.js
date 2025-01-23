import { useState } from "react";
import ChatList from "../../components/Messenger/List";
import ChatWindow from "../../components/Messenger/Window";
import Sidebar from "../../components/Messenger/Sidebar";
import { chatMessages } from "../../data/chat";

export default function MessengerPage() {
  const [selectedChat, setSelectedChat] = useState(chatMessages[0]);

  return (
    <div className="flex h-full bg-white">
      {/* Danh sách chat */}
      <div className="w-[360px] border-r flex flex-col">
        <ChatList
          chats={chatMessages}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>

      {/* Cửa sổ chat */}
      <div className="flex-1 hidden md:block">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Sidebar right */}
      <div className="w-[300px] border-l hidden lg:block">
        <Sidebar chat={selectedChat} />
      </div>
    </div>
  );
} 