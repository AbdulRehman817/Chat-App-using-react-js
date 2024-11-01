import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  db,
  addDoc,
  serverTimestamp,
  onAuthStateChanged,
  auth,
} from "../firebase/Firebase";
const Check = () => {
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(user);
        alert("hello");
        // ...
      } else {
        navigate("/signup");
        // User is signed out
        // ...
      } //ab dosra account banao han
    });
  }, []);
  const [formvalue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "messages"), {
      text: formvalue,
      createdAt: serverTimestamp(),
    });
    setFormValue("");
    console.log("Document written with ID: ", docRef.id);
  };
  useEffect(() => {
    const typingRef = ref(realtimedb, `typingStatus`);
    onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val();
      const someoneElseIsTyping = Object.keys(typingData || {}).some(
        (userId) => userId !== currentUser.uid && typingData[userId]
      );
      setTypingStatus(someoneElseIsTyping);
      console.log("Typing Status:", someoneElseIsTyping); // <-- Add this line
    });
  }, [currentUser.uid]);

  return (
    <div style={styles.container}>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          placeholder="Type your message"
          onChange={(e) => setFormValue(e.target.value)}
          value={formvalue}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  form: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#D43F52",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// src/components/MessageSend.js

export default Check;
