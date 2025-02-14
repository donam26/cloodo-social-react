import { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { addUnreadMessage } from '../redux/features/messenger/messengerSlice';

export const WebSocketContext = createContext();

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

const WebSocketProvider = ({ children }) => {
    const [pusherClient, setPusherClient] = useState(null);
    const [newMessageInfo, setNewMessageInfo] = useState(null);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.user?.user);

    useEffect(() => {
        const pusher = new Pusher('4geu7tpxuskfouaezc8x', {
            cluster: 'mt1',
            wsHost: '127.0.0.1',
            wsPort: 6001,
            forceTLS: false,
            encrypted: false,
            enabledTransports: ['ws', 'wss'],
            disableStats: true
        });

        setPusherClient(pusher);
        const channel = pusher.subscribe('messagesNew');
        
        channel.bind('pusher:subscription_succeeded', () => {
            console.log('Subscribed to messagesNew channel');
        });

        channel.bind('App\\Events\\MessageSent', (data) => {
            console.log('New message received:', data);
            
            // Lấy message từ response
            const message = data.message;
            
            const newMessage = {
                uuid: message.id,
                content: message.content,
                conversation: message.conversation_id,
                sender: message.sender,
                created_at: message.created_at
            };
            console.log('newMessage' ,newMessage);  

            // Nếu người gửi không phải là người dùng hiện tại
            if (message.sender.id !== userData?.user?.id) {
                dispatch(addUnreadMessage({ conversationId: message.conversation_id }));
                
                // Lấy thông tin conversation từ cache
                const conversationData = queryClient.getQueryData(['conversations']);
                const conversation = conversationData?.data?.find(conv => conv.id === message.conversation_id);
                
                if (conversation) {
                    // Set thông tin tin nhắn mới để mở popup
                    setNewMessageInfo({
                        message: newMessage,
                        conversation: conversation
                    });
                }
            }

            // Cập nhật cache cho conversation detail
            const conversationId = message.conversation_id;
            const oldData = queryClient.getQueryData(['conversation', conversationId]);

            if (oldData) {
                const newData = {
                    ...oldData,
                    data: {
                        conversation: oldData.data.conversation,
                        messages: {
                            ...oldData.data.messages,
                            total: oldData.data.messages.total + 1,
                            items: [...oldData.data.messages.items, newMessage]
                        }
                    }
                };

                // Cập nhật cache conversation detail
                queryClient.setQueryData(['conversation', conversationId], newData);
            }

            // Cập nhật cache cho danh sách conversations
            const oldConversations = queryClient.getQueryData(['conversations']);
            if (oldConversations) {
                const newConversations = {
                    ...oldConversations,
                    data: oldConversations.data.map(conv => {
                        if (conv.id === conversationId) {
                            return {
                                ...conv,
                                last_message: newMessage
                            };
                        }
                        return conv;
                    })
                };

                // Cập nhật cache conversations
                queryClient.setQueryData(['conversations'], newConversations);
            }

            // Thông báo cho React Query biết data đã thay đổi
            queryClient.invalidateQueries({
                queryKey: ['conversation', conversationId],
                exact: true,
                refetchType: 'none'
            });

            queryClient.invalidateQueries({
                queryKey: ['conversations'],
                exact: true,
                refetchType: 'none'
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [queryClient, dispatch, userData]);

    const value = {
        pusherClient,
        newMessageInfo,
        setNewMessageInfo
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;