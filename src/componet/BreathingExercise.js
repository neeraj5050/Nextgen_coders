import React, { useState, useEffect } from 'react';

export const BreathingExercise = () => {
  const [phase, setPhase] = useState('Inhale');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          if (phase === 'Inhale') { setPhase('Hold'); return 4; }
          if (phase === 'Hold') { setPhase('Exhale'); return 4; }
          setPhase('Inhale'); return 4;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "32px", 
      height: "100%", 
      background: "linear-gradient(to bottom, #f0f7ea, #e8f5e8)", 
      borderRadius: "30px" 
    }}>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: "28px", fontFamily: "serif", color: "#2e7d32", marginBottom: "16px" }}>
          Mindful Breathing
        </h3>
        <p style={{ fontSize: "18px", color: "#4caf50" }}>Focus and breathe</p>
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", margin: "40px 0" }}>
        <div style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "#81c784",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 4s ease",
          transform: phase === 'Inhale' ? "scale(1.3)" : "scale(0.8)",
        }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
            {phase}
          </div>
        </div>
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          borderRadius: "50%", 
          border: "4px solid #4caf50",
          animation: phase === 'Inhale' ? "breathe-pulse 4s ease-in-out infinite" : "none" 
        }} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {[4, 3, 2, 1].map((n, i) => (
          <div 
            key={i}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: timer >= n ? "#4caf50" : "#a5d6a7",
              transition: "background 0.3s"
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: "16px", color: "#2e7d32", fontStyle: "italic", textAlign: "center", maxWidth: "400px", marginTop: "32px" }}>
        "One breath at a time. You are safe. You are strong."
      </p>
    </div>
  );
};