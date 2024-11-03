import React, { useState } from "react";
import "./navbar.css";
import { signOut, auth } from "../../firebase/Firebase";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false); // State to manage visibility of the logout button

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleLogout = () => {
    setShowLogout((prev) => !prev); // Toggle the logout button's visibility
  };

  return (
    <div className="navbar">
      <div className="icon" onClick={toggleLogout}>
        {/* Replace this with your desired icon */}
        <span>☰</span>
      </div>
      {showLogout && (
        <div className={`logout ${showLogout ? "fade-in" : "fade-out"}`}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
