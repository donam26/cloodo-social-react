import VideoCard from "./VideoCard";
import { mockVideos } from "../../../data/video";

const VideoList = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Live videos for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoList; 