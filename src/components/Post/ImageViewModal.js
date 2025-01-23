import { Modal } from "antd";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

const ImageViewModal = ({ images, initialIndex = 0, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      // Preload next and previous images
      const preloadImage = (src) => {
        const img = new Image();
        img.src = src;
      };
      
      if (images.length > 1) {
        const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        preloadImage(images[nextIndex]);
        preloadImage(images[prevIndex]);
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [open, currentIndex, images]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const isCurrentImageLoading = !loadedImages[currentIndex];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="100%"
      style={{ maxWidth: "100vw", top: 0, padding: 0, height: "100vh" }}
      className="image-viewer-modal"
      closable={false}
      styles={{
        mask: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        body: { height: "100vh", padding: 0 },
      }}
    >
      <div className="relative h-full flex items-center justify-center">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent z-40">
          <div className="flex items-center justify-between h-full px-6">
            <div className="text-white text-lg">
              {currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors p-2 bg-black/50 hover:bg-black/70 rounded-full"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 
                       bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all transform hover:scale-110"
            >
              <FaChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 
                       bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all transform hover:scale-110"
            >
              <FaChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-[90%] h-[90%] flex items-center justify-center">
            {isCurrentImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              key={currentIndex} // Add key to force re-render on image change
              src={images[currentIndex]}
              alt={`Ảnh bài viết ${currentIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                isCurrentImageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => handleImageLoad(currentIndex)}
            />
          </div>
        </div>

        {/* Thumbnail preview */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center h-full gap-2 px-4 overflow-x-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-transform flex-shrink-0
                          ${index === currentIndex ? "ring-2 ring-blue-500 scale-110" : "opacity-70 hover:opacity-100"}`}
                onClick={() => {
                  setCurrentIndex(index);
                }}
              >
                <img
                  src={image}
                  alt={`Ảnh bài viết ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageViewModal; 