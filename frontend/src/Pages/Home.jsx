// src/Pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSeedling, FaTractor, FaChartLine } from 'react-icons/fa';
import HomeWallpaper from '../assets/Farm-Desktop-Wallpaper.jpg'; // Import wallpaper

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      id: 1,
      title: "Sustainable Farming",
      icon: <FaSeedling className="text-3xl" />,
      items: [
        "Learn eco-friendly farming techniques",
        "Access resources for sustainable agriculture",
        "Connect with like-minded farmers"
      ]
    },
    {
      id: 2,
      title: "Modern Equipment",
      icon: <FaTractor className="text-3xl" />,
      items: [
        "Discover the latest farming tools",
        "Get expert advice on equipment usage",
        "Boost productivity with modern solutions"
      ]
    },
    {
      id: 3,
      title: "Market Insights",
      icon: <FaChartLine className="text-3xl" />,
      items: [
        "Stay updated on market trends",
        "Maximize profits with data-driven decisions",
        "Access real-time pricing information"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-green-900 text-gray-100">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${HomeWallpaper})`, // Set wallpaper
          backgroundSize: 'cover', // Ensure full coverage
          backgroundRepeat: 'no-repeat', // Prevent tiling
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 py-32 z-10 text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1 
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg"
                >
                  Empowering <span className="text-yellow-400">Farmers</span> for a Better Tomorrow
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-100 font-medium bg-black bg-opacity-40 p-4 rounded-lg"
                >
                  Your one-stop platform for modern farming solutions and insights
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link 
                    to="/learn-more" 
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Learn More
                  </Link>
                  <Link 
                    to="/explore" 
                    className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-lg transition-all"
                  >
                    Explore Features
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-green-900">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-16 text-center text-white"
            >
              Why Choose Us?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div 
                  key={feature.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-green-800 p-8 rounded-xl hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-16 h-16 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center text-white">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaSeedling className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-24 px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/farm-cta-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-md"
          >
            Ready to Transform Your Farming Journey?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto text-white font-medium"
          >
            Join our platform and take the first step towards smarter farming
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold rounded-lg transition-all"
            >
              Visit Dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
