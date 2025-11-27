import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSeedling, FaTractor } from 'react-icons/fa';
import FarmWallpaper from '../assets/Farm-Wallpaper-HD-Free-download.jpg'; // Import wallpaper

const FarmerHome = () => {
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

  const farmerFeatures = [
    {
      id: 1,
      title: "Crop Management",
      icon: <FaSeedling className="text-3xl" />,
      items: [
        "Track crop growth stages",
        "Get weather updates",
        "Optimize irrigation schedules"
      ]
    },
    {
      id: 2,
      title: "Equipment Rentals",
      icon: <FaTractor className="text-3xl" />,
      items: [
        "Rent modern farming equipment",
        "Affordable pricing options",
        "Easy booking process"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-green-800 text-gray-100">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${FarmWallpaper})` }} // Set wallpaper
      >
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"> {/* Add overlay */}
            <div className="container mx-auto px-4 py-32 z-10 text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold mb-6 text-white"
                >
                  Welcome, <span className="text-yellow-400">Farmers</span>!
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-xl mb-8 text-gray-200"
                >
                  Manage your farm efficiently with our tools and insights.
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center gap-4"
                >
                  <Link
                    to="/dashboard"
                    className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg"
                  >
                    Go to Dashboard
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
              className="text-3xl font-bold mb-16 text-center text-white"
            >
              Farmer Tools and Features
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {farmerFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  className="bg-green-700 p-8 rounded-xl"
                >
                  <div className="w-16 h-16 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center text-white">
                    {feature.title}
                  </h3>
                  <ul className="space-y-3">
                    {feature.items.map((item, index) => (
                      <li key={index} className="text-gray-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FarmerHome;
