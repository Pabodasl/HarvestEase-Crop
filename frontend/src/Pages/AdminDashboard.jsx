import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🧑‍💼 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 👥 User Management */}
        <Link
          to="/admin/users"
          className="bg-white border rounded-lg shadow hover:shadow-md p-6 transition"
        >
          <h2 className="text-xl font-semibold text-blue-600">👥 Manage Users</h2>
          <p className="text-gray-600 mt-2">View, promote, or delete farmers and buyers.</p>
        </Link>

        {/* 🌾 Crop Management */}
        <Link
          to="/admin/crops"
          className="bg-white border rounded-lg shadow hover:shadow-md p-6 transition"
        >
          <h2 className="text-xl font-semibold text-blue-600">🌾 Manage Crops</h2>
          <p className="text-gray-600 mt-2">Review all crop listings, approve or delete crops.</p>
        </Link>

        {/* 📊 Analytics */}
        <Link
          to="/admin/analytics"
          className="bg-white border rounded-lg shadow hover:shadow-md p-6 transition"
        >
          <h2 className="text-xl font-semibold text-blue-600">📊 Platform Analytics</h2>
          <p className="text-gray-600 mt-2">Track stats like total users, crops, and trends.</p>
        </Link>

        {/* 🔧 Settings (optional) */}
        <Link
          to="/admin/settings"
          className="bg-white border rounded-lg shadow hover:shadow-md p-6 transition"
        >
          <h2 className="text-xl font-semibold text-blue-600">⚙️ System Settings</h2>
          <p className="text-gray-600 mt-2">Manage crop categories, pricing policies, etc.</p>
        </Link>

        {/* 🚪 Logout */}
        <Link
          to="/login"
          className="bg-red-100 text-red-700 border border-red-300 rounded-lg shadow hover:shadow-md p-6 transition"
        >
          <h2 className="text-xl font-semibold">🚪 Logout</h2>
          <p className="text-gray-600 mt-2">End admin session and return to login.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
