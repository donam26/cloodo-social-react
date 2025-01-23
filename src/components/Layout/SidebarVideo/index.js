import { Link } from "react-router-dom";
import { BiSearch, BiCog } from "react-icons/bi";
import { 
  MdOutlineHome,
  MdOutlineLiveTv,
  MdOutlineVideoLibrary,
  MdOutlineExplore,
  MdOutlineBookmark,
  MdOutlineSlowMotionVideo
} from "react-icons/md";

const SidebarVideo = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Video</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <BiCog className="text-xl" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search videos"
          className="w-full px-4 py-2 bg-gray-100 rounded-full pl-10"
        />
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
      </div>

      <nav className="space-y-1">
        <Link
          to="/video"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-blue-500 font-semibold"
        >
          <MdOutlineHome className="text-2xl" />
          <span>Home</span>
        </Link>
        
        <Link
          to="/video/live"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <MdOutlineLiveTv className="text-2xl" />
          <span>Live</span>
        </Link>

        <Link
          to="/video/reels"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <MdOutlineSlowMotionVideo className="text-2xl" />
          <span>Reels</span>
        </Link>

        <Link
          to="/video/shows"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <MdOutlineVideoLibrary className="text-2xl" />
          <span>Shows</span>
        </Link>

        <Link
          to="/video/explore"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <MdOutlineExplore className="text-2xl" />
          <span>Explore</span>
        </Link>

        <Link
          to="/video/saved"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
        >
          <MdOutlineBookmark className="text-2xl" />
          <span>Saved videos</span>
        </Link>
      </nav>
    </div>
  );
};

export default SidebarVideo;
