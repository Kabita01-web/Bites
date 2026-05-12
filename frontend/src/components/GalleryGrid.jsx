import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { fallbackImage, handleImageError } from "../utils/imageFallback";

const GalleryGrid = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-2xl cursor-pointer break-inside-avoid"
            onClick={() => openLightbox(img)}
          >
            <img
              src={img.url || fallbackImage}
              alt={img.title || img.alt || "Gallery image"}
              onError={handleImageError}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-6">
              <span className="text-white font-serif italic text-xl border-b-2 border-accent pb-1 mb-2">
                {img.category || "Bites"}
              </span>
              {img.title && (
                <span className="text-white/80 text-sm">{img.title}</span>
              )}
            </div>
            {/* Zoom icon */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url || fallbackImage}
                alt={
                  selectedImage.title ||
                  selectedImage.category ||
                  "Gallery image"
                }
                onError={handleImageError}
                className="w-full h-full object-contain rounded-2xl"
              />

              {/* Lightbox Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-white font-serif text-xl font-bold">
                  {selectedImage.title || selectedImage.category}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {selectedImage.category}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = images.findIndex(
                    (img) => img.url === selectedImage.url,
                  );
                  const prevIndex =
                    (currentIndex - 1 + images.length) % images.length;
                  setSelectedImage(images[prevIndex]);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = images.findIndex(
                    (img) => img.url === selectedImage.url,
                  );
                  const nextIndex = (currentIndex + 1) % images.length;
                  setSelectedImage(images[nextIndex]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryGrid;
