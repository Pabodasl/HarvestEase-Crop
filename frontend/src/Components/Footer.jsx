import React from 'react';


const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">About HarvestEase</h4>
            <p className="text-gray-400">
              HarvestEase is dedicated to helping farmers optimize their crop management and increase yield with advanced technology and support. Join us and take your farming experience to the next level.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul>
              <li>
                <a href="/" className="text-gray-400 hover:text-blue-500">Home</a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-blue-500">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-blue-500">Contact</a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-600">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-pink-500">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-700">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              <span className="block">HarvestEase Team</span>
              <span className="block">123 Farming Lane, Gannoruwa</span>
              <span className="block">info@harvestease.com</span>
              <span className="block">0772656233</span>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} HarvestEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
