import React from "react";
import { Leaf, Award, Coffee, Clock } from "lucide-react";

const featuresData = [
  {
    icon: <Leaf className="w-8 h-8 text-white" />,
    title: "Fresh Ingredients",
    desc: "Source directly from local organic farms every morning.",
  },
  {
    icon: <Award className="w-8 h-8 text-white" />,
    title: "Expert Chefs",
    desc: "Our culinary artisans bring decades of Michelin-star experience.",
  },
  {
    icon: <Coffee className="w-8 h-8 text-white" />,
    title: "Cozy Ambience",
    desc: "Elegant space designed for comfort and intimacy.",
  },
  {
    icon: <Clock className="w-8 h-8 text-white" />,
    title: "Fast Service",
    desc: "Quick and attentive service without compromising quality.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6 text-center mb-16">
        <span className="text-primary font-bold tracking-widest uppercase text-sm">
          Our Philosophy
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mt-4">
          Why Choose Bites?
        </h2>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, i) => (
            <div
              key={i}
              className="bg-white p-10 rounded-3xl text-center group hover:bg-primary transition-all duration-500 shadow-sm"
            >
              <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-white transition-colors duration-500 shadow-lg">
                {React.cloneElement(feature.icon, {
                  className:
                    "text-white group-hover:text-primary transition-colors",
                })}
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 group-hover:text-white/80 transition-colors">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
