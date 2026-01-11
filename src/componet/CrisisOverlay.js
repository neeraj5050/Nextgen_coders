import React from 'react';
import { HELP_LINES } from '../constants';

const CrisisOverlay = ({ onClose }) => {
  return (
    <div style={{ 
      position: "fixed",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(5px)",
    }}>
      <div style={{ 
        background: "white", 
        borderRadius: "20px", 
        width: "100%", 
        maxWidth: "500px", 
        overflow: "hidden", 
        boxShadow: "0 15px 40px rgba(0,0,0,0.3)", 
        border: "4px solid #e57373" 
      }}>
        <div style={{ 
          background: "#e57373", 
          color: "white", 
          padding: "24px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between" 
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
            ⚠️ Crisis Support
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "white" }}>
            ×
          </button>
        </div>
        
        <div style={{ padding: "24px", spaceY: "24px" }}>
          <p style={{ fontSize: "18px", color: "#2e7d32", fontWeight: "medium" }}>
            You are not alone. There are people ready to help right now.
          </p>
          
          <div style={{ spaceY: "16px" }}>
            {HELP_LINES.map((line) => (
              <div key={line.number} style={{ padding: "16px", background: "#f0f7ea", border: "1px solid #a5d6a7", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "bold", color: "#2e7d32" }}>{line.name}</span>
                  <a href={`tel:${line.number}`} style={{ background: "#81c784", color: "white", padding: "8px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
                    Call Now
                  </a>
                </div>
                <div style={{ fontSize: "20px", fontFamily: "monospace", color: "#e57373", fontWeight: "bold", marginBottom: "4px" }}>{line.number}</div>
                <div style={{ fontSize: "14px", color: "#666" }}>{line.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "14px", color: "#666", fontStyle: "italic", textAlign: "center", marginTop: "24px" }}>
            MindCare is an AI and cannot provide emergency medical help.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisOverlay;