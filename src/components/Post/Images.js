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

  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <>
        <div
          className="relative aspect-video cursor-pointer overflow-hidden group"
          onClick={() => handleImageClick(0)}
        >
          <img
            src={images[0]}
            alt="Ảnh bài viết"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <ImageViewModal
          images={images}
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
        <div className="grid grid-cols-2 gap-1 h-[400px]">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-full cursor-pointer overflow-hidden group"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image}
                alt={`Ảnh bài viết ${index + 1}`}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
        <ImageViewModal
          images={images}
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
        <div className="grid grid-cols-2 gap-1 h-[400px]">
          <div
            className="relative h-full cursor-pointer overflow-hidden group"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={images[0]}
              alt="Ảnh bài viết 1"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
          <div className="grid grid-rows-2 gap-1 h-full">
            {images.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative cursor-pointer overflow-hidden group"
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={image}
                  alt={`Ảnh bài viết ${index + 2}`}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
        <ImageViewModal
          images={images}
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
      <div className="grid grid-cols-2 gap-1 h-[400px]">
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className="relative h-[200px] cursor-pointer overflow-hidden group"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image}
              alt={`Ảnh bài viết ${index + 1}`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
        images={images}
        initialIndex={selectedImageIndex}
        open={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
};

export default PostImages; 