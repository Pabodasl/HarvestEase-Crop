import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-800 mb-4 text-center">Login</h1>

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

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-lg font-semibold hover:bg-green-900 transition duration-300"
          >
            Login
          </button>
        </form>

        {errorMessage && <div className="mt-4 text-red-600 text-center">{errorMessage}</div>}

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-yellow-500 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
