import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaTrash, FaArrowLeft, FaMinus, FaPlus, FaCheck, FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show notification
    setNotification({
      message: "Cart updated successfully!",
      type: 'success'
    });

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Remove item from cart
  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show notification
    setNotification({
      message: "Item removed from cart",
      type: 'success'
    });

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));

    // Show notification
    setNotification({
      message: "Cart cleared successfully",
      type: 'success'
    });

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Calculate total amount
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Get variety page URL 
  const getVarietyUrl = (variety) => {
    return `/${variety.toLowerCase().replace(' ', '-')}-stock-detail`;
  };

  // Generate and download PDF bill with professional header and footer
  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const currentDate = new Date().toLocaleDateString();
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    
    // Add logo and header
    doc.setFillColor(26, 81, 46); // #1A512E dark green color
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    // Logo would go here if you had the image
    doc.setTextColor(245, 197, 66); // Yellow color
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("HarvestEase", 15, 15);
    
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Farm Management System", 15, 22);
    
    // Invoice details
    doc.setTextColor(26, 81, 46);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, 45, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceNumber}`, 15, 60);
    doc.text(`Date: ${currentDate}`, 15, 67);
    doc.text("Customer: Walk-in Customer", 15, 74);
    
    // Invoice items table
    doc.setFontSize(12);
    doc.autoTable({
      startY: 85,
      head: [['Product', 'Variety', 'Quantity', 'Unit Price (Rs)', 'Total (Rs)']],
      body: cart.map(item => [
        item.cropType, 
        item.variety, 
        `${item.quantity} ${item.quantityUnit}`, 
        item.price.toFixed(2), 
        (item.price * item.quantity).toFixed(2)
      ]),
      styles: { 
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: { 
        fillColor: [26, 81, 46],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 248, 240]
      }
    });
    
    // Summary calculations
    const subtotal = totalAmount;
    const tax = totalAmount * 0.05;
    const total = subtotal + tax;
    
    // Add summary information
    let finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.text("Subtotal:", pageWidth - 60, finalY);
    doc.text(`Rs ${subtotal.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });
    
    finalY += 7;
    doc.text("Tax (5%):", pageWidth - 60, finalY);
    doc.text(`Rs ${tax.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });
    
    finalY += 7;
    doc.text("Shipping:", pageWidth - 60, finalY);
    doc.text("Free", pageWidth - 15, finalY, { align: "right" });
    
    finalY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total:", pageWidth - 60, finalY);
    doc.text(`Rs ${total.toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });
    
    // Add thankyou note
    finalY += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Thank you for your purchase!", pageWidth / 2, finalY, { align: "center" });
    
    // Add footer
    const footerY = doc.internal.pageSize.height - 15;
    doc.setFillColor(26, 81, 46);
    doc.rect(0, footerY - 10, pageWidth, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("HarvestEase Farm Management", 15, footerY);
    doc.text("Contact: +94 77 123 4567 | Email: info@harvestease.com", pageWidth / 2, footerY, { align: "center" });
    doc.text(`Generated: ${currentDate}`, pageWidth - 15, footerY, { align: "right" });
    
    doc.save(`HarvestEase-Invoice-${invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Notification */}
      {notification && (
        <motion.div 
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          {notification.message}
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link to="/shop" className="mr-4 text-green-600 hover:text-green-700 flex items-center">
              <FaArrowLeft className="mr-2" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 text-sm flex items-center"
            >
              <FaTrash className="mr-1" />
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaShoppingCart className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link 
              to="/shop" 
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <motion.div 
                  key={item._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row gap-4"
                >
                  {/* Product image */}
                  <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || `/shopImg/${item.variety.toLowerCase().replace(' ', '')}.jpg`} 
                      alt={item.variety} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={getVarietyUrl(item.variety)}>
                          <h3 className="text-xl font-bold text-gray-800 hover:text-green-600">{item.variety}</h3>
                        </Link>
                        <p className="text-sm text-gray-500">{item.cropType}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-4 py-1 border-x border-gray-200">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-800">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Rs. {item.price} per {item.quantityUnit}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
                <h2 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Rs. {(totalAmount * 0.05).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Rs. {(totalAmount + (totalAmount * 0.05)).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                </div>
                
                <button 
                  onClick={() => alert('Proceeding to checkout...')} 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-medium transition flex items-center justify-center mb-4"
                >
                  <FaCheck className="mr-2" />
                  Proceed to Checkout
                </button>
                
                {/* Download Invoice Button */}
                <button 
                  onClick={downloadPDF}
                  className="w-full bg-white border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-xl font-medium transition flex items-center justify-center"
                  disabled={cart.length === 0}
                >
                  <FaFilePdf className="mr-2" />
                  Download Invoice
                </button>
                
                <div className="mt-6 text-xs text-center text-gray-500">
                  <p>We accept cash on delivery and online payments</p>
                  <p className="mt-2">Free shipping on all orders above Rs. 1000</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
