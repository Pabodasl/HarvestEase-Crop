import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaChartBar } from 'react-icons/fa';
import AdminWallpaper from '../assets/photo-1571267011930-677915c391f9.jpeg'; // Import wallpaper

const AdminHome = () => {
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

  const adminFeatures = [
    {
      id: 1,
      title: "User Management",
      icon: <FaUsers className="text-3xl" />,
      items: [
        "View and manage user accounts",
        "Assign roles and permissions",
        "Monitor user activity"
      ]
    },
    {
      id: 2,
      title: "Analytics Dashboard",
      icon: <FaChartBar className="text-3xl" />,
      items: [
        "Track platform performance",
        "Analyze user engagement",
        "Generate detailed reports"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${AdminWallpaper})` }} // Set wallpaper
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
                  Welcome, <span className="text-yellow-400">Admin</span>!
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-xl mb-8 text-gray-200"
                >
                  Manage the platform and monitor performance effectively.
                </motion.p>
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center gap-4"
                >
                  <Link
                    to="/admin-dashboard"
                    className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg"
                  >
                    Go to Admin Dashboard
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800">
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
              Admin Tools and Features
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {adminFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  className="bg-gray-700 p-8 rounded-xl"
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

export default AdminHome;
