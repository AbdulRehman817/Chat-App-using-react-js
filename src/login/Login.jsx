import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "../../firebase/Firebase.js"; // Update import paths as needed
import "./login.css";
const Login = () => {
  const email = useRef();
  const password = useRef();
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();

  const loginAuth = (provider) => {
    const authProvider = new provider();
    signInWithPopup(auth, authProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setWarning("Error signing in. Please try again.");
      });
  };

  const signupPage = () => {
    navigate("/Signup");
  };

  const SignupBtn = (e) => {
    e.preventDefault();
    setWarning("");
    const userEmail = email.current.value;
    const userPassword = password.current.value;

    if (!userEmail) {
      setWarning("Enter your email");
      return;
    }
    if (!userPassword) {
      setWarning("Enter your password");
      return;
    }

    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        if (error.code === "auth/invalid-email") {
          setWarning("Invalid email format. Please enter a valid email.");
        } else {
          setWarning("Email does not exist");
        }
      });
  };

  return (
    <div className="loginContainer">
      <form className="loginForm">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Email"
          ref={email}
          className="inputField"
        />
        <input
          type="password"
          placeholder="Password"
          ref={password}
          className="inputField"
        />
        <a onClick={signupPage} className="signupLink">
          Don't have an account?
        </a>
        <button type="submit" className="submitBtn" onClick={SignupBtn}>
          Log In
        </button>
        <span className="orText">OR</span>
        <div className="flex socialButtons ">
          <button
            onClick={() => loginAuth(GoogleAuthProvider)}
            type="button"
            className="socialBtn googleBtn "
          >
            Sign in with Google
          </button>
          <br />
          <button
            onClick={() => loginAuth(GithubAuthProvider)}
            type="button"
            className="socialBtn githubBtn"
          >
            Sign in with Github
          </button>
        </div>
        {warning && (
          <div role="alert" className="alert">
            <span>{warning}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
