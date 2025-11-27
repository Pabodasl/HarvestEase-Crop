import React from 'react';
import { motion } from 'framer-motion';
import cropImg from '../assets/crop-new.jpg';
import storageImg from '../assets/storage-new.jpg';
import salesImg from '../assets/sales-new.jpg';
import plantImg from '../assets/plant-new.jpg';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Crop Tracking',
      desc: 'Helps farmers plan planting dates, track crop growth stages, and receive automated SMS alerts for fertilization and harvesting. This ensures better yields with timely care and monitoring of paddy crops.',
      image: cropImg,
      route: '/services/crop-tracking', // ✅ Updated route
    },
    {
      title: 'Harvest Stock Management',
      desc: 'Farmers can manage harvested stock, input temperature & humidity, and get spoilage alerts. Reports and stock-level charts help optimize storage conditions and reduce waste.',
      image: storageImg,
      route: '/services/harvest-stock', // ✅ Updated route
    },
    {
      title: 'Cost Tracking & Financial Management',
      desc: 'Allows listing harvested crops for sale, handling buyer orders, tracking delivery, and analyzing sales performance with profit reports and cost tracking features.',
      image: salesImg,
      route: '/services/cost-tracking', // ✅ Updated route
    },
    {
      title: 'Smart Plant Care',
      desc: 'Diagnose plant diseases using rule-based logic and API suggestions. Get treatment tips, post & view real disease cases in the knowledge hub. This helps reduce crop loss and protect yields.',
      image: plantImg,
      route: '/services/smart-plant', // ✅ Updated route
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 px-6 py-10">
      <h1 className="text-4xl text-green-800 font-bold text-center mb-10">Our Services</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-full h-64 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">{service.title}</h2>
              <p className="text-gray-700 text-sm mb-4">{service.desc}</p>
              <button
                onClick={() => navigate(service.route)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-16">
        <h3 className="text-2xl font-bold text-green-700 mb-4">Need More Help?</h3>
        <p className="text-gray-600 mb-4">Still not sure which service is right for you?</p>
        <button
          onClick={() => navigate('/about')}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Contact Our Team
        </button>
      </div>

      <p className="text-center mt-12 text-gray-600 italic">
        HarvestEase – Empowering farmers with smart, tech-driven paddy management. 🌾
      </p>
    </div>
  );
};

export default Services;
