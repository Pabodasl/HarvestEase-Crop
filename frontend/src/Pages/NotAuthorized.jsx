import React from "react";

const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <h1 className="text-2xl font-bold text-red-700">
        🚫 You are not authorized to view this page.
      </h1>
    </div>
  );
};

export default NotAuthorized;
