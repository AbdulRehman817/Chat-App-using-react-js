// src/components/Chat.js
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  db,
  orderBy,
} from "../../firebase/Firebase.js"; // Adjust path as necessary
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, realtimedb } from "../../firebase/Firebase.js"; // Adjust path as necessary
import { ref, onValue } from "firebase/database";
import Loader from "../loader/Loader.jsx"; // Adjust path as necessary
import "./chatroom.css";
import { useNavigate } from "react-router-dom";

const MessageSend = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const currentUser = auth.currentUser;

  // Redirect to signup if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/signup");
    }
  }, [currentUser, navigate]);

  // Fetch messages from Firestore and listen for changes
  const messageQuery = query(collection(db, "messages"), orderBy("createdAt"));
  const [messagesData] = useCollectionData(messageQuery, { idField: "id" });

  useEffect(() => {
    setMessages(messagesData || []); // Set messages once fetched
  }, [messagesData]);

  // Listen for other users' typing status
  useEffect(() => {
    const typingRef = ref(realtimedb, `typingStatus`);
    onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val() || {};
      const isTyping = Object.keys(typingData).some(
        (uid) => typingData[uid] && uid !== currentUser?.uid
      );
      setOtherUserTyping(isTyping);
    });
  }, [currentUser]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!formValue.trim()) return; // Don't send empty messages

    try {
      await addDoc(collection(db, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
        displayName: currentUser.displayName || "Anonymous",
        photoURL: currentUser.photoURL,
      });
      setFormValue(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error); // Log any errors
    }
  };

  return (
    <div className="chatContainer">
      <div className="messageContainer">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.uid === currentUser.uid ? "sent" : "received"
              }`}
            >
              <img src={msg.photoURL} alt="User Avatar" className="avatar" />
              <div className="messageContent">
                <strong>{msg.displayName}</strong>
                <p>{msg.text}</p>
                <span className="messageTime text-white">
                  {new Date(msg.createdAt?.seconds * 1000).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              </div>
            </div>
          ))
        ) : (
          <Loader /> // Show loader if there are no messages
        )}
        {otherUserTyping && (
          <div className="typingIndicator">Someone is typing...</div>
        )}
      </div>
      <form onSubmit={sendMessage} className="messageForm">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setFormValue(e.target.value)} // Update input value
          value={formValue}
          className="messageInput"
        />
        <button type="submit" className="sendButton">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageSend;
