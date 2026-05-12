import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, UtensilsCrossed } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <UtensilsCrossed className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold text-primary tracking-tight">Bites</span>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Delicious moments await at Bites. We serve fresh, authentic flavors in a cozy atmosphere designed for memorable dining experiences.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-serif font-bold text-primary mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Menu', 'About Us', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} className="text-gray-600 hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-xl font-serif font-bold text-primary mb-6">Opening Hours</h4>
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Mon - Thu</span>
                <span className="font-semibold">11 AM - 10 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Fri - Sat</span>
                <span className="font-semibold">11 AM - 11 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-semibold">10 AM - 9 PM</span>
              </div>
              <p className="text-primary font-medium mt-4 italic">* Public holidays may vary</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-serif font-bold text-primary mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex gap-3 text-gray-600">
                <MapPin className="text-primary shrink-0" size={20} />
                <span>123 Gourmet Avenue, Culinary City, NY 10012</span>
              </li>
              <li className="flex gap-3 text-gray-600">
                <Phone className="text-primary shrink-0" size={20} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-3 text-gray-600">
                <Mail className="text-primary shrink-0" size={20} />
                <span>hello@bitesrestaurant.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
          <p>Copyright © 2025 Bites Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
