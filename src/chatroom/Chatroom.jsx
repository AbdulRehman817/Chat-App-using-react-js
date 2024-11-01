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
// import "./chatroom.css"; // Add your styles here

// const Chatroom = () => {
//   const [formValue, setFormValue] = useState("");

//   // Query to fetch messages from Firestore
//   const messageQuery = query(collection(db, "messages"), orderBy("createdAt"));
//   const [messages] = useCollectionData(messageQuery, { idField: "id" });
//   const currentUser = auth.currentUser;

//   // Function to send a message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!formValue.trim()) return; // Prevent sending empty messages

//     const user = auth.currentUser;
//     try {
//       await addDoc(collection(db, "messages"), {
//         text: formValue,
//         createdAt: serverTimestamp(),
//         uid: user.uid,
//         displayName: user.displayName || "Anonymous",
//         photoURL: user.photoURL,
//       });
//       setFormValue(""); // Clear the input after sending
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
//                 <strong>{msg.displayName}:</strong> {msg.text}
//                 <span className="messageTime">
//                   {new Date(msg.createdAt?.seconds * 1000).toLocaleTimeString(
//                     [],
//                     {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     }
//                   )}
//                 </span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>Loading messages...</p>
//         )}
//       </div>
//       <form onSubmit={sendMessage} style={styles.form}>
//         <input
//           type="text"
//           placeholder="Type your message"
//           onChange={(e) => setFormValue(e.target.value)}
//           value={formValue}
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   form: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     padding: "10px",
//     borderTop: "1px solid #ccc",
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   button: {
//     padding: "10px 20px",
//     backgroundColor: "#D43F52",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

// export default Chatroom;
