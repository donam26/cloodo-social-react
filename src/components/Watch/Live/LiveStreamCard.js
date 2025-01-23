import { Avatar } from "antd";
import { BiLike, BiComment, BiShare } from "react-icons/bi";
import { Link } from "react-router-dom";

const LiveStreamCard = ({ stream }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Link to={`/livestream/${stream.id}`}>
        <div className="relative aspect-video">
          <Avatar
            src={stream.thumbnail}
            alt={stream.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <span className="bg-red-600 text-white px-2 py-0.5 text-sm rounded">
              LIVE
            </span>
            <span className="bg-black/50 text-white px-2 py-0.5 text-sm rounded">
              {stream.viewerCount} viewers
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar
            src={stream.streamer.avatar}
            alt={stream.streamer.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold">{stream.title}</h3>
            <p className="text-sm text-gray-600">{stream.streamer.name}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
            <BiLike className="text-xl" />
            <span>{stream.likeCount}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
            <BiComment className="text-xl" />
            <span>{stream.commentCount}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
            <BiShare className="text-xl" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamCard; 