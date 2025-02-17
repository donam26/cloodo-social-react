import { useState } from "react";
import { Card, Button, Input, Space, Col } from "antd";
import { FaCog, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
const SidebarChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const userData = useSelector((state) => state?.user?.user);
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([
                ...messages,
                {
                    id: Date.now(),
                    user: userData?.name || "Người dùng",
                    content: newMessage,
                    timestamp: new Date().toLocaleTimeString()
                }
            ]);
            setNewMessage("");
        }
    };

    return (
        < Col span={6} >
            <Card
                title="Chat"
                className="h-full"
                extra={
                    <Space>
                        <Button type="text" icon={<FaCog />} />
                        <Button type="text" icon={<FaTimes />} />
                    </Space>
                }
            >
                {/* Messages */}
                <div className="h-full overflow-y-auto mb-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="mb-4">
                            <div className="flex items-start space-x-2">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{msg.user}</span>
                                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className="absolute bottom-4 left-4 right-4">
                    <Input.TextArea
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        onPressEnter={e => {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button
                        type="primary"
                        className="mt-2 w-full"
                        onClick={handleSendMessage}
                    >
                        Gửi
                    </Button>
                </div>
            </Card>
        </Col >
    )
}

export default SidebarChat;
