// src/pages/Home.jsx
import { useState, useEffect } from "react";
import Navbar from "../componet/navbar"; 
import heroImage from "./image/neer.png";    
import doctorImage from "./image/hururu.png";     
import { Link } from "react-router-dom";
import Footer from "./Footerr";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7ea", padding: "20px" }}>
        <Navbar />
        
        {/* Hero Skeleton */}
        <div style={{ maxWidth: "1000px", margin: "0 auto 50px", borderRadius: "30px", overflow: "hidden" }}>
          <div className="skeleton" style={{ width: "100%", height: "400px", borderRadius: "30px" }} />
        </div>

        {/* Cards Skeleton */}
        <div style={{ maxWidth: "1400px", margin: "0 auto 120px", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "50px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: "white", borderRadius: "36px", padding: "60px 50px" }}>
                <div className="skeleton" style={{ height: "20px", marginBottom: "15px", borderRadius: "10px" }} />
                <div className="skeleton" style={{ height: "20px", marginBottom: "15px", borderRadius: "10px", width: "90%" }} />
                <div className="skeleton" style={{ height: "20px", marginBottom: "15px", borderRadius: "10px", width: "80%" }} />
                <div className="skeleton" style={{ height: "20px", borderRadius: "10px", width: "70%" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Mood Test Skeleton */}
        <div style={{ maxWidth: "1000px", margin: "0 auto 80px", background: "white", borderRadius: "40px", padding: "60px 40px", textAlign: "center" }}>
          <div className="skeleton" style={{ height: "40px", width: "60%", margin: "0 auto 24px", borderRadius: "10px" }} />
          <div className="skeleton" style={{ height: "20px", width: "80%", margin: "0 auto 50px", borderRadius: "10px" }} />
          <div className="skeleton" style={{ height: "60px", width: "300px", margin: "0 auto", borderRadius: "40px" }} />
        </div>

        <style>{`
          .skeleton {
            background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff", 
        padding: "0px", 
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Global Navbar */}
      <Navbar />

      {/* Hero Banner with Text at the TOP */}
      <div
        style={{
          maxWidth: "900px",
          margin: "20px auto 50px auto",
          background: "#ffffff",
          borderRadius: "30px",
          overflow: "hidden",
          // boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          position: "relative",
          
        }}
      >
        <img
          src={heroImage}
          alt=""
          style={{
            width: "100%",
            height: "80vh",
            
            display: "block",
          }}
        />
        {/* Text positioned at the TOP */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "#1b5e20",
            width: "90%",
            padding: "12px 20px",
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: "20px",
            backdropFilter: "blur(2px)", // Nice subtle blur effect
          }}
        >
         
        </div>
      </div>

{/* Motivational Messages Section - Perfect Single Row on Desktop */}
<div
  style={{
    maxWidth: "1400px",
    margin: "0 auto 120px auto",
    padding: "0 40px",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)", 
      gap: "50px",
      alignItems: "stretch",
    }}
  >
    {/* Message 1 */}
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #eaeee9 100%)",
        borderRadius: "36px",
        padding: "60px 50px",
        textAlign: "center",
        boxShadow: "0 25px 60px rgba(129,199,132,0.25)",
       border:"2px solid black",
        // borderLeft: "10px solid #000000",
        transition: "all 0.5s ease",
        position: "relative",
        overflow: "hidden",
        display: "flex",
   
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-20px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{
        position: "absolute",
        top: "30px",
        right: "30px",
        fontSize: "100px",
        opacity: 0.12,
        pointerEvents: "none",
      }}>
        🌿
      </div>

      {/* <div style={{ fontSize: "90px", marginBottom: "30px" }}>💚</div> */}
      <p
        style={{
          fontSize: "23px",
          color: "#3f5f3f",
          lineHeight: "1.8",
          fontWeight: "600",
          margin: "0",
        }}
      >
        Your mental health matters deeply — and you are never alone on this journey.
        <br /><br />
        <span style={{ fontWeight: "400", color: "#161716", fontSize: "20px" }}>
          Even the smallest steps toward self-care can create powerful, lasting change.
        </span>
      </p>
    </div>

    {/* Message 2 */}
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #e6f2f4 100%)",
        borderRadius: "36px",
        padding: "60px 50px",
        textAlign: "center",
        boxShadow: "0 25px 60px rgba(178,235,242,0.25)",
        // borderLeft: "10px solid #182325",
          border:"2px solid black",
        transition: "all 0.5s ease",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-20px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{
        position: "absolute",
        bottom: "30px",
        left: "30px",
        fontSize: "90px",
        opacity: 0.1,
        pointerEvents: "none",
      }}>
        
      </div>

      {/* <div style={{ fontSize: "90px", marginBottom: "30px" }}>🤝</div> */}
      <p
        style={{
          fontSize: "23px",
          color: "#006064",
          lineHeight: "1.8",
          fontWeight: "600",
          margin: "0",
        }}
      >
        We offer a truly safe space to talk, heal, and understand your emotions.
        <br /><br />
        <span style={{ fontWeight: "400", color: "#00838f", fontSize: "20px" }}>
          You deserve to feel heard, valued, and emotionally strong — every single day.
        </span>
      </p>
    </div>

    {/* Message 3 */}
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fffcf2 100%)",
        borderRadius: "36px",
        padding: "40px 30px",
        margin: "0px",
        textAlign: "center",
          border:"2px solid black",
        boxShadow: "0 25px 60px rgba(255,236,179,0.25)",
        // borderLeft: "10px solid #000000",
        transition: "all 0.5s ease",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-20px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{
        position: "absolute",
        top: "25px",
        left: "40px",
        fontSize: "110px",
        opacity: 0.08,
        pointerEvents: "none",
      }}>
        🌱
      </div>

      {/* <div style={{ fontSize: "90px", marginBottom: "30px" }}>✨</div> */}
      <p
        style={{
          fontSize: "23px",
          color: "#ff8f00",
          lineHeight: "1.8",
          fontWeight: "600",
          margin: "0",
        }}
      >
        Together, we build resilience, balance, and lasting inner peace.
        <br /><br />
        <span style={{ fontWeight: "400", color: "#ff6f00", fontSize: "20px" }}>
          With gentle guidance and consistent care, a happier, healthier you is not just possible — it’s waiting.
        </span>
      </p>
    </div>
  </div>
</div>
     {/* Cool & Inviting Mood Test Section */}
<div
  style={{
    maxWidth: "1000px",
    margin: "0 auto 80px auto",
    background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
    border: "3px solid #2b2a2a",
    borderRadius: "40px",
    padding: "60px 40px",
    boxShadow: "0 20px 50px rgba(129,199,132,0.2)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Decorative subtle leaves in background */}
  <div style={{
    position: "absolute",
    top: "20px",
    left: "30px",
    fontSize: "60px",
    opacity: 0.9,
    pointerEvents: "none",
  }}>🌿</div>
  <div style={{
    position: "absolute",
    bottom: "30px",
    right: "40px",
    fontSize: "80px",
    opacity: 0.9,
    pointerEvents: "none",
  }}>🍃</div>

  <h2
    style={{
      fontSize: "38px",
      fontWeight: "bold",
      color: "#9688bd",
      margin: "0 0 24px 0",
    }}
  >
    How Are You Feeling Today?
  </h2>

  <p
    style={{
      fontSize: "20px",
      color: "#33691e",
      maxWidth: "700px",
      margin: "0 auto 50px auto",
      lineHeight: "1.7",
    }}
  >
    Take a gentle 2-minute check-in to understand your mood better.  
    No judgment — just kindness and support.
  </p>

  {/* Big, beautiful button with glow and lift effect */}
  <Link to="/test">
    <button
      style={{
        padding: "24px 70px",
        // background: "#4caf50",
        color: "black",
        border: "2px solid black",
       
        borderRadius: "40px",
        fontSize: "28px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 15px 40px rgba(76,175,80,0.4)",
        transition: "all 0.4s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-8px) scale(1.05)";
        e.target.style.boxShadow = "0 25px 60px rgba(76,175,80,0.5)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0) scale(1)";
        e.target.style.boxShadow = "0 15px 40px rgba(76,175,80,0.4)";
      }}
    >
      {/* Subtle shine effect */}
      <span style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "20px",
        height: "200%",
        background: "rgba(255,255,255,0.3)",
        transform: "rotate(30deg)",
        transition: "all 0.6s",
        pointerEvents: "none",
      }} />

      ✨ Take Quick Mood Test
    </button>
  </Link>

  <p
    style={{
      fontSize: "16px",
      color: "#666",
      margin: "40px auto 0 auto",
      maxWidth: "600px",
      fontStyle: "italic",
    }}
  >
    It only takes a moment — and it’s a beautiful way to care for yourself today.
  </p>
</div>

      {/* Doctor Support Section */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: "1", minWidth: "300px", textAlign: "center" }}>
          <img
            src={doctorImage}
            alt="Professional support"
            style={{
              width: "100%",
              maxWidth: "380px",
              borderRadius: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          />
        </div>
        <div
          style={{
            flex: "1",
            minWidth: "300px",
    border: "3px solid #2b2a2a",

            background: "#ffffff",
            borderRadius: "30px",
            padding: "40px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ fontSize: "28px", color: "#7c64c7", margin: "0 0 20px 0" }}>
            Need to talk to someone?
          </h3>
          <p style={{ fontSize: "18px", color: "#33691e", lineHeight: "1.6" }}>
            Our certified counselors are here to help you whenever you need.
            Book a session or chat anonymously.
          </p>
          <button
            style={{
              marginTop: "20px",
              padding: "14px 30px",
              background: "#ffffff",
              color: "black",
                      border: "2px solid black",

              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
            }}
          >
            Get Support →
          </button>
        </div>
      </div>
      <Footer/>
    </div>

  );
};

export default Home;