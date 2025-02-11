"use client";

import { useState } from "react";
import ImageViewModal from "./ImageViewModal";

const PostImages = ({ images }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  if (!images?.length) return null;

  // Chuẩn hóa mảng ảnh để lấy đúng URL
  const normalizedImages = images.map(img => (typeof img === 'string' ? img : img?.image));

  if (images.length === 1) {
    return (
      <>
        <div
          className="relative w-full max-h-[500px] cursor-pointer overflow-hidden group mt-3"
          onClick={() => handleImageClick(0)}
        >
          <img
            src={normalizedImages[0]}
            alt="Ảnh bài viết"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <ImageViewModal
          images={normalizedImages}
          initialIndex={selectedImageIndex}
          open={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      </>
    );
  }

  if (images.length === 2) {
    return (
      <>
        <div className="grid grid-cols-2 gap-1 mt-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] cursor-pointer overflow-hidden group"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={normalizedImages[index]}
                alt={`Ảnh bài viết ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
        <ImageViewModal
          images={normalizedImages}
          initialIndex={selectedImageIndex}
          open={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      </>
    );
  }

  if (images.length === 3) {
    return (
      <>
        <div className="grid grid-cols-2 gap-1 mt-3">
          <div
            className="relative aspect-square cursor-pointer overflow-hidden group"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={normalizedImages[0]}
              alt="Ảnh bài viết 1"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
          <div className="grid grid-rows-2 gap-1">
            {images.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] cursor-pointer overflow-hidden group"
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={normalizedImages[index + 1]}
                  alt={`Ảnh bài viết ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
        <ImageViewModal
          images={normalizedImages}
          initialIndex={selectedImageIndex}
          open={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      </>
    );
  }

  // 4 ảnh trở lên
  return (
    <>
      <div className="grid grid-cols-2 gap-1 mt-3">
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] cursor-pointer overflow-hidden group"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={normalizedImages[index]}
              alt={`Ảnh bài viết ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition-colors">
                <div className="text-center">
                  <span className="text-white text-3xl font-bold block">
                    +{images.length - 4}
                  </span>
                  <span className="text-white text-sm">Ảnh khác</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <ImageViewModal
        images={normalizedImages}
        initialIndex={selectedImageIndex}
        open={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
};

export default PostImages; 