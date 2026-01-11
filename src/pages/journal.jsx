
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Navbar from "../componet/navbar";
import { useNavigate } from "react-router-dom";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const saveJournal = async () => {
    if (!entry.trim()) {
      alert("Please write something before saving 💙");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "journals"), {
        text: entry.trim(),
        createdAt: serverTimestamp(),
      });

      setEntry("");
      alert("✅ Your journal entry has been saved safely.");
    } catch (err) {
      console.error("Journal save error:", err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToHistory = () => {
    navigate("/journal-history");
  };

  const characterCount = entry.length;

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
          margin: "30px auto",
          width: "100%",
          padding: "0 20px",
        }}
      >
        {/* Main Journal Card */}
        <div
          style={{
            background: "white",
            borderRadius: "30px",
            padding: "40px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#2e7d32",
              margin: "0 0 16px 0",
            }}
          >
            📓 Private Journal
          </h2>

          <p
            style={{
              fontSize: "18px",
              color: "#4caf50",
              margin: "0 0 40px 0",
              lineHeight: "1.6",
            }}
          >
            This is your safe space. Write freely — no one else can see this. 💙
          </p>

          {/* Textarea Editor */}
          <div
            style={{
              background: "#f8fcf8",
              borderRadius: "24px",
              padding: "24px",
              border: "2px solid #a5d6a7",
              marginBottom: "30px",
            }}
          >
            <textarea
              rows="14"
              placeholder="How are you feeling today? What’s on your mind? Let it all out... 🌿"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "17px",
                lineHeight: "1.8",
                color: "#2e7d32",
                background: "transparent",
                resize: "none",
                fontFamily: "inherit",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid #d0e8d0",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  color: "#666",
                }}
              >
                {characterCount} {characterCount === 1 ? "character" : "characters"}
              </span>

              <button
                onClick={saveJournal}
                disabled={loading || !entry.trim()}
                style={{
                  padding: "14px 32px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "17px",
                  fontWeight: "600",
                  cursor: loading || !entry.trim() ? "not-allowed" : "pointer",
                  opacity: loading || !entry.trim() ? 0.7 : 1,
                  boxShadow: "0 6px 18px rgba(76,175,80,0.3)",
                  transition: "all 0.3s",
                }}
              >
                {loading ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </div>

          {/* View History Button */}
          <button
            onClick={goToHistory}
            style={{
              padding: "14px 36px",
              background: "#81c784",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "17px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(129,199,132,0.3)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#66bb6a")}
            onMouseLeave={(e) => (e.target.style.background = "#81c784")}
          >
            📜 View Journal History
          </button>

          <p
            style={{
              fontSize: "15px",
              color: "#666",
              margin: "30px 0 0 0",
              fontStyle: "italic",
            }}
          >
            Your thoughts are private and secure. Take your time — we're always here when you need us. 🌱
          </p>
        </div>
      </div>
    </div>
  );
};

export default Journal;