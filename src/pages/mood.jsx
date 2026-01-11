// src/pages/Tracker.jsx (Combined Mood & Sleep Tracker)
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

const Tracker = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("mood"); // "mood" or "sleep"
  const [selectedMood, setSelectedMood] = useState("");
  const [todayMood, setTodayMood] = useState(null);
  const [moodLoading, setMoodLoading] = useState(true);
  const [moodSaving, setMoodSaving] = useState(false);

  // Sleep States
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [phoneUsage, setPhoneUsage] = useState(0); // Simulated
  const [variation, setVariation] = useState(0); // Simulated
  const [selfReport, setSelfReport] = useState("");
  const [sleepScore, setSleepScore] = useState(0);
  const [sleepResult, setSleepResult] = useState("");
  const [sleepLoading, setSleepLoading] = useState(true);

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
    fetchTodaySleep();
  }, [navigate]);

  const fetchTodayMood = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "users", auth.currentUser.uid, "moods"),
      where("date", ">=", today),
      orderBy("date", "desc"),
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
      alert("🌿 Your mood has been saved. Thank you for checking in.");
    } catch (err) {
      alert("Couldn't save mood. Try again.");
    } finally {
      setMoodSaving(false);
    }
  };

  const fetchTodaySleep = async () => {
    // Fetch today's sleep data (implement as needed from Firestore)
    // For now, simulate
    setSleepLoading(false);
  };

  const startSleep = () => {
    setStartTime(Date.now());
    setEndTime(null);
    setSleepDuration(0);
    setSleepScore(0);
    setSleepResult("");
    setPhoneUsage(0);
  };

  const endSleep = () => {
    if (!startTime) return;
    setEndTime(Date.now());
    const duration = (Date.now() - startTime) / 1000;
    setSleepDuration(duration);
    setPhoneUsage(duration * 0.1); // Simulated
    setVariation(15); // Simulated
  };

  const calculateSleepScore = () => {
    if (!selfReport || sleepDuration === 0) return alert("Complete your self-report first.");

    const durationScore = (sleepDuration / 28800) * 100 * 0.4;
    const variationScore = (100 - variation) * 0.2;
    const usageScore = (100 - (phoneUsage / sleepDuration * 100)) * 0.2;
    const reportScore = selfReport === "Good" ? 100 : selfReport === "Fresh Morning" ? 80 : 40;
    const total = durationScore + variationScore + usageScore + (reportScore * 0.1);

    setSleepScore(total.toFixed(0));

    if (total >= 80) setSleepResult("Your sleep was good! Keep it up. 🌟");
    else if (total >= 50) setSleepResult("Your sleep can be better. Small changes help. 🌱");
    else setSleepResult("Your sleep was poor. Let's improve it together. 💙");
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "50px" }}>
            <button
              onClick={() => setTab("mood")}
              style={{
                padding: "14px 40px",
                background: tab === "mood" ? "#4caf50" : "#d0e8d0",
                color: tab === "mood" ? "white" : "#2e7d32",
                border: "none",
                borderRadius: "30px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Mood Tracker
            </button>
            <button
              onClick={() => setTab("sleep")}
              style={{
                padding: "14px 40px",
                background: tab === "sleep" ? "#4caf50" : "#d0e8d0",
                color: tab === "sleep" ? "white" : "#2e7d32",
                border: "none",
                borderRadius: "30px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sleep Tracker
            </button>
          </div>

          {/* Mood Section */}
          {tab === "mood" && (
            <>
              <p style={{ fontSize: "20px", color: "#4caf50", marginBottom: "40px" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              {moodLoading ? (
                <p>Loading mood...</p>
              ) : todayMood ? (
                <div style={{ padding: "40px", background: "#e8f5e8", borderRadius: "24px" }}>
                  <div style={{ fontSize: "100px", marginBottom: "20px" }}>
                    {moods.find(m => m.name === todayMood)?.emoji || "🌱"}
                  </div>
                  <h3 style={{ fontSize: "26px", color: "#2e7d32" }}>
                    You felt <strong>{todayMood}</strong> today
                  </h3>
                  <p style={{ fontSize: "18px", color: "#4caf50" }}>
                    Thank you for sharing. Come back tomorrow. 💙
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px" }}>
                  {moods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => saveMood(mood.name)}
                      disabled={moodSaving}
                      style={{
                        padding: "24px 16px",
                        background: mood.color,
                        borderRadius: "24px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "60px" }}>{mood.emoji}</div>
                      <div style={{ fontSize: "18px", color: "#2e7d32" }}>{mood.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Sleep Section */}
          {tab === "sleep" && (
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "80px" }}>
                <button onClick={startSleep} style={{ padding: "20px 50px", background: "#4caf50", color: "white", borderRadius: "30px" }}>
                  Start Sleep
                </button>
                <button onClick={endSleep} style={{ padding: "20px 50px", background: "#81c784", color: "white", borderRadius: "30px" }}>
                  Wake Up
                </button>
              </div>

              {endTime && (
                <div>
                  <p>Total Sleep: {formatTime(sleepDuration)}</p>
                  <p>Phone Usage: {formatTime(phoneUsage)}</p>
                  <p>Variation: {variation}%</p>

                  <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    <button onClick={() => setSelfReport("Good")}>Good 😊</button>
                    <button onClick={() => setSelfReport("Bad")}>Bad 😔</button>
                    <button onClick={() => setSelfReport("Fresh Morning")}>Fresh Morning 🌞</button>
                  </div>

                  <button onClick={calculateScore} disabled={!selfReport}>
                    Calculate Score
                  </button>

                  {sleepScore > 0 && (
                    <div>
                      <p>Sleep Score: {sleepScore}%</p>
                      <p>{sleepResult}</p>
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