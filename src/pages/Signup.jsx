import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "./image/backround.png";
import leftIllustration from "./image/left-illustration.png";
import logo from "./image/logo.png";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !age || !profession || !phone || !email || !password) {
      setError("❌ All fields are required");
      return;
    }

    if (isNaN(age) || age < 1) {
      setError("❌ Please enter a valid age");
      return;
    }

    if (password.length < 6) {
      setError("❌ Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        age: Number(age),
        profession: profession.trim(),
        phone: phone.trim(),
        email: email.toLowerCase(),
        createdAt: new Date(),
      });

      toast.success("✅ Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("❌ This email is already registered");
          break;
        case "auth/invalid-email":
          setError("❌ Invalid email address");
          break;
        case "auth/weak-password":
          setError("❌ Password is too weak");
          break;
        default:
          setError("❌ Something went wrong. Try again.");
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
        gap: "40px",
      }}
    >
      {/* Left Illustration Card - Identical to Login */}
      <div
        style={{
          width: "420px 824px",
          background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
          borderRadius: "28px",
          padding: "50px 40px",
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
            maxWidth: "300px",
            borderRadius: "24px",
            marginBottom: "60px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        />
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#2e7d32",
            margin: "0 0 10px 0",
          }}
        >
          Welcome, student.
        </h2>
        <p style={{ fontSize: "18px", color: "#4caf50", margin: 0, fontWeight: "500" }}>
          Let's start with a clear mind.
        </p>
      </div>

      {/* Right Signup Card */}
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
        <div style={{ textAlign: "center", marginBottom: "0px" }}>
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
        
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333", marginBottom: "20px" }}>
          Create Account
        </h2>

        {error && (
          <p style={{ color: "#d32f2f", textAlign: "center", marginBottom: "20px", fontWeight: "500" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              borderRadius: "12px",
              border: "2px solid #e0e0e0",
              outline: "none",
            }}
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
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
            type="text"
            placeholder="Profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
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
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            placeholder="Password (min 6 characters)"
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
              marginTop: "10px",
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "30px", color: "#666", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#4caf50", textDecoration: "none", fontWeight: "600" }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;