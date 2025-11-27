import React from 'react';

const BuyerHeader = () => {
  return (
    <header className="bg-green-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/path-to-your-logo.png" alt="HarvestEase" className="w-10 h-10" />
        <h1 className="text-yellow-500 font-semibold text-xl">HarvestEase</h1>
      </div>
      <nav className="space-x-6 text-white">
        <a href="#home" className="hover:text-yellow-500">Home</a>
        <a href="#about" className="hover:text-yellow-500">About Us</a>
        <a href="#service" className="hover:text-yellow-500">Service</a>
        <a href="#shop" className="hover:text-yellow-500">Shop</a>
        <button href="#login" className="bg-yellow-500 text-green-800 py-2 px-4 rounded-md hover:bg-yellow-400">Sign In</button>
        <button className="bg-yellow-500 text-green-800 py-2 px-4 rounded-md hover:bg-yellow-400">Sign Up</button>
      </nav>
    </header>
  );
}

export default BuyerHeader;
