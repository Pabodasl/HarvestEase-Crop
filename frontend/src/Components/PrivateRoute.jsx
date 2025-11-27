import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/not-authorized" />;
  }

  return children;
};

export default PrivateRoute;
