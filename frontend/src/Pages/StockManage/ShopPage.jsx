import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaSearch, FaShoppingCart, FaLeaf, FaClock, FaFire, FaMedal, FaTag } from "react-icons/fa";

const ShopPage = () => {
  const [timeLeft, setTimeLeft] = useState(3600);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popular");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const crops = [
    {
      name: "Nadu",
      description: "Popular for dry zones, moderate growth, high yield.",
      image: "/shopImg/nadu.jpg",
      link: "/nadu-stock-detail",
      tags: ["High Yield", "Fast Growth"],
      ribbon: "Best Seller",
      price: 350,
      category: "popular",
      rating: 4.7,
      stock: 42
    },
    {
      name: "Samba",
      description: "Fragrant, fine grain, needs longer growth period.",
      image: "/shopImg/samba.jpg",
      link: "/samba-stock-detail",
      tags: ["Aromatic", "Premium"],
      price: 420,
      category: "premium",
      rating: 4.5,
      stock: 28
    },
    {
      name: "Red Rice",
      description: "Nutritious, traditional variety, low water needs.",
      image: "/shopImg/redrice.jpg",
      link: "/redrice-stock-detail",
      tags: ["Traditional", "Organic"],
      ribbon: "Hot",
      price: 380,
      category: "traditional",
      rating: 4.8,
      stock: 15
    },
    {
      name: "BG352",
      description: "Hybrid rice, high yield, adaptable to many climates.",
      image: "/shopImg/bg352.jpg",
      link: "/bg352-stock-detail",
      tags: ["Hybrid", "Adaptable"],
      price: 390,
      category: "hybrid",
      rating: 4.2,
      stock: 32
    },
    {
      name: "Suwandel",
      description: "Fragrant and soft, a premium traditional rice.",
      image: "/shopImg/suwandel.jpg",
      link: "/suwandel-stock-detail",
      tags: ["Fragrant", "Premium"],
      price: 450,
      category: "premium",
      rating: 4.9,
      stock: 10
    },
    {
      name: "Pachcha",
      description: "A nutritious, traditional variety with low water needs.",
      image: "/shopImg/pachcha.jpg",
      link: "/pachcha-stock-detail",
      tags: ["Traditional", "Low Water"],
      price: 370,
      category: "traditional",
      rating: 4.4,
      stock: 24
    },
  ];

  const reviews = [
    {
      title: "Excellent Quality!",
      text: "Super fresh rice, great packaging. Will definitely buy again.",
      stars: 5,
      author: "Rajith K.",
      date: "2 weeks ago",
      avatar: "/shopImg/avatar1.jpg"
    },
    {
      title: "Tasty & Aromatic",
      text: "Loved the samba rice. Flavorful and authentic. The grains cooked perfectly and had an amazing aroma throughout my kitchen.",
      stars: 4,
      author: "Priya M.",
      date: "1 month ago",
      avatar: "/shopImg/avatar2.jpg"
    },
    {
      title: "Great Value",
      text: "High quality rice at a reasonable price. The Nadu variety has become a staple in our household.",
      stars: 5,
      author: "Amal S.",
      date: "3 weeks ago",
      avatar: "/shopImg/avatar3.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Filter and sort crops
  const filteredCrops = crops
    .filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            crop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            crop.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default: // popular
          return 0; // Keep original order
      }
    });

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-gray-50 text-gray-800 min-h-screen">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        {/* Offer Banner */}
        <div className="bg-gradient-to-r from-green-600 to-lime-500 text-white text-center py-3 text-lg font-semibold">
          <div className="flex items-center justify-center">
            <FaLeaf className="mr-2 animate-pulse" />
            <span>Spring Sale! Get up to 20% off on select rice varieties!</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="text-center bg-white py-4 text-green-700 font-medium flex items-center justify-center">
          <div className="flex items-center bg-green-50 px-4 py-2 rounded-full shadow-sm">
            <FaClock className="mr-2 text-green-600" />
            <span className="text-gray-700">Offer ends in:</span>
            <div className="ml-2 flex space-x-1">
              <span className="bg-green-600 text-white px-2 py-1 rounded font-mono">{formatTime(timeLeft).split(':')[0]}</span>
              <span className="text-green-700">:</span>
              <span className="bg-green-600 text-white px-2 py-1 rounded font-mono">{formatTime(timeLeft).split(':')[1]}</span>
              <span className="text-green-700">:</span>
              <span className="bg-green-600 text-white px-2 py-1 rounded font-mono">{formatTime(timeLeft).split(':')[2]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[500px] mb-12">
        <img src="/shopImg/hero.jpg" alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col justify-center items-center text-white text-center p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-2">Fresh Crops</h1>
            <h2 className="text-3xl sm:text-5xl font-bold text-green-400">From Field to You</h2>
            <p className="mt-6 text-lg max-w-2xl mx-auto">Experience the authentic taste of Sri Lanka's finest rice varieties, harvested and delivered with care.</p>
            
            <motion.div 
              className="mt-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/shop" className="bg-gradient-to-r from-green-500 to-lime-500 px-10 py-4 rounded-full font-semibold text-lg shadow-lg inline-flex items-center">
                <FaShoppingCart className="mr-2" />
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search rice varieties..." 
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === 'popular' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('popular')}
            >
              Popular
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === 'premium' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('premium')}
            >
              Premium
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === 'traditional' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('traditional')}
            >
              Traditional
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === 'hybrid' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('hybrid')}
            >
              Hybrid
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {filteredCrops.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-4 text-gray-600">
          Showing {filteredCrops.length} {filteredCrops.length === 1 ? 'variety' : 'varieties'} 
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Crop Cards */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCrops.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCrops.map((crop) => (
              <motion.div 
                key={crop.name}
                variants={itemVariants}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Ribbon */}
                {crop.ribbon && (
                  <div className="absolute top-4 left-0 z-10">
                    <div className="bg-red-500 text-white py-1 px-4 font-semibold text-sm flex items-center shadow-md rounded-r-lg">
                      {crop.ribbon === "Hot" ? <FaFire className="mr-1" /> : <FaMedal className="mr-1" />}
                      {crop.ribbon}
                    </div>
                  </div>
                )}
                
                {/* Main Image with Overlay */}
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={crop.image} 
                    alt={crop.name} 
                    className="w-full h-full object-cover transition duration-700 ease-in-out group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <Link 
                      to={crop.link}
                      className="px-5 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center"
                    >
                      <FaShoppingCart className="mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-800">{crop.name}</h3>
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                      <span className="text-green-700 font-medium">Rs. {crop.price}</span>
                      <span className="text-xs ml-1 text-gray-500">/kg</span>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(crop.rating) ? "text-yellow-400" : "text-gray-300"} 
                          size={16}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">{crop.rating}</span>
                    <span className="ml-2 text-xs text-gray-500">({Math.floor(crop.rating * 10)} reviews)</span>
                  </div>
                  
                  <p className="text-gray-600 mt-3">{crop.description}</p>
                  
                  {/* Stock Indicator */}
                  <div className="mt-3 flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      crop.stock > 20 ? 'bg-green-500' : crop.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'
                    } mr-2`}></span>
                    <span className="text-sm text-gray-600">
                      {crop.stock > 20 
                        ? 'In Stock' 
                        : crop.stock > 5 
                          ? `Low Stock (${crop.stock} left)` 
                          : `Very Low Stock (${crop.stock} left)`
                      }
                    </span>
                  </div>
                  
                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {crop.tags?.map((tag, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                      >
                        <FaTag className="mr-1 text-green-600" size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <img 
              src="/shopImg/empty-state.svg" 
              alt="No results" 
              className="w-40 h-40 mx-auto mb-4 opacity-60" 
            />
            <h3 className="text-xl font-semibold text-gray-700">No matching products found</h3>
            <p className="text-gray-600 mt-2 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.section>

      {/* Featured Section */}
      <section className="bg-green-700 text-white py-16 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Our Rice Is Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-800/50 rounded-xl p-6 text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
              <p className="text-green-100">Our rice is grown without harmful chemicals, pesticides, or GMOs.</p>
            </div>
            <div className="bg-green-800/50 rounded-xl p-6 text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
              <p className="text-green-100">We ensure our farmers receive fair compensation for their hard work.</p>
            </div>
            <div className="bg-green-800/50 rounded-xl p-6 text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Harvest</h3>
              <p className="text-green-100">From field to your doorstep in record time to ensure maximum freshness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex items-center">
          <div className="flex-grow h-0.5 bg-gray-200"></div>
          <div className="mx-4 text-3xl text-green-600">🌾</div>
          <div className="flex-grow h-0.5 bg-gray-200"></div>
        </div>
      </div>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-4 mb-24">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">What Our Customers Say</h2>
        
        <motion.div 
          className="grid gap-6 grid-cols-1 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-green-500"
            >
              {/* Stars */}
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < review.stars ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              
              <h4 className="text-xl font-semibold text-gray-800">{review.title}</h4>
              <p className="mt-3 text-gray-600 italic">"{review.text}"</p>
              
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 overflow-hidden flex items-center justify-center">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-green-600 font-semibold">{review.author.charAt(0)}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{review.author}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-10">
          <button className="px-6 py-3 bg-white text-green-700 font-medium border border-green-600 rounded-full hover:bg-green-50 transition">Read All Reviews</button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-16 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Rice Season Updates</h2>
          <p className="max-w-2xl mx-auto mb-8">Subscribe to our newsletter for exclusive deals, new arrivals, and expert rice cultivation tips.</p>
          
          <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm mt-4 text-green-100">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
