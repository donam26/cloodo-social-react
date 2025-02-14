import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../../components/Messenger/List";
import ChatWindow from "../../components/Messenger/Window";
import Sidebar from "../../components/Messenger/Sidebar";
import { useGetConversation, useGetConversationById } from "../../hooks/messengerHook";
import { Button } from "antd";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";

const MessengerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: conversations } = useGetConversation();
  const { data: conversationDetail } = useGetConversationById(id);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    // Nếu có id trên URL và có dữ liệu chi tiết
    if (id && conversationDetail?.data) {
      setSelectedConversation(conversationDetail.data);
      // Ẩn danh sách chat trên mobile khi có conversation được chọn
      if (window.innerWidth < 768) {
        setShowChatList(false);
      }
    } 
    // Nếu không có id nhưng có danh sách chat, tự động chọn chat đầu tiên
    else if (!id && conversations?.data?.length > 0) {
      const firstConversation = conversations.data[0];
      navigate(`/messenger/${firstConversation.id}`);
      setSelectedConversation(firstConversation);
    }
  }, [id, conversationDetail, conversations, navigate]);

  // Handle back button on mobile
  const handleBack = () => {
    setShowChatList(true);
    setSelectedConversation(null);
    navigate('/messenger');
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-white relative overflow-hidden">
      {/* Danh sách chat */}
      <div className={`w-full md:w-[360px] border-r flex-shrink-0 flex flex-col absolute md:relative h-full bg-white z-20 transition-transform duration-300 ${
        showChatList ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <ChatList
          conversations={conversations?.data}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-1 relative">
        {/* Cửa sổ chat */}
        <div className={`flex-1 flex flex-col h-full bg-white transition-all duration-300 ${
          showSidebar ? 'lg:mr-[300px]' : ''
        }`}>
          {selectedConversation ? (
            <>
              {/* Mobile header */}
              <div className="md:hidden flex items-center justify-between px-4 py-2 border-b bg-white">
                <Button 
                  type="text" 
                  icon={<FaArrowLeft />} 
                  onClick={handleBack}
                  className="flex items-center"
                >
                  Trở về
                </Button>
                <Button
                  type="text"
                  icon={<FaInfoCircle />}
                  onClick={toggleSidebar}
                  className="flex items-center"
                >
                  Chi tiết
                </Button>
              </div>
              
              <ChatWindow selectedConversation={selectedConversation} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>

        {/* Sidebar right */}
        <div className={`w-[300px] border-l bg-white h-full fixed lg:relative right-0 top-0 transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } ${
          !selectedConversation ? 'lg:hidden' : ''
        }`}>
          <div className="lg:hidden flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Chi tiết cuộc trò chuyện</h3>
            <Button type="text" onClick={toggleSidebar}>
              ✕
            </Button>
          </div>
          <div className="h-full overflow-y-auto">
            <Sidebar conversation={selectedConversation} />
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default MessengerPage;