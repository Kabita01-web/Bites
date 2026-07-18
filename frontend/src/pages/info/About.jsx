import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  const chefs = [
    {
      name: "Marco Rossi",
      role: "Executive Chef",
      experience: "15+ years",
      specialty: "Italian Cuisine",
      photo:
        "https://images.pexels.com/photos/8298449/pexels-photo-8298449.jpeg?_gl=1*gfyatg*_ga*NjkzNTk1ODk0LjE3NTg1MTYxNTI.*_ga_8JE65Q40S6*czE3Nzc3ODY3MDQkbzckZzEkdDE3Nzc3ODY5NzQkajUwJGwwJGgw",
      quote: "Food is art, and the plate is my canvas.",
    },
    {
      name: "Sarah Jenkins",
      role: "Sous Chef",
      experience: "10+ years",
      specialty: "Seafood & Fusion",
      photo:
        "https://images.pexels.com/photos/30004318/pexels-photo-30004318.jpeg?_gl=1*1ojuidp*_ga*NjkzNTk1ODk0LjE3NTg1MTYxNTI.*_ga_8JE65Q40S6*czE3Nzc3ODY3MDQkbzckZzEkdDE3Nzc3ODY4NTMkajQ5JGwwJGgw",
      quote: "Every dish tells a story of passion and precision.",
    },
    {
      name: "David Chen",
      role: "Pastry Chef",
      experience: "12+ years",
      specialty: "French Pastries",
      photo:
        "https://images.pexels.com/photos/8278883/pexels-photo-8278883.jpeg?_gl=1*9lsvbl*_ga*NjkzNTk1ODk0LjE3NTg1MTYxNTI.*_ga_8JE65Q40S6*czE3Nzc3ODY3MDQkbzckZzEkdDE3Nzc3ODY5MTIkajUwJGwwJGgw",
      quote: "Dessert is the perfect ending to a beautiful meal.",
    },
  ];

  const milestones = [
    {
      year: "2015",
      title: "Bites Founded",
      description: "Opened our first location in downtown",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2017",
      title: "First Award",
      description: "Best New Restaurant - City Guide",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2019",
      title: "Michelin Bib",
      description: "Recognized for quality & value",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2022",
      title: "New Location",
      description: "Expanded to serve more food lovers",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2024",
      title: "Sustainability",
      description: "100% locally sourced ingredients",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const values = [
    {
      icon: "🌱",
      title: "Quality Ingredients",
      description:
        "We source only the finest, freshest ingredients from local farms and trusted suppliers.",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    },
    {
      icon: "🔥",
      title: "Passionate Craftsmanship",
      description:
        "Every dish is prepared with dedication, creativity, and an eye for perfection.",
      image:
        "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=600",
    },
    {
      icon: "🤝",
      title: "Exceptional Service",
      description:
        "We treat every guest like family, ensuring a warm and memorable experience.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div className="pt-28 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        {/* Full-bleed background image */}
        <img
          src="https://images.unsplash.com/photo-1550966842-28df05094254?auto=format&fit=crop&q=80&w=1600"
          alt="Restaurant ambiance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/70"></div>

        {/* Decorative blur blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white/90 font-bold tracking-widest uppercase text-sm">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mt-4 leading-tight drop-shadow-lg">
              About Bites
            </h1>
            <p className="text-white/90 mt-4 max-w-2xl mx-auto text-lg">
              Where passion meets flavor, and every meal becomes a memory
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?q=80&w=1210&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Restaurant interior"
                  className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              {/* Decorative border */}
              <div className="absolute top-5 -left-5 w-full h-full border-2 border-accent rounded-3xl -z-10 hidden lg:block"></div>

              {/* Experience badge */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 hidden lg:block">
                <div className="text-center">
                  <span className="text-3xl font-bold text-accent">10+</span>
                  <p className="text-gray-600 text-sm">
                    Years of
                    <br />
                    Excellence
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <span className="text-accent font-bold tracking-widest uppercase text-sm">
                Founded in 2015
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 leading-tight">
                A Journey of Passion and{" "}
                <span className="text-accent italic">Authentic Taste</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Bites began with a simple dream: to bring people together
                through the universal language of gourmet food. What started as
                a small family kitchen has evolved into one of the city's most
                beloved dining destinations.
              </p>
              <div className="bg-gradient-to-r from-secondary/30 to-transparent p-6 rounded-2xl border-l-4 border-accent">
                <p className="text-gray-700 italic text-lg">
                  "We don't just cook; we compose stories on a plate. Every
                  ingredient is chosen for its character, and every dish is a
                  chapter of our culinary heritage."
                </p>
                <p className="text-accent font-semibold mt-3">— Marco Rossi</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-gray-500 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-gray-500 text-sm">Awards Won</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-gray-500 text-sm">Chef Team</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline — FIXED: alternate sides now work correctly */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6 text-center mb-16">
          <span className="text-accent font-bold tracking-widest uppercase text-sm">
            Milestones
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">
            Our Journey Through Time
          </h2>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-accent/30 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex flex-col md:flex-row items-center gap-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full z-10 hidden md:block ring-4 ring-white"></div>

                    {/* Left side */}
                    <div className="md:w-1/2 md:pr-12 flex justify-end">
                      {isEven ? (
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full md:max-w-sm">
                          <div className="overflow-hidden rounded-xl mb-4">
                            <img
                              src={milestone.image}
                              alt={milestone.title}
                              className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <span className="text-accent font-bold text-2xl">
                            {milestone.year}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 mt-2">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            {milestone.description}
                          </p>
                        </div>
                      ) : (
                        <div className="hidden md:block" />
                      )}
                    </div>

                    {/* Right side */}
                    <div className="md:w-1/2 md:pl-12 flex justify-start">
                      {!isEven ? (
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full md:max-w-sm">
                          <div className="overflow-hidden rounded-xl mb-4">
                            <img
                              src={milestone.image}
                              alt={milestone.title}
                              className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <span className="text-accent font-bold text-2xl">
                            {milestone.year}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 mt-2">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            {milestone.description}
                          </p>
                        </div>
                      ) : (
                        <div className="hidden md:block" />
                      )}

                      {/* Mobile: always show below */}
                      <div className="md:hidden bg-white p-6 rounded-2xl shadow-lg w-full">
                        <div className="overflow-hidden rounded-xl mb-4">
                          <img
                            src={milestone.image}
                            alt={milestone.title}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                        <span className="text-accent font-bold text-2xl">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800 mt-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Chefs */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6 text-center mb-16">
          <span className="text-accent font-bold tracking-widest uppercase text-sm">
            Our Team
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">
            Meet the Visionaries
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            The talented individuals who bring creativity, passion, and
            expertise to every dish
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chefs.map((chef, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
                  <img
                    src={chef.photo}
                    alt={chef.name}
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay with quote & socials */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-6">
                    <p className="text-white text-center text-sm italic mb-4">
                      "{chef.quote}"
                    </p>
                    <div className="flex gap-3">
                      <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85 0 3.205-.012 3.585-.069 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-1">
                  {chef.name}
                </h3>
                <p className="text-accent font-semibold uppercase tracking-wider text-sm">
                  {chef.role}
                </p>
                <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{chef.experience}</span>
                  <span>•</span>
                  <span>{chef.specialty}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section — now with images */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 text-center mb-12">
          <span className="text-accent font-bold tracking-widest uppercase text-sm">
            Our Values
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">
            What We Stand For
          </h2>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1600"
          alt="Restaurant ambiance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-accent/75"></div>

        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              Experience the Bites Difference
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join us for an unforgettable dining journey. Reserve your table
              today and discover why our guests keep coming back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/reservation"
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Reserve a Table
              </Link>
              <Link
                to="/menu"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                View Our Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
