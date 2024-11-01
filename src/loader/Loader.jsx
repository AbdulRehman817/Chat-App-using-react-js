// src/components/Loader.js
import React from "react";
import "./Loader.css"; // Import the CSS file

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loading-text">
        Loading Messages<span className="dots"></span>
      </div>
    </div>
  );
};

export default Loader;
