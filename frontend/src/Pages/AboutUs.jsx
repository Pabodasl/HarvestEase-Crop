import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import paddyFieldImg from '../assets/paddy-field-1.jpg';
import paddyStorageImg from '../assets/paddy-storage.jpg';

const AboutUs = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('📱 Phone number must be exactly 10 digits.');
      return;
    }

    setError('');
    setSuccessMsg('');

    emailjs.send(
      'service_glzcp09',            // ✅ Your Service ID
      'template_asg4e3g',           // ✅ Your Template ID
      formData,                     // ✅ Form data passed as template params
      '9_bR8B0r4ZCSzUOES'           // ✅ Your Public Key
    )
    .then((response) => {
      console.log('✅ Email sent!', response.status, response.text);
      setSuccessMsg('✅ Message sent successfully!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
      });
    })
    .catch((error) => {
      console.error('❌ Failed to send email:', error);
      setError('❌ Failed to send message. Please try again.');
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* OUR SYSTEM */}
      <div className="grid md:grid-cols-2 items-center p-8">
        <img src={paddyFieldImg} alt="Paddy Field" className="w-full h-auto rounded-lg shadow-md" />
        <div className="p-6">
          <h2 className="text-3xl font-bold text-green-700 mb-4">OUR SYSTEM</h2>
          <p className="text-gray-700 text-lg">
            We are on a mission to empower farmers by providing a smart system to manage paddy cultivation efficiently.
            <span className="font-semibold"> HarvestEase </span> helps with crop planning, growth tracking, storage, sales, and disease control – all in one place.
            By using technology, we aim to boost productivity, reduce crop waste, and ensure sustainable farming.
            
          </p>
          <button onClick={() => navigate('/services')} className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Explore
          </button>
        </div>
      </div>

      {/* OUR FEATURES */}
      <div className="grid md:grid-cols-2 items-center p-8 bg-green-50">
        <div className="p-6 order-2 md:order-1">
          <h2 className="text-3xl font-bold text-green-700 mb-4">OUR FEATURES</h2>
          <p className="text-gray-700 text-lg">
          HarvestEase offers automated fertilization schedules, SMS alerts, stock tracking, and plant disease diagnosis.
          It’s a one-stop solution for managing every stage of paddy farming, helping farmers make informed decisions.
          </p>
          <button onClick={() => navigate('/services')} className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            Learn More
          </button>
        </div>
        <img src={paddyStorageImg} alt="Paddy Storage" className="w-full h-auto rounded-lg shadow-md order-1 md:order-2" />
      </div>

      {/* CONTACT US */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* FORM */}
          <form onSubmit={handleSubmit} className="bg-green-50 p-6 rounded-lg shadow-md space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Message *"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              rows="4"
              required
            />
            {error && <p className="text-red-600 font-medium">{error}</p>}
            {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}

            <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
              Submit Contact
            </button>
          </form>

          {/* INFO */}
          <div className="p-6 border-l border-gray-200">
            <p className="text-gray-700 mb-2">📞 Phone: +94 77 265 6233</p>
            <p className="text-gray-700 mb-2">📧 Email: info@harvestease.com</p>
            <p className="text-gray-700 mb-2">📍 Address: 123 Farming Lane, Gannoruwa , Sri Lanka</p>
            <p className="text-gray-700 mt-4">
              <span className="font-semibold">Opening Hours:</span><br />
              Mon – Sat: 9:00 AM – 6:00 PM<br />
              Sun: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
