import { useState, useRef, useEffect } from "react";
import StoryItem from "./Item";
import CreateModal from "./CreateModal";
import ViewModal from "./ViewModal";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { useCreateStory, useGetStory } from "../../hooks/storyHook";
import { useSelector } from "react-redux";
import { message } from "antd";

const Story = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const scrollContainerRef = useRef(null);

  const { data: stories, isLoading: isLoadingStories } = useGetStory();
  const { mutate: createStory } = useCreateStory();
  const userData = useSelector((state) => state?.user?.user);

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
  }, [stories?.data]);

  const handleStoryClick = (index) => {
    if (index >= 0 && index < stories?.data?.length) {
      setSelectedStoryIndex(index);
      setIsViewerOpen(true);
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

  const handleSubmit = async (storyData) => {
    try {
      // Tạo FormData để upload file
      const formData = new FormData();
      
      // Thêm background data
      if (storyData.background.type === 'image' && storyData.background.image) {
        formData.append('background[type]', 'image');
        formData.append('background[image]', storyData.background.image);
      } else {
        formData.append('background[type]', 'color');
        formData.append('background[value]', storyData.background.value);
      }

      // Thêm text data nếu có
      if (storyData.text) {
        formData.append('text[content]', storyData.text.content);
        formData.append('text[position][x]', storyData.text.position.x);
        formData.append('text[position][y]', storyData.text.position.y);
        formData.append('text[style][fontSize]', storyData.text.style.fontSize);
        formData.append('text[style][fontWeight]', storyData.text.style.fontWeight);
        formData.append('text[style][color]', storyData.text.style.color);
        formData.append('text[style][textShadow]', storyData.text.style.textShadow);
      }

      await createStory(formData);
      message.success('Đã tạo story thành công!');
    } catch (error) {
      console.error("Error creating story:", error);
      message.error('Có lỗi xảy ra khi tạo story');
    }
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedStoryIndex(0);
  };

  if (isLoadingStories) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="rounded-lg relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto custom-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Create Story Item */}
          <div 
            className="relative flex-shrink-0 w-32 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <div className="absolute inset-0">
              <img
                src={userData?.user?.image}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            <div className="absolute bottom-0 w-full h-1/3 bg-white">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                <FaPlus className="text-white" />
              </div>
              <p className="text-center text-sm font-medium mt-6">
                Tạo tin
              </p>
            </div>
          </div>

          {/* Story List */}
          {stories?.data?.map((story, index) => (
            <StoryItem
              key={story.id}
              story={story}
              onClick={() => handleStoryClick(index)}
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
        onSubmit={handleSubmit}
      />
      {stories?.data?.length > 0 && (
        <ViewModal
          stories={stories?.data}
          initialIndex={selectedStoryIndex}
          open={isViewerOpen}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default Story; 