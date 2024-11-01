// src/components/typing/TypingIndicator.jsx
import React from "react";
import "./TypingIndicator.css"; // Separate CSS file for styling

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <span className="dot dot1"></span>
      <span className="dot dot2"></span>
      <span className="dot dot3"></span>
    </div>
  );
};

export default TypingIndicator;
