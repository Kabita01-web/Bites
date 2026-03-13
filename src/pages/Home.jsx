import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Award, Coffee, Clock, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import DishCard from '../components/DishCard';
import Testimonial from '../components/Testimonial';

const Home = () => {
  const featuredDishes = [
    {
      name: "Classic Wagyu Burger",
      description: "Premium wagyu beef, caramelized onions, truffled aioli, and brioche bun.",
      price: "$24",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Pesto Pistachio Pasta",
      description: "Hand-made linguine with wild basil pesto and toasted sicilian pistachios.",
      price: "$22",
      image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Heritage Ribeye Steak",
      description: "45-day dry-aged ribeye served with bone marrow butter and roasted herbs.",
      price: "$48",
      image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Velvet Chocolate Melt",
      description: "Melted dark chocolate heart, vanilla bean gelato, and berry reduction.",
      price: "$14",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-white" />,
      title: "Fresh Ingredients",
      desc: "Source directly from local organic farms every morning."
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      title: "Expert Chefs",
      desc: "Our culinary artisans bring decades of Michelin-star experience."
    },
    {
      icon: <Coffee className="w-8 h-8 text-white" />,
      title: "Cozy Ambience",
      desc: "Elegant space designed for comfort and intimacy."
    },
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      title: "Fast Service",
      desc: "Quick and attentive service without compromising quality."
    }
  ];

  return (
    <div className="bg-white">
      <Hero />

      {/* Featured Dishes */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Chef's Selection</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mt-4 leading-tight">Featured Culinary <br/>Masterpieces</h2>
            </div>
            <Link to="/menu" className="flex items-center gap-2 text-primary font-bold text-lg hover:gap-4 transition-all duration-300">
              Explore Full Menu <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDishes.map((dish, i) => (
              <DishCard key={i} {...dish} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Our Philosophy</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">Why Choose Bites?</h2>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl text-center group hover:bg-primary transition-all duration-500 shadow-sm"
              >
                <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white transition-colors duration-500 shadow-lg">
                  {React.cloneElement(feature.icon, { className: "text-white group-hover:text-primary transition-colors" })}
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-white/80 transition-colors">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Guest Stories</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">What People Say</h2>
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

      {/* Reservation CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary rounded-[3rem] overflow-hidden relative min-h-[500px] flex items-center">
             <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550966842-28df05094254?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
             <div className="relative z-10 w-full text-center text-white p-12">
                <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">Reserve Your Table Today</h2>
                <p className="text-xl md:text-2xl mb-12 opacity-90 font-light max-w-2xl mx-auto">
                   Join us for an unforgettable evening of fine dining and exceptional service.
                </p>
                <Link to="/reservation" className="bg-white text-primary px-12 py-5 rounded-full text-xl font-bold hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl">
                   Book Now
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
