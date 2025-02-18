import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../../components/Messenger/List";
import ChatWindow from "../../components/Messenger/Window";
import Sidebar from "../../components/Messenger/Sidebar";
import { useGetConversation, useGetConversationById } from "../../hooks/messengerHook";
import { Button } from "antd";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const MessengerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: conversations } = useGetConversation();
  const { data: conversationDetail } = useGetConversationById(id);
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= TABLET_BREAKPOINT);
  const [showChatList, setShowChatList] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const [isTablet, setIsTablet] = useState(window.innerWidth < TABLET_BREAKPOINT && window.innerWidth >= MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newIsMobile = width < MOBILE_BREAKPOINT;
      const newIsTablet = width < TABLET_BREAKPOINT && width >= MOBILE_BREAKPOINT;
      
      setIsMobile(newIsMobile);
      setIsTablet(newIsTablet);
      
      if (width >= MOBILE_BREAKPOINT) {
        setShowChatList(true);
      }

      // Auto show sidebar on desktop
      if (width >= TABLET_BREAKPOINT) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (id && conversationDetail?.data) {
      setSelectedConversation(conversationDetail.data);
      if (isMobile) {
        setShowChatList(false);
      }
    } 
    else if (!id && conversations?.data?.length > 0) {
      navigate(`/messenger/${conversations.data[0].id}`);
    }
    else if (id && !conversationDetail?.data && conversations?.data) {
      const conversationExists = conversations.data.some(conv => conv.id === id);
      if (!conversationExists) {
        navigate('/messenger');
      }
    }
  }, [id, conversationDetail, conversations, navigate, isMobile]);

  const handleBack = () => {
    setShowChatList(true);
    setSelectedConversation(null);
    navigate('/messenger');
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const renderMobileHeader = () => (
    <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
      <Button 
        type="text" 
        icon={<FaArrowLeft />} 
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        Trở về
      </Button>
      <Button
        type="text"
        icon={<FaInfoCircle />}
        onClick={toggleSidebar}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        Chi tiết
      </Button>
    </div>
  );

  const renderChatList = () => (
    <div 
      className={`
        h-full bg-white
        ${isMobile ? 'w-full fixed inset-0 z-30' : 'w-[360px] border-r flex-shrink-0'}
        ${isTablet ? 'w-[280px]' : ''}
        transition-transform duration-300 ease-in-out
        ${(isMobile && !showChatList) ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      <ChatList
        conversations={conversations?.data}
        selectedConversation={selectedConversation}
      />
    </div>
  );

  const renderChatWindow = () => (
    <div 
      className={`
        flex-1 flex flex-col h-full bg-white 
        transition-all duration-300 ease-in-out
        ${(!isMobile && !isTablet && showSidebar) ? 'mr-[320px]' : ''}
      `}
    >
      {selectedConversation ? (
        <>
          {isMobile && renderMobileHeader()}
          <ChatWindow selectedConversation={selectedConversation} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center px-4">
            Chọn một cuộc trò chuyện hoặc bắt đầu cuộc trò chuyện mới
          </p>
        </div>
      )}
    </div>
  );

  const renderSidebar = () => (
    <>
      {selectedConversation && (
        <div 
          className={`
            h-full bg-white border-l
            ${isMobile || isTablet ? 'fixed right-0 top-0 z-40 w-[320px]' : 'w-[320px] absolute right-0'}
            transition-all duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className={`${!isMobile && !isTablet ? 'hidden' : 'flex'} justify-between items-center p-4 border-b`}>
            <h3 className="font-semibold text-gray-900">Chi tiết cuộc trò chuyện</h3>
            <Button 
              type="text" 
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </Button>
          </div>
          <div className="h-[calc(100%-60px)] overflow-y-auto">
            <Sidebar conversation={selectedConversation?.conversation} />
          </div>
        </div>
      )}

      {/* Overlay for mobile/tablet */}
      {selectedConversation && (isMobile || isTablet) && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );

  return (
    <div className="flex h-full bg-white relative">
      {/* Chat List */}
      {renderChatList()}
      
      {/* Main Chat Area */}
      <div className="flex flex-1 relative h-full overflow-hidden">
        {renderChatWindow()}
        {renderSidebar()}
      </div>
    </div>
  );
}

export default MessengerPage;