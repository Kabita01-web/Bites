import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const chefs = [
    { name: "Marco Rossi", role: "Executive Chef", photo: "https://images.unsplash.com/photo-1583394838336-acd977730f90?auto=format&fit=crop&q=80&w=400" },
    { name: "Sarah Jenkins", role: "Sous Chef", photo: "https://images.unsplash.com/photo-1577214495773-ca54395e966b?auto=format&fit=crop&q=80&w=400" },
    { name: "David Chen", role: "Pastry Chef", photo: "https://images.unsplash.com/photo-1595273670150-db0c3c39241f?auto=format&fit=crop&q=80&w=400" }
  ];

  return (
    <div className="pt-28 bg-white">
      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1550966842-28df05094254?auto=format&fit=crop&q=80&w=800"
                alt="Restaurant interior"
                className="rounded-[3rem] shadow-2xl z-10 relative"
              />
              <div className="absolute top-10 -left-10 w-full h-full border-2 border-primary rounded-[3rem] -z-0"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Founded in 2015</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 leading-tight">A Journey of Passion and <span className="text-accent italic">Authentic Taste</span></h1>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                Bites began with a simple dream: to bring people together through the universal language of gourmet food. What started as a small family kitchen has evolved into one of the city's most beloved dining destinations.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-accent pl-6 bg-secondary/50 py-4 rounded-r-2xl">
                "We don't just cook; we compose stories on a plate. Every ingredient is chosen for its character, and every dish is a chapter of our culinary heritage."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our Chefs */}
      <section className="py-32 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 text-center mb-20">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Our Team</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mt-4">Meet the Visionaries</h2>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {chefs.map((chef, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-[2rem] mb-6 shadow-lg h-[450px]">
                  <img src={chef.photo} alt={chef.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                     <p className="text-white text-sm italic">Inspired by the colors of the Mediterranean and the precision of fine culinary arts.</p>
                  </div>
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-800 mb-1">{chef.name}</h3>
                <p className="text-primary font-bold uppercase tracking-widest text-xs">{chef.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-32">
         <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
               <div className="lg:w-1/2 order-2 lg:order-1">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-8 leading-tight">The Ultimate Dining Experience</h2>
                  <p className="text-lg text-gray-600 mb-8">
                     From the moment you step through our doors, your comfort is our priority. We've crafted an environment that balances modern elegance with a warm, welcoming spirit.
                  </p>
                  <ul className="space-y-4">
                     {['Private Dining Rooms', 'Curated Wine List', 'Live Classical Music', 'Seasonal Menus'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                           <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="lg:w-1/2 order-1 lg:order-2">
                  <img 
                    src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800"
                    alt="Dining experience"
                    className="rounded-[3rem] shadow-xl"
                  />
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
