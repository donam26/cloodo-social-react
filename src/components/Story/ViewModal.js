import { Modal } from "antd";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewerModal = ({ stories, initialIndex = 0, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef(null);
  const story = stories?.[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (open && !isPaused) {
      startProgress();
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [open, currentIndex, isPaused]);

  const startProgress = () => {
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / STORY_DURATION) * 100;

      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    }, 10);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handleStoryClick = (index) => {
    setCurrentIndex(index);
    startProgress();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, currentIndex]);

  if (!story) return null;

  const renderStoryContent = () => {
    if (story.background?.type === 'image' && story.background?.image) {
      return (
        <img
          src={story.background.image}
          alt={`Story by ${story.author?.name}`}
          className="object-contain w-full h-full"
        />
      );
    } else if (story.background?.type === 'color' && story.background?.value) {
      return (
        <div 
          className="w-full h-full"
          style={{ backgroundColor: story.background.value }}
        />
      );
    }
    return null;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ maxWidth: "100vw", top: 0, padding: 0, height: "100vh" }}
      className="story-viewer-modal"
      closable={false}
      styles={{
        mask: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        body: { height: "100vh", padding: 0 },
      }}
    >
      <div className="flex h-full bg-[#18191A]">
        {/* Main story view */}
        <div 
          className="flex-1 relative flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Progress bars */}
          <div className="absolute top-4 left-0 right-0 z-50 px-4">
            <div className="flex gap-1 max-w-[500px] mx-auto">
              {stories.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-100 rounded-full ${
                      index < currentIndex
                        ? "w-full"
                        : index === currentIndex
                        ? "transition-all duration-linear"
                        : "w-0"
                    }`}
                    style={{
                      width: index === currentIndex ? `${progress}%` : undefined,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="absolute top-8 left-0 right-0 z-40 px-4">
            <div className="flex items-center gap-3 max-w-[500px] mx-auto bg-gradient-to-b from-black/50 to-transparent p-4 rounded-t-xl">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500">
                <img
                  src={story.author?.avatar}
                  alt={story.author?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">{story.author?.name}</span>
                <span className="text-gray-300 text-sm">Đang xem</span>
              </div>
              <button
                onClick={onClose}
                className="ml-auto text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-50 
                       bg-black/20 hover:bg-black/40 p-4 rounded-full transition-all transform hover:scale-105
                       backdrop-blur-sm"
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
          )}
          {currentIndex < stories.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-50 
                       bg-black/20 hover:bg-black/40 p-4 rounded-full transition-all transform hover:scale-105
                       backdrop-blur-sm"
            >
              <FaChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Story content */}
          <div className="relative w-[400px] h-[700px] bg-black rounded-xl overflow-hidden shadow-2xl">
            {renderStoryContent()}
            {/* Text overlay if exists */}
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
          </div>
        </div>

        {/* Story list */}
        <div className="w-[350px] bg-[#242526] h-full overflow-y-auto border-l border-white/10">
          <div className="p-4">
            <h3 className="text-white/90 text-lg font-semibold mb-4 px-2">Tất cả tin</h3>
            <div className="space-y-2">
              {stories.map((s, index) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                    ${index === currentIndex 
                      ? 'bg-white/10' 
                      : 'hover:bg-white/5'}`}
                  onClick={() => handleStoryClick(index)}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white/10">
                    {s.background?.type === 'image' ? (
                      <img
                        src={s.background.image}
                        alt={s.author?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full"
                        style={{ backgroundColor: s.background?.value }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">{s.author?.name}</p>
                    <p className={`text-sm ${
                      index < currentIndex 
                        ? 'text-gray-400' 
                        : index === currentIndex 
                        ? 'text-blue-400' 
                        : 'text-gray-500'
                    }`}>
                      {index < currentIndex ? 'Đã xem' : index === currentIndex ? 'Đang xem' : 'Chưa xem'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StoryViewerModal; 