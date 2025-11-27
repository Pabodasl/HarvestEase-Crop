// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token is found
      window.location.href = '/login';
    } else {
      // Fetch user info (you can fetch more details or directly decode the token)
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserRole(response.data.role); // Assuming profile response contains the role
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {userRole === 'admin' && <div>Admin Dashboard</div>}
      {userRole === 'farmer' && <div>Farmer Dashboard</div>}
      {userRole === 'buyer' && <div>Buyer Dashboard</div>}
    </div>
  );
}

export default Dashboard;
