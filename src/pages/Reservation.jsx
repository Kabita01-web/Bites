import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Utensils, CheckCircle2 } from 'lucide-react';

const Reservation = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-32 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center max-w-xl"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-primary w-12 h-12" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Reservation Confirmed!</h2>
          <p className="text-gray-600 text-lg mb-10 leading-relaxed">
            Thank you for choosing Bites. We've sent a confirmation email with your reservation details. See you soon!
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-accent transition-all duration-300"
          >
            Manage Reservation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 bg-white min-h-screen">
      {/* Page Hero */}
      <section className="bg-secondary mb-20 py-24 text-center">
        <div className="container mx-auto px-4">
           <span className="text-primary font-bold tracking-widest uppercase text-sm">Join Us</span>
           <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mt-4 leading-tight">Book a Table</h1>
        </div>
      </section>

      <section className="pb-32 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Date Selection */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-primary uppercase ml-2">
                    <Calendar size={18} /> Select Date
                  </label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none font-medium"
                  />
                </div>

                {/* Guests Selection */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-primary uppercase ml-2">
                    <Users size={18} /> Number of Guests
                  </label>
                  <select 
                    required
                    className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none font-medium appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                    <option value="large">9+ (Contact us)</option>
                  </select>
                </div>

                {/* Time Selection */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-primary uppercase ml-2">
                    <Clock size={18} /> Preferred Time
                  </label>
                  <select 
                    required
                    className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none font-medium appearance-none"
                  >
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="19:00">07:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                    <option value="21:00">09:00 PM</option>
                  </select>
                </div>

                {/* Occasion Selection */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-primary uppercase ml-2">
                    <Utensils size={18} /> Occasion
                  </label>
                  <select className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none font-medium appearance-none">
                    <option value="none">Optional: Birthday, Anniversary...</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="business">Business Meeting</option>
                    <option value="date">Date Night</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-primary uppercase ml-2">Special Requests</label>
                <textarea 
                  rows="4"
                  placeholder="Tell us about any dietary requirements or table preferences..."
                  className="w-full px-8 py-4 bg-secondary/50 rounded-2xl border-transparent focus:border-primary focus:bg-white transition-all duration-300 outline-none resize-none font-medium"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-6 rounded-2xl font-bold text-xl hover:bg-accent transition-all duration-300 shadow-xl hover:shadow-accent/40 scale-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm Reservation
                </button>
                <p className="text-center text-gray-400 text-sm mt-6 italic">
                  By clicking confirm, you agree to our booking policy and terms of service.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Reservation;
