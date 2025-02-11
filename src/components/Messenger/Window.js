import { useState } from "react";
import { FaPhone, FaVideo, FaInfoCircle, FaSmile, FaImage, FaThumbsUp, FaPaperPlane } from "react-icons/fa";
import { Avatar } from "antd";
import { useGetConversationById, useSendMessage } from "../../hooks/messengerHook";
import { useSelector } from "react-redux";

const ChatWindow = ({ id }) => {
  const [newMessage, setNewMessage] = useState("");
  const { data: conversationData } = useGetConversationById(id);
  const conversation = conversationData?.data;
  const { mutate: sendMessage } = useSendMessage();
  const currentUser = useSelector((state) => state.user.user);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        conversation_id: id,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              src={conversation?.participants[0]?.image}
              size={40}
              className="rounded-full"
            />
          </div>
          <div>
            <h2 className="font-semibold">{conversation?.participants[0]?.name}</h2>
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
      <div className="flex-1 overflow-y-auto p-4">
        {conversation?.messages?.map((message) => (
          <div
            key={message.uuid}
            className={`flex items-start gap-2 mb-4 ${
              message.sender_id.id === currentUser?.id
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            <Avatar src={message.sender_id.image} size={32} className="rounded-full" />
            <div
              className={`px-3 py-2 rounded-2xl max-w-[60%] ${
                message.sender_id.id === currentUser?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.content}</p>
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