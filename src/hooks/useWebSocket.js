import { useContext } from 'react';
import { WebSocketContext } from '../providers/WebSocketProvider';

const useWebSocket = () => {
  const { echo } = useContext(WebSocketContext);

  const subscribeToChannel = (channelName, callback) => {
    if (!echo) return;

    return echo.private(channelName)
      .listen('.App\\Events\\MessageSent', (event) => {
        callback(event);
      });
  };

  const unsubscribeFromChannel = (channel) => {
    if (channel) {
      channel.unsubscribe();
    }
  };

  return {
    echo,
    subscribeToChannel,
    unsubscribeFromChannel,
  };
};

export default useWebSocket; 