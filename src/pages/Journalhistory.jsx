// src/pages/JournalHistory.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Navbar from "../componet/navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JournalHistory = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
      return;
    }

    const fetchJournals = async () => {
      try {
        const q = query(
          collection(db, "users", auth.currentUser.uid, "journals"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setJournals(data);
      } catch (err) {
        console.error("Error fetching journals:", err);
        toast.error("Couldn't load your journals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Just now";
    const date = timestamp.toDate();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date.toLocaleDateString("en-US", options)} at ${time}`;
  };

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
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#2e7d32",
              margin: "0 0 16px 0",
            }}
          >
            📅 Your Journal History
          </h2>
          <p
            style={{
              fontSize: "19px",
              color: "#4caf50",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            Look back with kindness. Every entry is a brave step in your journey. You’ve come so far. 🌱
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#4caf50", fontSize: "18px" }}>
            Loading your memories...
          </div>
        )}

        {/* Empty State */}
        {!loading && journals.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "30px",
              padding: "60px 40px",
              textAlign: "center",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>📔</div>
            <h3 style={{ color: "#2e7d32", margin: "0 0 16px 0" }}>
              No entries yet
            </h3>
            <p style={{ color: "#666", fontSize: "17px", maxWidth: "500px", margin: "0 auto 30px" }}>
              Your private journal is waiting for your first thought. Whenever you're ready, we're here.
            </p>
            <button
              onClick={() => navigate("/journal")}
              style={{
                padding: "16px 36px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(76,175,80,0.3)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#43a047")}
              onMouseLeave={(e) => (e.target.style.background = "#4caf50")}
            >
              ✏️ Write Your First Entry
            </button>
          </div>
        )}

        {/* Journal Entries List */}
        {!loading && journals.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {journals.map((journal, index) => (
              <div
                key={journal.id}
                style={{
                  background: "white",
                  borderRadius: "30px",
                  padding: "32px",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
                  borderLeft: "6px solid #81c784",
                  transition: "all 0.3s ease",
                  opacity: 0,
                  transform: "translateY(20px)",
                  animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: "600",
                      color: "#2e7d32",
                    }}
                  >
                    {formatDate(journal.createdAt)}
                  </div>
                  <div style={{ fontSize: "28px", opacity: 0.3 }}>🌿</div>
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#33691e",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {journal.text || <em style={{ color: "#999" }}>No text recorded</em>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Entry Button at Bottom */}
        {!loading && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <button
              onClick={() => navigate("/journal")}
              style={{
                padding: "16px 40px",
                background: "#81c784",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(129,199,132,0.3)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#66bb6a")}
              onMouseLeave={(e) => (e.target.style.background = "#81c784")}
            >
              ✏️ Write a New Entry
            </button>
          </div>
        )}
      </div>

      {/* Simple fade-in animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default JournalHistory;