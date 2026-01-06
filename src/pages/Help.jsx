// src/pages/Help.jsx
import React from "react";
import Navbar from "../componet/navbar";

const Help = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f7ea",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <div
        style={{
          flex: 1,
          maxWidth: "900px",
          margin: "40px auto",
          width: "100%",
          padding: "0 20px",
        }}
      >
        {/* Emergency Banner - Prominent & Caring */}
        <div
          style={{
            background: "#ffecb3",
            border: "4px solid #ffb74d",
            borderRadius: "30px",
            padding: "40px",
            textAlign: "center",
            marginBottom: "50px",
            boxShadow: "0 15px 40px rgba(255, 183, 77, 0.2)",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#e65100",
              margin: "0 0 20px 0",
            }}
          >
            🆘 In Crisis? Get Help Immediately
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "#bf360c",
              lineHeight: "1.7",
              margin: "0 0 20px 0",
            }}
          >
            If you're in immediate danger, feeling suicidal, or having thoughts of harming yourself or others — 
            <strong> please call emergency services right now</strong> (e.g., 911, 112, 999, or your local emergency number).
          </p>
          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#d84315",
            }}
          >
            You are not alone. Help is available 24/7 — and someone wants to listen.
          </p>
        </div>

        {/* Global Resources Section */}
        <div
          style={{
            background: "white",
            borderRadius: "30px",
            padding: "50px 40px",
            boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#2e7d32",
              margin: "0 0 20px 0",
            }}
          >
            🌍 Find Confidential Support Worldwide
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#33691e",
              maxWidth: "700px",
              margin: "0 auto 50px auto",
              lineHeight: "1.7",
            }}
          >
            Trained, compassionate listeners are ready to support you — anonymously, for free, and without judgment.
          </p>

          {/* Resource Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "30px",
              marginBottom: "50px",
            }}
          >
            {/* Befrienders Worldwide */}
            <div
              style={{
                background: "#e8f5e8",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 30px rgba(129,199,132,0.15)",
                borderLeft: "6px solid #81c784",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3
                style={{
                  fontSize: "24px",
                  color: "#2e7d32",
                  margin: "0 0 16px 0",
                }}
              >
                🌍 Befrienders Worldwide
              </h3>
              <p
                style={{
                  fontSize: "17px",
                  color: "#33691e",
                  lineHeight: "1.6",
                  margin: "0 0 24px 0",
                }}
              >
                Emotional support helplines in over 190 countries. Volunteers are there to listen whenever you need.
              </p>
              <a
                href="https://www.befrienders.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: "#4caf50",
                  color: "white",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "17px",
                  boxShadow: "0 6px 18px rgba(76,175,80,0.3)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#43a047")}
                onMouseLeave={(e) => (e.target.style.background = "#4caf50")}
              >
                Visit Befrienders.org →
              </a>
            </div>

            {/* Find A Helpline */}
            <div
              style={{
                background: "#e8f5e8",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 30px rgba(129,199,132,0.15)",
                borderLeft: "6px solid #81c784",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3
                style={{
                  fontSize: "24px",
                  color: "#2e7d32",
                  margin: "0 0 16px 0",
                }}
              >
                📞 Find A Helpline
              </h3>
              <p
                style={{
                  fontSize: "17px",
                  color: "#33691e",
                  lineHeight: "1.6",
                  margin: "0 0 24px 0",
                }}
              >
                The largest global directory — 2,000+ verified phone, chat, and text helplines in 130+ countries.
              </p>
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: "#4caf50",
                  color: "white",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "17px",
                  boxShadow: "0 6px 18px rgba(76,175,80,0.3)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#43a047")}
                onMouseLeave={(e) => (e.target.style.background = "#4caf50")}
              >
                Visit FindAHelpline.com →
              </a>
            </div>
          </div>

          {/* Important Note */}
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              background: "#fff8e1",
              padding: "24px",
              borderRadius: "20px",
              borderLeft: "5px solid #ffb74d",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            <strong>MindCare</strong> is here to support your daily emotional well-being through journaling, mood tracking, and gentle guidance. 
            However, we are <strong>not a crisis service</strong> and cannot replace professional mental health care. 
            In emergencies or intense distress, please reach out to the trained professionals above.
          </p>
        </div>

        {/* Encouraging Footer */}
        <div
          style={{
            textAlign: "center",
            margin: "80px 0 40px 0",
            padding: "40px",
            background: "#d0e8d0",
            borderRadius: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: "22px",
              color: "#2e7d32",
              fontStyle: "italic",
              lineHeight: "1.7",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Reaching out is one of the bravest things you can do.  
            You matter. Your feelings are valid. And there are people who genuinely care and want to help.  
            <strong> You are not alone. 💙</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;