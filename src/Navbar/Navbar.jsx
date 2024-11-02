import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  onAuthStateChanged,
  auth,
} from "../../firebase/Firebase.js";
import { db } from "../../firebase/Firebase";
import "./navbar.css";

const Navbar = ({ currentChatUserId }) => {
  const [chatUserName, setChatUserName] = useState(null);
  const [chatUserImage, setChatUserImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUid = user.uid;
        console.log("Authenticated user ID:", userUid);

        getChatUserData(currentChatUserId);

        setChatUserName(user.displayName || "User");
        setChatUserImage(user.photoURL || "/default-avatar.png");
      } else {
        console.log("No authenticated user found.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentChatUserId) {
      console.log("Fetching data for chat user ID:", currentChatUserId);
      getChatUserData(currentChatUserId);
    }
  }, [currentChatUserId]);

  const getChatUserData = async (chatUserId) => {
    try {
      const q = collection(db, "userData");
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (chatUserId === doc.data().id) {
          setChatUserName(`${doc.data().firstName} ${doc.data().lastName}`);
          setChatUserImage(doc.data().image || "/default-avatar.png");
        }
      });
    } catch (error) {
      console.error("Error fetching chat user data:", error);
    }
  };

  return (
    <div className="navbar">
      <button className="backButton">←</button>
      <div className="chatUserDetails">
        <img src={chatUserImage} alt="Chat User Avatar" className="avatar" />
        <div className="userInfo">
          <span className="chatUserName">{chatUserName}</span>
          <span className="typingStatus">typing.....</span>
        </div>
      </div>

      <button className="menuButton">⋮</button>
    </div>
  );
};

export default Navbar;
