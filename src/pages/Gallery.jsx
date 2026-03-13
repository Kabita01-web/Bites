import React from 'react';
import GalleryGrid from '../components/GalleryGrid';

const Gallery = () => {
  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800", category: "Best Seller" },
    { url: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800", category: "Mains" },
    { url: "https://images.unsplash.com/photo-1550966842-28df05094254?auto=format&fit=crop&q=80&w=800", category: "Interior" },
    { url: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800", category: "Pasta" },
    { url: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800", category: "Vibe" },
    { url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800", category: "Sweetness" },
    { url: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800", category: "Starters" },
    { url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800", category: "Drinks" },
    { url: "https://images.unsplash.com/photo-1594911771100-24422da8066f?auto=format&fit=crop&q=80&w=800", category: "Fresh" }
  ];

  return (
    <div className="pt-28 pb-32 bg-white">
      {/* Page Hero */}
      <section className="bg-secondary mb-20 py-24 text-center">
        <div className="container mx-auto px-4">
           <span className="text-primary font-bold tracking-widest uppercase text-sm">Visual Feast</span>
           <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mt-4 leading-tight">Our Gallery</h1>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 md:px-6">
        <GalleryGrid images={galleryImages} />
      </section>

      {/* Instagram CTA */}
      <section className="mt-32 text-center py-20 bg-primary text-white overflow-hidden relative">
         <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Follow Our Journey</h2>
            <p className="text-xl opacity-90 mb-10">Tag us in your moments @BitesRestaurant</p>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white text-primary rounded-full font-bold text-xl hover:bg-accent hover:text-white transition-all duration-300"
            >
              Follow on Instagram
            </a>
         </div>
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <div className="w-96 h-96 rounded-full bg-white blur-3xl"></div>
         </div>
      </section>
    </div>
  );
};

export default Gallery;
