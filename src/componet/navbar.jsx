// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import logo from "../pages/image/logo.png";
import { useSubscription } from "../hooks/useSubscription";
import { toast } from "react-toastify";

// import logo from '/path/to/logo.svg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription, isPro } = useSubscription();

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
      toast.success("✅ Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("❌ Logout failed. Please try again.");
    }
  };

  const currentPath = location.pathname;

  return (
    <div
      style={{
        background: "#ffffff",
        // borderRadius: "20px",
        padding: "10px",
        margin: "0px",
        // boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        top: "0px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center", justifyContent: "center",

      }}
    >
      {/* Logo + Title + Subscription Badge */}
      <div style={{ display: "flex",
      position: "absolute",
            left:"0px",
         alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <img
          src={logo}
          alt="MindCare Logo"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "contain",
            marginLeft: "10px",
            
          }}
        />
        <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#3f3f3f", margin: 0 }}>
          MINDCARE
        </h1>
        
        {/* Subscription Badge */}
        {/* <Link to="/subscription" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "6px 6px",
            background: isPro() ? "linear-gradient(135deg, #ffd700, #ffed4e)" : "#e0e0e0",
            color: isPro() ? "#000" : "#666",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: isPro() ? "0 4px 15px rgba(255,215,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: "6px",
            margin:"4px",
            whiteSpace:"nowrap",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {isPro() ? "👑 " : "⭐ "}
          </div>
        </Link> */}
      </div>

      {/* Navigation Buttons + Logout */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center", alignItems: "center" }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <Link key={item.name} to={item.path} style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "8px 18px",
                  fontSize: "16px",
                  fontWeight: "600",
                  background: isActive ? "#ffffff" : "#ffffff",
                  color:  "black",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 6px 15px rgba(76,175,80,0.4)" : "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  transform: isActive ? "translateY(-3px)" : "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = "#81c784";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(76,175,80,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = "#a5d6a7";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }
                }}
              >
                {item.name}
              </button>
            </Link>
          );
        })}
<div 
style={{
  position:"absolute",
  right:"10px",
  gap:"2px"
}}
>        
  <Link to="/subscription" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "6px 14px",
              fontSize: "16px",
              fontWeight: "600",
              margin:"2px",
              background: isPro() ? "linear-gradient(135deg, #ffd700, #ffed4e)" : "#9c27b0",
              color: isPro() ? "#000" : "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              boxShadow: isPro() ? "0 4px 12px rgba(255,215,0,0.4)" : "0 4px 12px rgba(156,39,176,0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isPro()) {
                e.target.style.background = "#7b1fa2";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(156,39,176,0.4)";
              } else {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(255,215,0,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isPro()) {
                e.target.style.background = "#9c27b0";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(156,39,176,0.3)";
              } else {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(255,215,0,0.4)";
              }
            }}
          >
            {isPro() ? "👑 Pro Member" : "⬆️ Upgrade"}
          </button>
        </Link>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 18px",
            fontSize: "16px",
            fontWeight: "600",
            background: "#e57373",
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            
            boxShadow: "0 4px 12px rgba(229,115,115,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#ef5350";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 16px rgba(229,115,115,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#e57373";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(229,115,115,0.3)";
          }}
        >
          Logout
        </button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
