import { Modal } from "antd";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";


const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewerModal = ({ stories, initialIndex = 0, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef(null);
  const story = stories[currentIndex];

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
      <div className="flex h-full">
        {/* Main story view */}
        <div className="flex-1 relative flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-50 p-2">
            <div className="flex gap-1">
              {stories.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-white/30 rounded overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-100 ${
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
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className="object-cover"
                />
              </div>
              <span className="text-white font-medium">{story.user.name}</span>
              <button
                onClick={onClose}
                className="ml-auto text-white hover:text-gray-300 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 
                       bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all transform hover:scale-110"
            >
              <FaChevronLeft className="w-8 h-8" />
            </button>
          )}
          {currentIndex < stories.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 
                       bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all transform hover:scale-110"
            >
              <FaChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Story content */}
          {story.image && (
            <div className="relative w-[500px] h-[800px] bg-black rounded-lg overflow-hidden">
              <img
                src={story.image}
                alt={`Story by ${story.user.name}`}
                className="object-contain"
                quality={100}
                priority
              />
            </div>
          )}
        </div>

        {/* Story list */}
        <div className="w-[400px] bg-[#242526] h-full overflow-y-auto">
          <div className="p-4">
            <h3 className="text-white text-lg font-semibold mb-4">Tất cả tin</h3>
            <div className="space-y-3">
              {stories.map((s, index) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                    ${index === currentIndex ? 'bg-[#3a3b3c]' : 'hover:bg-[#3a3b3c]'}`}
                  onClick={() => handleStoryClick(index)}
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden">
                    <img
                      src={s.image || ''}
                      alt={s.user.name}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium">{s.user.name}</p>
                    <p className="text-gray-400 text-sm">
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