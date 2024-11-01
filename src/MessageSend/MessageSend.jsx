import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  db,
  orderBy,
} from "../../firebase/Firebase.js";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  auth,
  realtimedb,
  onAuthStateChanged,
} from "../../firebase/Firebase.js";
import { ref, set, onValue, onDisconnect } from "firebase/database";
import Loader from "../loader/Loader.jsx";

import "./chatroom.css";
import { useNavigate } from "react-router-dom";

const MessageSend = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else {
        navigate("/signup");
        setIsOnline(false);
      }
    });
  }, [navigate]);

  const messageQuery = query(collection(db, "messages"), orderBy("createdAt"));
  const [messages] = useCollectionData(messageQuery, { idField: "id" });
  const currentUser = auth.currentUser;

  // Update typing status
  const updateTypingStatus = (isTyping) => {
    if (currentUser) {
      set(ref(realtimedb, `typingStatus/${currentUser.uid}`), isTyping);
    }
  };

  // Listen for typing status of other users
  useEffect(() => {
    const typingRef = ref(realtimedb, `typingStatus`);
    onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val() || {};
      setOtherUserTyping(
        Object.keys(typingData).some(
          (uid) => uid !== currentUser?.uid && typingData[uid]
        )
      );
    });
  }, [currentUser?.uid]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
        displayName: currentUser.displayName || "Anonymous",
        photoURL: currentUser.photoURL,
      });
      setFormValue("");
      updateTypingStatus(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chatContainer">
      <div className="messageContainer">
        {messages ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.uid === currentUser?.uid ? "sent" : "received"
              }`}
            >
              <img src={msg.photoURL} alt="Avatar" className="avatar" />
              <div className="messageContent">
                <strong>{msg.displayName}</strong>
                <p>{msg.text}</p>
                <span className="messageTime">
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
          <Loader />
        )}
        {otherUserTyping && (
          <div className="typingIndicator">Someone is typing...</div>
        )}
      </div>
      <form onSubmit={sendMessage} className="messageForm">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => {
            setFormValue(e.target.value);
            updateTypingStatus(e.target.value !== "");
          }}
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
