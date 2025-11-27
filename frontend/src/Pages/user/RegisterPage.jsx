import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // Default role is 'buyer'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Logging the data being sent to the backend
    console.log('Sending data to backend:', { email, password, role });

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        email,
        password,
        role,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/login');
    } catch (error) {
      // Logging the error response from the backend
      console.error('Error from backend:', error.response);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-800 mb-4 text-center">Register</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-lg font-semibold hover:bg-green-900 transition duration-300"
          >
            Register
          </button>
        </form>

        {errorMessage && <div className="mt-4 text-red-600 text-center">{errorMessage}</div>}

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
