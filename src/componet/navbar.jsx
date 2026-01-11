// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom"; // ← Added useNavigate
import { signOut } from "firebase/auth"; // ← For logout
import { auth } from "../firebaseConfig"; // ← Your Firebase config
import logo from "../pages/image/logo.png";

// import logo from '/path/to/logo.svg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ← To redirect after logout

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "Journal", path: "/journal" },
    { name: "Tracker", path: "/Tracker" },
    { name: "Music", path: "/music" },
    { name: "Appointment", path: "/DoctorChat" },
    { name: "Relax", path: "/relax" },
    { name: "Help", path: "/help" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("✅ Logged out successfully!");
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
      alert("❌ Logout failed. Please try again.");
    }
  };

  const currentPath = location.pathname;

  return (
    <div
      style={{
        background: "#d0e8d0",
        borderRadius: "20px",
        padding: "20px 40px",
        margin: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        top: "20px",
        zIndex: 1000,
      }}
    >
      {/* Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
        <img
          src={logo}
          alt="MindCare Logo"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "contain",
          }}
        />
        <h1 style={{ fontSize: "40px", fontWeight: "bold", color: "#2e7d32", margin: 0 }}>
          MINDCARE
        </h1>
      </div>

      {/* Navigation Buttons + Logout */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center", alignItems: "center" }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <Link key={item.name} to={item.path} style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "12px 28px",
                  fontSize: "16px",
                  fontWeight: "600",
                  background: isActive ? "#4caf50" : "#a5d6a7",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 6px 15px rgba(76,175,80,0.4)" : "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  transform: isActive ? "translateY(-3px)" : "translateY(0)",
                }}
                onMouseEnter={(e) => !isActive && (e.target.style.background = "#81c784")}
                onMouseLeave={(e) => !isActive && (e.target.style.background = "#a5d6a7")}
              >
                {item.name}
              </button>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            padding: "12px 28px",
            fontSize: "16px",
            fontWeight: "600",
            background: "#e57373", // Soft red for logout
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(229,115,115,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#ef5350")}
          onMouseLeave={(e) => (e.target.style.background = "#e57373")}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
