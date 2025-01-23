import { useState } from "react";
import { FaPhone, FaVideo, FaInfoCircle, FaSmile, FaImage, FaThumbsUp, FaPaperPlane } from "react-icons/fa";
import { Avatar } from "antd";

const ChatWindow = ({ chat }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              src={chat?.avatar}
              alt={chat.name}
              size={40}
              className="rounded-full"
            />
            {chat.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            <p className="text-xs text-gray-500">
              {chat.isOnline ? "Đang hoạt động" : "Không hoạt động"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaPhone className="w-5 h-5 text-blue-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaVideo className="w-5 h-5 text-blue-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaInfoCircle className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isSender ? "justify-end" : "justify-start"
            }`}
          >
            {!message.isSender && (
              <Avatar
                src={chat?.avatar}
                alt={chat.name}
                size={28}
                className="rounded-full mr-2 self-end"
              />
            )}
            <div
              className={`max-w-[60%] ${
                message.isSender
                  ? "bg-blue-500 text-white rounded-[20px] rounded-tr-lg"
                  : "bg-gray-100 rounded-[20px] rounded-tl-lg"
              } px-4 py-2`}
            >
              <p>{message.content}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaSmile className="w-6 h-6 text-blue-500" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaImage className="w-6 h-6 text-blue-500" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Aa"
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={!newMessage.trim()}
          >
            {newMessage.trim() ? (
              <FaPaperPlane className="w-6 h-6 text-blue-500" />
            ) : (
              <FaThumbsUp className="w-6 h-6 text-blue-500" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 