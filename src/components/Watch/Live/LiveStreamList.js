import LiveStreamCard from "./LiveStreamCard";
import { mockLiveStreams } from "../../../data/live-streams";

const LiveStreamList = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Live videos for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockLiveStreams.map((stream) => (
          <LiveStreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
};

export default LiveStreamList; 