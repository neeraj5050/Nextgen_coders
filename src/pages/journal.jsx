import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Navbar from "../componet/navbar";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";
import { toast } from "react-toastify";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [weeklyLimit] = useState(2);
  const navigate = useNavigate();
  const { isPro } = useSubscription();

  // Redirect if not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    } else if (!isPro()) {
      fetchWeeklyCount();
    }
  }, [navigate, isPro]);

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    return new Date(now.setDate(diff));
  };

  const fetchWeeklyCount = async () => {
    try {
      const startOfWeek = getStartOfWeek();
      startOfWeek.setHours(0, 0, 0, 0);
      
      const q = query(
        collection(db, "users", auth.currentUser.uid, "journals"),
        where("createdAt", ">=", startOfWeek)
      );
      
      const snapshot = await getDocs(q);
      setWeeklyCount(snapshot.size);
    } catch (error) {
      console.error("Error fetching journal count:", error);
    }
  };

  const saveJournal = async () => {
    if (!entry.trim()) {
      toast.warning("Please write something before saving 💙");
      return;
    }

    // Check weekly limit for free users
    if (!isPro() && weeklyCount >= weeklyLimit) {
      toast.error("You've reached your weekly limit of 2 journal entries. Upgrade to Pro for unlimited journaling! 🌟");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "journals"), {
        text: entry.trim(),
        createdAt: serverTimestamp(),
      });

      setEntry("");
      toast.success("✅ Your journal entry has been saved safely.");
      
      // Update count for free users
      if (!isPro()) {
        setWeeklyCount(weeklyCount + 1);
      }
    } catch (err) {
      console.error("Journal save error:", err);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToHistory = () => {
    navigate("/journal-history");
  };

  const remainingEntries = weeklyLimit - weeklyCount;
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
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#2e7d32",
                margin: 0,
              }}
            >
              📓 Private Journal
            </h2>
            {isPro() && (
              <span style={{ 
                fontSize: "16px", 
                background: "linear-gradient(135deg, #ffd700, #ffed4e)", 
                color: "#000", 
                padding: "6px 14px", 
                borderRadius: "12px", 
                fontWeight: "bold" 
              }}>
                👑 PRO
              </span>
            )}
          </div>

          <p
            style={{
              fontSize: "18px",
              color: "#4caf50",
              margin: "0 0 10px 0",
              lineHeight: "1.6",
            }}
          >
            This is your safe space. Write freely — no one else can see this. 💙
          </p>

          {!isPro() && (
            <div style={{
              background: weeklyCount >= weeklyLimit ? "#fff3cd" : "#e8f5e9",
              border: `2px solid ${weeklyCount >= weeklyLimit ? "#ffc107" : "#81c784"}`,
              borderRadius: "16px",
              padding: "12px 20px",
              margin: "0 0 30px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontSize: "16px", color: weeklyCount >= weeklyLimit ? "#856404" : "#2e7d32", fontWeight: "600" }}>
                {weeklyCount >= weeklyLimit 
                  ? "⚠️ Weekly limit reached" 
                  : `📝 ${remainingEntries} entries remaining this week`}
              </span>
              {weeklyCount >= weeklyLimit && (
                <button
                  onClick={() => navigate("/subscription")}
                  style={{
                    padding: "8px 20px",
                    background: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ⬆️ Upgrade to Pro
                </button>
              )}
            </div>
          )}

          {isPro() && (
            <p style={{ fontSize: "16px", color: "#666", margin: "0 0 30px 0", fontStyle: "italic" }}>
              ✨ Unlimited entries • Enhanced privacy • Priority support
            </p>
          )}

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