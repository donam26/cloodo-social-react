import { useState, useRef, useEffect } from "react";
import StoryItem from "./Item";
import CreateModal from "./CreateModal";
import ViewModal from "./ViewModal";
import { stories } from "../../data/stories";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Story = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        setShowNavButtons(hasOverflow);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleStoryClick = (storyId) => {
    const story = stories.find((s) => s.id === storyId);
    if (story?.isCreateStory) {
      setIsCreateModalOpen(true);
    } else {
      const index = stories.findIndex((s) => s.id === storyId);
      if (index !== -1) {
        setSelectedStoryIndex(index);
        setIsViewerOpen(true);
      }
    }
  };

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Story list */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stories.map((story) => (
            <StoryItem
              key={story.id}
              story={story}
              onClick={() => handleStoryClick(story.id)}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        {showNavButtons && (
          <>
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 
                     hover:bg-gray-100 transition-colors z-10 group"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 
                     hover:bg-gray-100 transition-colors z-10 group"
              aria-label="Scroll right"
            >
              <FaChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <ViewModal
        stories={stories.filter((s) => !s.isCreateStory)}
        initialIndex={Math.max(0, selectedStoryIndex - 1)}
        open={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
};

export default Story; 