// src/pages/Test.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../componet/navbar";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — that you are a failure or have let yourself/family down",
    "Trouble concentrating on things, such as reading or watching TV",
    "Moving or speaking so slowly that other people could have noticed",
    "Being so fidgety or restless that you've been moving around a lot more than usual",
    "Thoughts that you would be better off dead or of hurting yourself",
    "These problems made it difficult to work, take care of home, or get along with others",
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Feeling restless — finding it hard to sit still",
  ];

  const options = [
    { value: 0, label: "Not at all", emoji: "😊", color: "#c8e6c9" },
    { value: 1, label: "Several days", emoji: "😐", color: "#fff59d" },
    { value: 2, label: "More than half the days", emoji: "😔", color: "#ffcc80" },
    { value: 3, label: "Nearly every day", emoji: "😢", color: "#ffab91" },
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const score = Object.values(answers).reduce((a, b) => a + b, 0);

  const getResult = () => {
    if (score <= 10) {
      return {
        title: "You're Doing Well 🌱",
        message: "Your mood shows strong resilience right now. Keep nurturing yourself — you're on a beautiful path.",
        affirmation: "I am growing. I am healing. I am enough just as I am.",
        suggestion: "Celebrate with some relaxing music or a journal entry about what makes you smile.",
        color: "#81c784",
        glow: "#c8e6c9",
      };
    } else if (score <= 20) {
      return {
        title: "Some Gentle Waves 💙",
        message: "You've been feeling a bit low lately. This is normal, and you're already taking a brave step by checking in.",
        affirmation: "It's okay to not be okay. I am worthy of care and compassion.",
        suggestion: "Try a short meditation or write in your journal tonight.",
        color: "#fff59d",
        glow: "#fff9c4",
      };
    } else if (score <= 30) {
      return {
        title: "Carrying a Bit More Today 🌧️",
        message: "Things have felt heavier. Thank you for being honest — that takes real strength.",
        affirmation: "My feelings are valid. I am allowed to rest and heal.",
        suggestion: "Visit the Relax page for guided breathing or reach out via the Help section if you'd like.",
        color: "#ffb74d",
        glow: "#ffe0b2",
      };
    } else {
      return {
        title: "You've Been Through a Lot 💚",
        message: "Your heart has been carrying a heavy load. You're not alone — help is here whenever you're ready.",
        affirmation: "I am worthy of support. Asking for help is a sign of courage.",
        suggestion: "Please visit the Help page right now for free, confidential support lines. You matter deeply.",
        color: "#e57373",
        glow: "#ffcdd2",
      };
    }
  };

  const result = getResult();
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / (questions.length + 1)) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ea", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: "800px", margin: "40px auto", width: "100%", padding: "0 20px" }}>
        <div style={{
          background: "white",
          borderRadius: "40px",
          padding: "60px 40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "40px", fontWeight: "bold", color: "#2e7d32", margin: "0 0 20px 0" }}>
            🌿 Gentle Mood Check-In
          </h2>
          <p style={{ fontSize: "20px", color: "#4caf50", margin: "0 0 60px 0", lineHeight: "1.7" }}>
            Over the last 2 weeks, how often have you felt...
          </p>

          {/* Circular Progress Ring */}
          <div style={{ position: "relative", width: "180px", height: "180px", margin: "0 auto 20px auto" }}>
            <svg width="150" height="150" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="90"
                cy="90"
                r="80"
                stroke="#d0e8d0"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="90"
                cy="90"
                r="80"
                stroke="#4caf50"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${progress * 5.026} 502.6`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.8s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "36px",
              fontWeight: "bold",
              color: "#2e7d32",
            }}>
              {currentQuestion + 1}/{questions.length}
            </div>
          </div>

          {!showResult ? (
            <>
              <p style={{ fontSize: "26px", color: "#2e7d32", margin: "0 0 70px 0", fontWeight: "600", maxWidth: "800px", lineHeight: "1.6" }}>
                {questions[currentQuestion]}
              </p>

              {/* Circular Answer Buttons */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "50px",
                maxWidth: "600px",
                margin: "0 auto",
              }}>
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      background: opt.color,
                      border: answers[currentQuestion] === opt.value ? "10px solid #4caf50" : "none",
                      boxShadow: answers[currentQuestion] === opt.value
                        ? "0 20px 50px rgba(76,175,80,0.4)"
                        : "0 12px 35px rgba(0,0,0,0.15)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.4s ease",
                      margin: "0 auto",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.target.style.transform = answers[currentQuestion] === opt.value ? "scale(1.05)" : "scale(1)")}
                  >
                    <div style={{ fontSize: "80px", marginBottom: "5px" }}>
                      {opt.emoji}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2e7d32" }}>
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Beautiful Result Screen */
            <div style={{
              padding: "60px 40px",
              background: result.glow,
              borderRadius: "40px",
              boxShadow: `0 25px 60px ${result.glow}80`,
            }}>
              <div style={{ fontSize: "120px", marginBottom: "30px" }}>🌱</div>
              <h3 style={{ fontSize: "38px", color: result.color, fontWeight: "bold", margin: "0 0 30px 0" }}>
                {result.title}
              </h3>
              <p style={{ fontSize: "22px", color: "#33691e", lineHeight: "1.9", maxWidth: "700px", margin: "0 auto 40px" }}>
                {result.message}
              </p>
              <p style={{ fontSize: "24px", color: "#2e7d32", fontStyle: "italic", margin: "0 0 50px 0", fontWeight: "600" }}>
                "{result.affirmation}"
              </p>
              <p style={{ fontSize: "19px", color: "#4caf50", fontWeight: "600", margin: "0 0 50px 0" }}>
                {result.suggestion}
              </p>

              <div style={{ display: "flex", gap: "30px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/home">
                  <button style={{
                    padding: "18px 50px",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "40px",
                    fontSize: "20px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 12px 35px rgba(76,175,80,0.4)",
                  }}>
                    Back to Home
                  </button>
                </Link>
                <Link to="/journal">
                  <button style={{
                    padding: "18px 50px",
                    background: "#81c784",
                    color: "white",
                    border: "none",
                    borderRadius: "40px",
                    fontSize: "20px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}>
                    Write in Journal
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;