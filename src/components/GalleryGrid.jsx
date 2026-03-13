import React from 'react';
import { motion } from 'framer-motion';

const GalleryGrid = ({ images }) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {images.map((img, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative group overflow-hidden rounded-3xl"
        >
          <img
            src={img.url}
            alt={img.alt || 'Gallery image'}
            className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <span className="text-white font-serif italic text-xl border-b border-white pb-1">{img.category || 'Bites'}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;
