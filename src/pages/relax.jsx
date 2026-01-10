// src/pages/Relax.jsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../componet/navbar";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import meditatingMan from "./image/meditating-man.png";
import seatedForwardBend from "./image/ben.png";
import bridgePose from "./image/bridge-pose.png";
import legsUpTheWall from "./image/legs-up-the-wall.png";
import treePose from "./image/tree-pose.png";
import lotusPose from "./image/lotus-pose.png";
import childsPose from "./image/childs-pose.png";

const yogaPoses = [
  {
    name: "Seated Forward Bend",
    sanskrit: "Paschimottanasana",
    desc: "Stretches the entire spine and reduces stress. Inhale deeply and reach forward to touch your toes or hold your ankles. Keep your spine long as you fold forward. Promotes relaxation and emotional well-being.",
    time: 180,
    img: seatedForwardBend,
  },
  {
    name: "Bridge Pose",
    sanskrit: "Setu Bandhasana",
    desc: "Strengthens the back, opens the chest, and alleviates anxiety. Lie on your back, lift your hips, and engage your glutes. Counters hunched posture and fosters strength and stability.",
    time: 120,
    img: bridgePose,
  },
  {
    name: "Legs-Up-the-Wall",
    sanskrit: "Viparita Karani",
    desc: "Soothing inversion that improves circulation and helps with anxiety and insomnia. Swing legs up the wall, relax arms by sides. Calms the nervous system.",
    time: 300,
    img: legsUpTheWall,
  },
  {
    name: "Tree Pose",
    sanskrit: "Vrksasana",
    desc: "Cultivates concentration and inner calm. Balance on one leg, place foot on inner thigh, hands at heart center. Encourages mindfulness and focus.",
    time: 240,
    perSide: true,
    img: treePose,
  },
  {
    name: "Lotus Pose",
    sanskrit: "Padmasana",
    desc: "Classic meditation pose that promotes inner peace and serenity. Sit cross-legged with feet on thighs, hands on knees. Cultivates concentration and calm.",
    time: 600,
    img: lotusPose,
  },
  {
    name: "Child's Pose",
    sanskrit: "Balasana",
    desc: "Gentle resting pose that calms the mind and releases back tension. Kneel, fold forward, arms extended or by sides. A safe space to breathe and rest.",
    time: 180,
    img: childsPose,
  },
];

