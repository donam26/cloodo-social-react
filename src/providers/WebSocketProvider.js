import { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useQueryClient } from '@tanstack/react-query';

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
    const queryClient = useQueryClient();

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
        const channel = pusher.subscribe('conversation.1');
        channel.bind('pusher:subscription_succeeded', () => {
            console.log('Subscribed to conversation.1 channel');
        });

        channel.bind('App\\Events\\MessageSent', (data) => {
            console.log('New WhatsApp message received:', data);
            // Cập nhật cache của React Query
            queryClient.setQueryData(['conversations'], (oldData) => {
                if (!oldData) return [data];
                // Kiểm tra xem tin nhắn đã tồn tại chưa
                const messageExists = oldData.some(msg => msg.id === data.id);
                if (messageExists) return oldData;
                return [...oldData, data];
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [queryClient]);

    const value = {
        pusherClient
    };
    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;