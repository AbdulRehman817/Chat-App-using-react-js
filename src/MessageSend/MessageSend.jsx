// // src/components/Chat.js
// import React, { useState } from "react";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   db,
// } from "../../firebase/Firebase.js";
// import { useCollectionData } from "react-firebase-hooks/firestore";
// import { query, orderBy } from "firebase/firestore";
// import { auth } from "../../firebase/Firebase.js";
// import Loader from "../loader/Loader.jsx";
// import "./chatroom.css";

// const MessageSend = () => {
//   const [formValue, setFormValue] = useState("");
//   const messageQuery = query(collection(db, "messages"), orderBy("createdAt"));
//   const [messages] = useCollectionData(messageQuery, { idField: "id" });
//   const currentUser = auth.currentUser;

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!formValue.trim()) return;

//     try {
//       await addDoc(collection(db, "messages"), {
//         text: formValue,
//         createdAt: serverTimestamp(),
//         uid: currentUser.uid,
//         displayName: currentUser.displayName || "Anonymous",
//         photoURL: currentUser.photoURL,
//       });
//       setFormValue("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="chatContainer">
//       <div className="messageContainer">
//         {messages ? (
//           messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`message ${
//                 msg.uid === currentUser.uid ? "sent" : "received"
//               }`}
//             >
//               <img src={msg.photoURL} alt="Avatar" className="avatar" />
//               <div className="messageContent">
//                 <strong>{msg.displayName}</strong>
//                 <p>{msg.text}</p>
//                 <span className="messageTime">
//                   {new Date(msg.createdAt?.seconds * 1000).toLocaleTimeString(
//                     [],
//                     { hour: "2-digit", minute: "2-digit", hour12: true }
//                   )}
//                 </span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="loadingMessage">
//             <Loader />
//           </p>
//         )}
//       </div>
//       <form onSubmit={sendMessage} className="messageForm">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           onChange={(e) => setFormValue(e.target.value)}
//           value={formValue}
//           className="messageInput"
//         />
//         <button type="submit" className="sendButton">
//           <i className="fas fa-paper-plane"></i> {/* Font Awesome Icon */}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MessageSend;
// src/components/Chat.js

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  db,
} from "../../firebase/Firebase.js";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, orderBy } from "firebase/firestore";
import {
  auth,
  realtimedb,
  onAuthStateChanged,
} from "../../firebase/Firebase.js";
import { ref, set, onValue } from "firebase/database";
import Loader from "../loader/Loader.jsx";
import "./chatroom.css";
import FontAwesome from "react-fontawesome";
import { useNavigate } from "react-router-dom";
const MessageSend = () => {
  const [formValue, setFormValue] = useState("");
  const [typingStatus, setTypingStatus] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messageQuery = query(collection(db, "messages"), orderBy("createdAt"));
  const [messages] = useCollectionData(messageQuery, { idField: "id" });
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const updateTypingStatus = (isTyping) => {
    const typingRef = ref(realtimedb, `typingStatus/${currentUser.uid}`);
    set(typingRef, isTyping);
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        navigate("/");
      } else {
        navigate("/Signup");
      }
    });
  });
  useEffect(() => {
    const typingRef = ref(realtimedb, `typingStatus`);
    onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val();
      const someoneElseIsTyping = Object.keys(typingData || {}).some(
        (userId) => userId !== currentUser.uid && typingData[userId]
      );
      setOtherUserTyping(someoneElseIsTyping);
    });
  }, [currentUser.uid]);

  const handleInputChange = (e) => {
    setFormValue(e.target.value);
    updateTypingStatus(e.target.value !== "");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;

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
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.uid === currentUser.uid ? "sent" : "received"
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
            ))}
            {/* Add the typing indicator */}
            {otherUserTyping && (
              <div className="typingIndicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </>
        ) : (
          <p className="loadingMessage">
            <Loader />
          </p>
        )}
      </div>
      <form onSubmit={sendMessage} className="messageForm">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={handleInputChange}
          value={formValue}
          className="messageInput"
        />
        <button type="submit" className="sendButton">
          <FontAwesome className="fas fa-paper-plane"></FontAwesome>{" "}
          {/* Font Awesome Icon */}
        </button>
      </form>
    </div>
  );
};

export default MessageSend;
