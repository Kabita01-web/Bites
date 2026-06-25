import React from "react";
import { Link } from "react-router-dom";

const ReservationCTA = () => {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-primary rounded-[3rem] overflow-hidden relative min-h-125 flex items-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550966842-28df05094254?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
          <div className="relative z-10 w-full text-center text-white p-12">
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">
              Reserve Your Table Today
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 font-light max-w-2xl mx-auto">
              Join us for an unforgettable evening of fine dining and
              exceptional service.
            </p>
            <Link
              to="/reservation"
              className="bg-white text-primary px-12 py-5 rounded-full text-xl font-bold hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationCTA;
