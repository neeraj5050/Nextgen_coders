import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";  // ../ because we're inside pages folder

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Sign up successful! You're now logged in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        color: "#333",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        {isSignup ? "Create Account" : "Welcome Back"}
      </h2>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "16px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "24px" }}>
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;