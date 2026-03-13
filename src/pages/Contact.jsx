import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-28 bg-white">
      {/* Page Hero */}
      <section className="bg-secondary mb-20 py-24 text-center">
        <div className="container mx-auto px-4">
           <span className="text-primary font-bold tracking-widest uppercase text-sm">Get In Touch</span>
           <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mt-4 leading-tight">Contact Us</h1>
        </div>
      </section>

      <section className="pb-32 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl"
            >
              <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Send a Message</h2>
              <p className="text-gray-500 mb-10">We'd love to hear from you. Fill out the form below and we'll get back to you shortly.</p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase ml-4">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name"
                      className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase ml-4">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="example@mail.com"
                      className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase ml-4">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?"
                    className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase ml-4">Message</label>
                  <textarea 
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Right: Contact Info & Map */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                 <div className="bg-secondary/50 p-8 rounded-[2rem] border border-gray-100">
                    <MapPin size={32} className="text-primary mb-6" />
                    <h4 className="text-xl font-serif font-bold text-gray-800 mb-2">Location</h4>
                    <p className="text-gray-600">123 Gourmet Avenue,<br/>Culinary City, NY 10012</p>
                 </div>
                 <div className="bg-secondary/50 p-8 rounded-[2rem] border border-gray-100">
                    <Phone size={32} className="text-primary mb-6" />
                    <h4 className="text-xl font-serif font-bold text-gray-800 mb-2">Information</h4>
                    <p className="text-gray-600">+1 (555) 123-4567<br/>hello@bitesrestaurant.com</p>
                 </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full h-[450px] rounded-[3rem] overflow-hidden shadow-lg border border-gray-100"
              >
                <iframe 
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976373946229!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1652312345678!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
