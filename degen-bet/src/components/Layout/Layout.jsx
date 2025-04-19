import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-primary text-white relative flex flex-col">
      {/* The children will be arranged in the proper order in App.jsx */}
      {/* This main container just sets up the dark theme and basic structure */}
      {children}
    </div>
  );
};

export default Layout;
