import React from "react";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      {/* The children will be arranged in the proper order in App.jsx */}
      {/* This main container just sets up the dark theme and basic structure */}
      {children}
    </div>
  );
};

export default Layout;