const Relax = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [timer, setTimer] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSide, setCurrentSide] = useState(1);
  const [sessionStarted, setSessionStarted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const openPopup = (type, content = null) => {
    setPopupContent({ type, content });
    setTimer(type === "meditation" ? 120 : content.time);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentSide(1);
    setSessionStarted(false);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsRunning(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setTimer(popupContent?.type === "meditation" ? 120 : popupContent?.content?.time || 120);
    setCurrentSide(1);
    setSessionStarted(false);
  };

  const startSession = () => {
    setIsRunning(true);
    setSessionStarted(true);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const nextSide = () => {
    if (popupContent?.content?.perSide && currentSide === 1) {
      setCurrentSide(2);
      setTimer(popupContent.content.time / 2);
      setIsRunning(true);
    }
  };

  useEffect(() => {
    if (isRunning && !isPaused && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (popupContent?.content?.perSide && currentSide === 1) {
              toast.info("🌿 Time to switch sides!");
              return 0;
            } else {
              toast.success("🌿 Session complete. You did beautifully.");
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, timer, popupContent, currentSide]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ea", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, padding: "40px 20px" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "42px", fontWeight: "bold", color: "#2e7d32" }}>
            🌿 Relax & Restore
          </h1>
          <p style={{ fontSize: "20px", color: "#4caf50" }}>
            Gentle practices to calm your mind and body
          </p>
        </div>

        {/* Central Meditation Button - Perfectly Centered */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "100px" }}>
          <button
            onClick={() => openPopup("meditation")}
            style={{
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background: "#d0e8d0",
              border: "none",
              boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <div style={{ fontSize: "120px" }}>🧘‍♂️</div>
            <h3 style={{ fontSize: "30px", color: "#2e7d32", marginTop: "20px" }}>
              Start Meditation
            </h3>
          </button>
        </div>

        {/* Yoga Poses Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "150px" }}>
          {yogaPoses.map((pose, i) => (
            <div
              key={i}
              onClick={() => openPopup("yoga", pose)}
              style={{
                background: "white",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-12px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <img src={pose.img} alt={pose.name} style={{ width: "100%", height: "220px", objectFit: "cover" }} />
              <div style={{ padding: "30px", textAlign: "center" }}>
                <h3 style={{ fontSize: "24px", color: "#2e7d32", margin: "0 0 12px 0" }}>
                  {pose.name}
                </h3>
                <p style={{ fontSize: "15px", color: "#666", fontStyle: "italic", margin: "0 0 16px 0" }}>
                  {pose.sanskrit}
                </p>
                <p style={{ fontSize: "16px", color: "#33691e", lineHeight: "1.7" }}>
                  {pose.desc}
                </p>
                <p style={{ fontSize: "15px", color: "#4caf50", fontWeight: "600", marginTop: "20px" }}>
                  ⏱ {pose.time / 60} minutes{pose.perSide ? " (per side)" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup - Now Smaller & Close Button Visible */}
      {showPopup && popupContent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            borderRadius: "40px",
            width: "90%",
            maxWidth: "550px",        
            maxHeight: "90vh",        
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
            position: "relative",
            overflowY: "auto",
          }}>
            {/* Close Button - Now clearly visible */}
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "20px",
                right: "25px",
                background: "#ffebee",
                color: "#c62828",
                border: "none",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                fontSize: "28px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
              aria-label="Close session"
            >
              ×
            </button>

            <h2 style={{ fontSize: "32px", color: "#2e7d32", margin: "0 0 30px 0" }}>
              {popupContent.type === "meditation" ? "🌿 Guided Meditation" : popupContent.content.name}
            </h2>

            {!sessionStarted && (
              <button
                onClick={startSession}
                style={{
                  padding: "16px 36px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "20px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "30px",
                  boxShadow: "0 8px 25px rgba(76,175,80,0.3)",
                }}
              >
                Start Session
              </button>
            )}

            {sessionStarted && (
              <>
                <div style={{ fontSize: "80px", fontWeight: "bold", color: "#4caf50", margin: "40px 0" }}>
                  {formatTimer(timer)}
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "40px" }}>
                  <button
                    onClick={togglePause}
                    style={{
                      padding: "12px 28px",
                      background: isPaused ? "#4caf50" : "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "30px",
                      fontSize: "18px",
                    }}
                  >
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                  </button>

                  {popupContent.content?.perSide && currentSide === 1 && timer === 0 && (
                    <button
                      onClick={nextSide}
                      style={{
                        padding: "12px 28px",
                        background: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: "30px",
                        fontSize: "18px",
                      }}
                    >
                      Next Side →
                    </button>
                  )}
                </div>

                {/* Breathing Line */}
                <div style={{
                  height: "6px",
                  background: "#81c784",
                  borderRadius: "3px",
                  width: "70%",
                  margin: "40px auto",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: "30%",
                    background: "#4caf50",
                    borderRadius: "3px",
                    animation: isRunning && !isPaused ? "breatheLine 4s ease-in-out infinite" : "none",
                  }} />
                </div>
              </>
            )}

            <img
              src={popupContent.type === "meditation" ? meditatingMan : popupContent.content.img}
              alt={popupContent.type === "meditation" ? "Meditation" : popupContent.content.name}
              style={{
                width: "100%",
                maxWidth: "350px",
                borderRadius: "30px",
                margin: "40px 0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            />

            <p style={{ fontSize: "18px", color: "#33691e", lineHeight: "1.8", maxWidth: "500px", margin: "0 auto" }}>
              {popupContent.type === "meditation"
                ? "Close your eyes. Breathe in slowly through your nose... hold... and exhale gently. You are safe. You are enough. Let go of tension with each breath."
                : popupContent.content.desc}
            </p>

            {popupContent.type === "yoga" && (
              <p style={{ fontSize: "16px", color: "#666", marginTop: "30px", fontStyle: "italic" }}>
                {popupContent.content.sanskrit}
                {popupContent.content.perSide && ` - Side ${currentSide} of 2`}
              </p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes breatheLine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(233%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Relax;