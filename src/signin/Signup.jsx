import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  auth,
  updateProfile,
  addDoc,
  collection,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
} from "../../firebase/Firebase.js";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const userFirstName = useRef();
  const userLastName = useRef();
  const file = useRef();

  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  const loginBtn = () => {
    navigate("/login");
  };

  const SignupBtn = async (e) => {
    e.preventDefault();
    setWarning("");
    setLoading(true);

    const userEmail = email.current.value;
    const userPassword = password.current.value;
    const firstName = userFirstName.current.value;
    const lastName = userLastName.current.value;
    const userFile = file.current.files[0];

    if (!userEmail || !userPassword || !firstName || !lastName) {
      setWarning("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (!userFile) {
      setWarning("Please add your profile pic.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );
      const user = auth.currentUser;
      const uid = user.uid;

      const storageRef = ref(storage, `profilePic/${userFile.name}`);
      await uploadBytes(storageRef, userFile);
      const getImage = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
        photoURL: getImage,
      });

      await addDoc(collection(db, "userData"), {
        email: userEmail,
        firstName: firstName,
        lastName: lastName,
        image: getImage,
        uid: uid,
      });

      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setWarning(
          "This email is already in use. Please use a different email."
        );
      } else if (error.code === "auth/weak-password") {
        setWarning("Password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setWarning("Invalid email format. Please enter a valid email.");
      } else {
        setWarning("Error during signup: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupDiv">
      <form onSubmit={SignupBtn}>
        <h1>Signup Page</h1>
        <input type="file" ref={file} aria-label="Profile Picture" required />
        <input
          type="text"
          placeholder="Enter email"
          ref={email}
          aria-label="Email"
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          ref={password}
          aria-label="Password"
          required
        />
        <input
          type="text"
          placeholder="Enter your first name"
          ref={userFirstName}
          aria-label="First Name"
          required
        />
        <input
          type="text"
          placeholder="Enter your last name"
          ref={userLastName}
          aria-label="Last Name"
          required
        />
        <a onClick={loginBtn}>Already have an account?</a>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        {warning && (
          <div role="alert" className="alert alert-error">
            <span>{warning}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
