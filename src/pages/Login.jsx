import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "./image/backround.png";
import leftIllustration from "./image/left-illustration.png";
import logo from "./image/logo.png";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("❌ Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("✅ Login successful! Welcome back.");
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);

      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("❌ Invalid email or password");
          break;
        case "auth/invalid-email":
          setError("❌ Please enter a valid email address");
          break;
        case "auth/too-many-requests":
          setError("❌ Too many failed attempts. Try again later.");
          break;
        default:
          setError("❌ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        gap: "50px", // Nice balanced spacing
      }}
    >
      {/* Left Illustration Card */}
      <div
        style={{
          width: "400px", // ← Now SAME as right card
          background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
          borderRadius: "28px",
          padding: "40px 30px",
          textAlign: "center",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={leftIllustration}
          alt="Student meditating"
          style={{
            width: "100%",
            maxWidth: "280px",
            borderRadius: "24px",
            marginBottom: "30px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        />
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2e7d32", margin: "0 0 10px 0" }}>
          Welcome back, student.
        </h2>
        <p style={{ fontSize: "18px", color: "#4caf50", margin: 0, fontWeight: "500" }}>
          Let's start with a clear mind.
        </p>
      </div>

      {/* Right Login Card */}
      <div
        style={{
          width: "400px", 
          background: "white",
          borderRadius: "28px",
          padding: "50px 40px",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo Section - Fixed & Clean */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img
            src={logo}
            alt="MindCare Logo"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              margin: "0 auto 20px",
              borderRadius: "50%",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          />
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#4caf50", margin: 0 }}>
            MindCare
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <p style={{ color: "#d32f2f", textAlign: "center", marginBottom: "20px", fontWeight: "500" }}>
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: "14px 18px",
              fontSize: "16px",
              borderRadius: "14px",
              border: "2px solid #e0e0e0",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: "14px 18px",
              fontSize: "16px",
              borderRadius: "14px",
              border: "2px solid #e0e0e0",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px",
              fontSize: "17px",
              fontWeight: "600",
              backgroundColor: "#81c784",
              color: "white",
              border: "none",
              borderRadius: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "Logging in..." : "Enter MindCare"}
          </button>
        </form>

        {/* Social Login (Google only for now) */}
        <div style={{ textAlign: "center", margin: "30px 0 20px" }}>
          <button
            type="button"
            style={{
              padding: "10px 20px",
              background: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "14px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            G Sign in with Google
          </button>
        </div>

        {/* Links */}
        <div style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
          <Link to="/forgot-password" style={{ color: "#4caf50", textDecoration: "none" }}>
            Forgot password?
          </Link>{" "}
          |{" "}
          <Link to="/signup" style={{ color: "#4caf50", textDecoration: "none" }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;