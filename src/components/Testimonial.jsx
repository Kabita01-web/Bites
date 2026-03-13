import React from 'react';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonial = ({ name, role, review, image }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-lg mx-auto"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-secondary shadow-md">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="fill-accent text-accent" />
        ))}
      </div>
      <Quote size={40} className="text-secondary/50 mb-4 opacity-50" />
      <p className="text-gray-600 italic text-lg mb-8 leading-relaxed">
        "{review}"
      </p>
      <div>
        <h5 className="text-xl font-serif font-bold text-gray-800">{name}</h5>
        <p className="text-primary font-medium text-sm tracking-widest uppercase">{role}</p>
      </div>
    </motion.div>
  );
};

export default Testimonial;
