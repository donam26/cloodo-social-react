const StoryItem = ({ story, onClick }) => {
  const renderBackground = () => {
    if (story.background?.type === 'image' && story.background?.image) {
      return (
        <img
          src={story.background.image}
          alt="Story background"
          className="w-full h-full object-cover group-hover:transform group-hover:scale-105 transition-transform duration-300"
        />
      );
    } else if (story.background?.type === 'color' && story.background?.value) {
      return (
        <div 
          className="w-full h-full group-hover:transform group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundColor: story.background.value }}
        />
      );
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-[120px] h-[200px] rounded-lg overflow-hidden cursor-pointer group"
    >
      {/* Background */}
      {renderBackground()}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

      {/* Story text if exists */}
      {story.text && (
        <div 
          className="absolute"
          style={{
            left: `${story.text.position.x}px`,
            top: `${story.text.position.y}px`,
            ...story.text.style
          }}
        >
          {story.text.content}
        </div>
      )}

      {/* Author info */}
      <div className="absolute top-4 left-4 w-10 h-10 rounded-full border-4 border-blue-500 overflow-hidden">
        <img
          src={story.author?.image}
          alt={story.author?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="absolute bottom-4 left-4 text-white text-sm font-medium">
        {story.author?.name}
      </p>
    </div>
  );
};

export default StoryItem; 