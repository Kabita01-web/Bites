import React from "react";
import Testimonial from "../Testimonial";

const TestimonialsSection = () => {
  return (
    <section className="py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center mb-16">
        <span className="text-primary font-bold tracking-widest uppercase text-sm">
          Guest Stories
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">
          What People Say
        </h2>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <Testimonial
          name="Julian Thompson"
          role="Food Critic"
          review="The attention to detail in every dish is simply remarkable. Bites has successfully created a haven for true gastronomes."
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;
