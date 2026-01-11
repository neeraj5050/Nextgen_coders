// src/pages/Tracker.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../componet/navbar";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { toast } from "react-toastify";

const Tracker = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("mood");
  const [selectedMood, setSelectedMood] = useState("");
  const [todayMood, setTodayMood] = useState(null);
  const [moodLoading, setMoodLoading] = useState(true);
  const [moodSaving, setMoodSaving] = useState(false);

  // Sleep States
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [phoneUsage, setPhoneUsage] = useState(0);
  const [variation, setVariation] = useState(0);
  const [selfReport, setSelfReport] = useState("");
  const [sleepScore, setSleepScore] = useState(0);
  const [sleepResult, setSleepResult] = useState("");

  const moods = [
    { name: "Happy", emoji: "😊", color: "#fff59d" },
    { name: "Calm", emoji: "😌", color: "#a7ffeb" },
    { name: "Okay", emoji: "😐", color: "#c8e6c9" },
    { name: "Sad", emoji: "😢", color: "#bbdefb" },
    { name: "Anxious", emoji: "😰", color: "#ffccbc" },
    { name: "Angry", emoji: "😣", color: "#ffab91" },
  ];

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
      return;
    }
    fetchTodayMood();
  }, [navigate]);

  const fetchTodayMood = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "users", auth.currentUser.uid, "moods"),
      where("date", ">=", today),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setTodayMood(snapshot.docs[0].data().mood);
    }
    setMoodLoading(false);
  };

  const saveMood = async (moodName) => {
    if (todayMood || moodSaving) return;

    setMoodSaving(true);
    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "moods"), {
        mood: moodName,
        date: new Date(),
      });
      setTodayMood(moodName);
      toast.success("🌿 Your mood has been saved. Thank you for checking in.");
    } catch (err) {
      toast.error("Couldn't save mood.");
    } finally {
      setMoodSaving(false);
    }
  };

  const startSleep = () => {
    setStartTime(Date.now());
    setEndTime(null);
    setSleepDuration(0);
    setSleepScore(0);
    setSleepResult("");
    setSelfReport("");
    setPhoneUsage(0);
    setVariation(15);
  };

  const endSleep = () => {
    if (!startTime) return;
    setEndTime(Date.now());
    const duration = (Date.now() - startTime) / 1000;
    setSleepDuration(duration);
    setPhoneUsage(Math.floor(duration * 0.1));
  };

  const calculateSleepScore = () => {
    if (!selfReport || sleepDuration === 0) {
      toast.warning("Please complete your self-report.");
      return;
    }

    const durationScore = Math.min((sleepDuration / 28800) * 100, 100) * 0.4;
    const variationScore = (100 - variation) * 0.2;
    const usageScore = (100 - Math.min((phoneUsage / sleepDuration) * 100, 100)) * 0.2;
    const reportScore = selfReport === "Good" ? 100 : selfReport === "Fresh Morning" ? 80 : 40;
    const total = durationScore + variationScore + usageScore + (reportScore * 0.1);

    setSleepScore(total.toFixed(0));
    if (total >= 80) setSleepResult("Your sleep was good! 🌟");
    else if (total >= 50) setSleepResult("Your sleep can be better. 🌱");
    else setSleepResult("Your sleep was poor. Let's improve it. 💙");
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: "900px", margin: "40px auto", width: "100%", padding: "0 20px" }}>
        <div style={{
          background: "white",
          borderRadius: "30px",
          padding: "50px",
          boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#2e7d32", margin: "0 0 30px 0" }}>
            🌿 Daily Trackers
          </h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "60px" }}>
            <button
              onClick={() => setTab("mood")}
              style={{
                padding: "16px 50px",
                background: tab === "mood" ? "#4caf50" : "#d0e8d0",
                color: tab === "mood" ? "white" : "#2e7d32",
                border: "none",
                borderRadius: "30px",
                fontSize: "20px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: tab === "mood" ? "0 8px 25px rgba(76,175,80,0.3)" : "none",
              }}
            >
              Mood Tracker
            </button>
            <button
              onClick={() => setTab("sleep")}
              style={{
                padding: "16px 50px",
                background: tab === "sleep" ? "#4caf50" : "#d0e8d0",
                color: tab === "sleep" ? "white" : "#2e7d32",
                border: "none",
                borderRadius: "30px",
                fontSize: "20px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: tab === "sleep" ? "0 8px 25px rgba(76,175,80,0.3)" : "none",
              }}
            >
              Sleep Tracker
            </button>
          </div>

          {/* Mood Tab */}
          {tab === "mood" && (
            <>
              <p style={{ fontSize: "20px", color: "#4caf50", marginBottom: "40px" }}>
                {todayDate}
              </p>

              {moodLoading ? (
                <p>Loading your mood...</p>
              ) : todayMood ? (
                <div style={{ padding: "50px", background: "#e8f5e8", borderRadius: "30px" }}>
                  <div style={{ fontSize: "120px", marginBottom: "30px" }}>
                    {moods.find(m => m.name === todayMood)?.emoji || "🌱"}
                  </div>
                  <h3 style={{ fontSize: "28px", color: "#2e7d32" }}>
                    You felt <strong>{todayMood}</strong> today
                  </h3>
                  <p style={{ fontSize: "19px", color: "#4caf50", marginTop: "20px" }}>
                    Thank you for sharing. See you tomorrow! 💙
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "30px" }}>
                  {moods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => saveMood(mood.name)}
                      disabled={moodSaving}
                      style={{
                        padding: "30px",
                        background: mood.color,
                        border: "none",
                        borderRadius: "30px",
                        cursor: "pointer",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s",
                      }}
                      onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                    >
                      <div style={{ fontSize: "80px", marginBottom: "15px" }}>{mood.emoji}</div>
                      <div style={{ fontSize: "20px", fontWeight: "600", color: "#2e7d32" }}>
                        {mood.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Sleep Tab */}
          {tab === "sleep" && (
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: "50px", margin: "60px 0" }}>
                <button
                  onClick={startSleep}
                  disabled={startTime && !endTime}
                  style={{
                    padding: "20px 60px",
                    background: startTime && !endTime ? "#ccc" : "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "24px",
                    fontWeight: "600",
                    cursor: startTime && !endTime ? "not-allowed" : "pointer",
                  }}
                >
                  🌙 Start Sleep
                </button>
                <button
                  onClick={endSleep}
                  disabled={!startTime || endTime}
                  style={{
                    padding: "20px 60px",
                    background: !startTime || endTime ? "#ccc" : "#81c784",
                    color: "white",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "24px",
                    fontWeight: "600",
                    cursor: !startTime || endTime ? "not-allowed" : "pointer",
                  }}
                >
                  ☀️ Wake Up
                </button>
              </div>

              {endTime && (
                <div style={{ marginTop: "60px" }}>
                  <div style={{ marginBottom: "40px" }}>
                    <p style={{ fontSize: "22px", color: "#2e7d32", marginBottom: "15px" }}>Total Sleep Time</p>
                    <div style={{ fontSize: "60px", fontWeight: "bold", color: "#4caf50" }}>
                      {formatTime(sleepDuration)}
                    </div>
                  </div>

                  <div style={{ marginBottom: "50px" }}>
                    <p style={{ fontSize: "20px", color: "#33691e", marginBottom: "20px" }}>How was your sleep?</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
                      <button onClick={() => setSelfReport("Good")} style={{
                        padding: "16px 40px",
                        background: selfReport === "Good" ? "#4caf50" : "#e8f5e8",
                        color: selfReport === "Good" ? "white" : "#2e7d32",
                        borderRadius: "30px",
                        fontSize: "18px",
                      }}>Good 😊</button>
                      <button onClick={() => setSelfReport("Bad")} style={{
                        padding: "16px 40px",
                        background: selfReport === "Bad" ? "#ff9800" : "#e8f5e8",
                        color: selfReport === "Bad" ? "white" : "#2e7d32",
                        borderRadius: "30px",
                        fontSize: "18px",
                      }}>Bad 😔</button>
                      <button onClick={() => setSelfReport("Fresh Morning")} style={{
                        padding: "16px 40px",
                        background: selfReport === "Fresh Morning" ? "#4caf50" : "#e8f5e8",
                        color: selfReport === "Fresh Morning" ? "white" : "#2e7d32",
                        borderRadius: "30px",
                        fontSize: "18px",
                      }}>Fresh Morning 🌞</button>
                    </div>
                  </div>

                  <button
                    onClick={calculateSleepScore}
                    disabled={!selfReport}
                    style={{
                      padding: "20px 60px",
                      background: selfReport ? "#4caf50" : "#ccc",
                      color: "white",
                      border: "none",
                      borderRadius: "30px",
                      fontSize: "24px",
                      fontWeight: "600",
                      cursor: selfReport ? "pointer" : "not-allowed",
                    }}
                  >
                    Calculate Sleep Score
                  </button>

                  {sleepScore > 0 && (
                    <div style={{ marginTop: "60px", padding: "40px", background: "#e8f5e8", borderRadius: "30px" }}>
                      <p style={{ fontSize: "32px", fontWeight: "bold", color: "#2e7d32" }}>
                        Sleep Score: {sleepScore}%
                      </p>
                      <p style={{ fontSize: "22px", color: "#4caf50", marginTop: "20px" }}>
                        {sleepResult}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracker;