import { Input, Button, Tooltip, Popover } from "antd";
import { useState, useMemo } from "react";
import { FaRegSmile, FaImage, FaThumbsUp, FaPaperPlane } from "react-icons/fa";
import EmojiPickerPopover from "./EmojiPickerPopover";

const InputMessage = ({ onSendMessage, conversationId }) => {
    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    const handleEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
        setShowEmoji(false);
    };

    const handleSendMessage = (isLike = false) => {
        if (isLike) {
            onSendMessage(conversationId, "👍");
            return;
        }
        
        if (message.trim()) {
            onSendMessage(conversationId, message.trim());
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const emojiPickerContent = useMemo(() => (
        <EmojiPickerPopover onEmojiClick={handleEmojiClick} />
    ), []);

    const inputButtons = useMemo(() => [
        { 
            icon: <FaRegSmile className="w-5 h-5" />, 
            tooltip: 'Chọn biểu tượng cảm xúc',
            onClick: () => setShowEmoji(!showEmoji)
        },
        { 
            icon: <FaImage className="w-5 h-5" />, 
            tooltip: 'Thêm ảnh'
        }
    ], [showEmoji]);

    return (
        <div className="p-2 border-t">
            <div className="flex items-end gap-2">
                <div className="flex-1 flex items-end gap-2 items-center">
                    {inputButtons.map((button, index) => (
                        button.icon.type === FaRegSmile ? (
                            <Popover
                                key={index}
                                content={emojiPickerContent}
                                trigger="click"
                                open={showEmoji}
                                onOpenChange={setShowEmoji}
                                placement="topRight"
                            >
                                <Tooltip title={button.tooltip} placement="top">
                                    <Button
                                        type="text"
                                        icon={button.icon}
                                        onClick={button.onClick}
                                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
                                    />
                                </Tooltip>
                            </Popover>
                        ) : (
                            <Tooltip key={index} title={button.tooltip} placement="top">
                                <Button
                                    type="text"
                                    icon={button.icon}
                                    onClick={button.onClick}
                                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
                                />
                            </Tooltip>
                        )
                    ))}
                    <Input.TextArea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Aa"
                        autoSize={{ minRows: 1, maxRows: 5 }}
                        className="rounded-full resize-none"
                    />
                </div>
                <Tooltip title={message.trim() ? "Gửi tin nhắn" : "Gửi nút Like"}>
                    <Button
                        type="text"
                        icon={message.trim() ? <FaPaperPlane className="w-5 h-5" /> : <FaThumbsUp className="w-5 h-5" />}
                        onClick={() => handleSendMessage(!message.trim())}
                        className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors ${
                            message.trim() ? 'text-blue-500 hover:text-blue-600' : ''
                        }`}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default InputMessage;