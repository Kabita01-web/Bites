import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";

const About = () => {
  const chefs = [
    {
      name: "Prakash Gurung",
      role: "Executive Chef",
      experience: "15+ years",
      specialty: "Nepali & Thakali Cuisine",
      photo:
        "https://images.pexels.com/photos/8298449/pexels-photo-8298449.jpeg?_gl=1*gfyatg*_ga*NjkzNTk1ODk0LjE3NTg1MTYxNTI.*_ga_8JE65Q40S6*czE3Nzc3ODY3MDQkbzckZzEkdDE3Nzc3ODY5NzQkajUwJGwwJGgw",
      quote: "Food is our way of welcoming guests like family.",
    },
    {
      name: "Sarita Thapa",
      role: "Sous Chef",
      experience: "10+ years",
      specialty: "Newari & Mountain Cuisine",
      photo:
        "https://images.pexels.com/photos/30004318/pexels-photo-30004318.jpeg?_gl=1*1ojuidp*_ga*NjkzNTk1ODk0LjE3NTg1MTYxNTI.*_ga_8JE65Q40S6*czE3Nzc3ODY3MDQkbzckZzEkdDE3Nzc3ODY4NTMkajQ5JGwwJGgw",
      quote: "Every dish tells a story of the hills we grew up in.",
    },
    {
      name: "Dawa Sherpa",
      role: "Pastry Chef",
      experience: "12+ years",
      specialty: "Local & Fusion Desserts",
      photo:
        "https://images.pexels.com/photos/8278883/pexels-photo-8278883.jpeg?_gl=1*9lsvbl*_ga*NjkzNTk1ODk0LjE3NTg1MTYxNTI.*_ga_8JE65Q40S6*czE3Nzc3ODY3MDQkbzckZzEkdDE3Nzc3ODY5MTIkajUwJGwwJGgw",
      quote: "A good meal in Pokhara should end on a sweet note.",
    },
  ];

  const milestones = [
    {
      year: "2015",
      title: "Bites Founded",
      description: "Opened our first kitchen in Pokhara",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2017",
      title: "First Recognition",
      description: "Best New Restaurant — Pokhara Dining Guide",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2019",
      title: "Local Favorite",
      description: "Recognized for consistency & value by regular guests",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2022",
      title: "Chauthe Location",
      description: "Moved to our current home in Chauthe-14, Pokhara",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
    },
    {
      year: "2024",
      title: "Locally Sourced",
      description: "100% ingredients sourced from Kaski valley farms",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const values = [
    {
      icon: "🌱",
      title: "Quality Ingredients",
      description:
        "We source fresh produce, meat, and dairy from local farms around the Pokhara valley.",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    },
    {
      icon: "🔥",
      title: "Passionate Craftsmanship",
      description:
        "Every dish is prepared with care, tradition, and attention to detail.",
      image:
        "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=600",
    },
    {
      icon: "🤝",
      title: "Atithi Deva Bhava",
      description:
        "We treat every guest as we would a guest in our own home — with warmth and respect.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div className="pt-28 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550966842-28df05094254?auto=format&fit=crop&q=80&w=1600"
          alt="Restaurant ambiance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-accent/75"></div>

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
              Authentic flavors of Nepal, served with warmth in the heart of
              Pokhara
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
              <div className="absolute top-5 -left-5 w-full h-full border-2 border-accent rounded-3xl -z-10 hidden lg:block"></div>

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
                Rooted in Pokhara,{" "}
                <span className="text-accent italic">Served with Heart</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Bites began with a simple dream: to bring people together over
                good food, in the same spirit of hospitality that Nepal is known
                for. What started as a small family kitchen has grown into one
                of Pokhara's most loved dining spots, now home in Chauthe-14.
              </p>
              <div className="bg-gradient-to-r from-secondary/30 to-transparent p-6 rounded-2xl border-l-4 border-accent">
                <p className="text-gray-700 italic text-lg">
                  "We don't just cook; we welcome every guest the way we'd
                  welcome them into our own home. Every ingredient is chosen
                  with care, and every dish carries a piece of our culture."
                </p>
                <p className="text-accent font-semibold mt-3">
                  — Prakash Gurung
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-gray-500 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10+</div>
                  <div className="text-gray-500 text-sm">
                    Years Serving Pokhara
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-gray-500 text-sm">Team Members</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
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
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full z-10 hidden md:block ring-4 ring-white"></div>

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
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-6">
                    <p className="text-white text-center text-sm italic mb-4">
                      "{chef.quote}"
                    </p>
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

      {/* Values Section */}
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

      {/* Visit Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-accent font-bold tracking-widest uppercase text-sm">
              Find Us
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">
              Visit Us in Pokhara
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <MapPin size={22} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
              <p className="text-gray-500 text-sm">Chauthe-14, Pokhara</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Phone size={22} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
              <a
                href="tel:+9779745622342"
                className="text-gray-500 text-sm hover:text-primary transition-colors"
              >
                9745622342
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Clock size={22} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Hours</h3>
              <p className="text-gray-500 text-sm">Open daily, 11 AM – 9 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 overflow-hidden">
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
              Join us for an unforgettable dining journey in Chauthe-14,
              Pokhara. Reserve your table today.
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
              <a
                href="tel:+9779745622342"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                <Phone size={18} />
                9745622342
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
