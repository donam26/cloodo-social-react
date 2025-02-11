import { FaPlus } from "react-icons/fa";

const StoryItem = ({ story, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-[120px] h-[200px] rounded-lg overflow-hidden cursor-pointer group"
    >
      {story.isCreateStory ? (
        <>
          <div className="absolute inset-0 bg-white">
            <img
              src={story.user?.image}
              alt={story.user.name}
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 w-full h-1/3 bg-white">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
              <FaPlus className="text-white" />
            </div>
            <p className="text-center text-sm font-medium mt-6">
              {story.user.name}
            </p>
          </div>
        </>
      ) : (
        <>
          {story.image && (
            <img
              src={story.image}
              alt={story.user.name}
              className="object-cover group-hover:transform group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full border-4 border-blue-500 overflow-hidden">
            <img
              src={story.user?.image}
              alt={story.user.name}
              className="object-cover"
            />
          </div>
          <p className="absolute bottom-4 left-4 text-white text-sm font-medium">
            {story.user.name}
          </p>
        </>
      )}
    </div>
  );
};

export default StoryItem; 