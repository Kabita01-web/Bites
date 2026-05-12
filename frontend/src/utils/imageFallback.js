export const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800";

export const handleImageError = (event) => {
  if (event?.target && event.target.src !== fallbackImage) {
    event.target.src = fallbackImage;
  }
};
