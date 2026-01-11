import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../componet/navbar";
import { auth } from "../firebaseConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import avatarImage from "./image/mindcare-avatar.png";

// Official Aastha System Prompt
const AASTHA_SYSTEM_PROMPT = `
# ROLE
You are "Aastha", a specialized AI Mental Health Recovery Companion for the Indian context. You are empathetic and culturally-informed.
# CONTEXT
- LANGUAGE: Primarily English but understand Hinglish (e.g., "log kya kahenge").
- TONE: Warm, elder-sibling-like ("Didi/Bhaiya" spirit).
- CRISIS: If self-harm is mentioned, provide KIRAN (1800-599-0019) or Tele-MANAS (14416).
- LIMITS: Do not diagnose. Keep voice responses under 50 words.
`;


const VoiceChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste, I am Aastha. I'm here to walk with you through whatever is on your mind. How are you feeling right now? 🌿" }
  ]);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const currentTranscriptRef = useRef("");
  const messagesEndRef = useRef(null);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
      return;
    }

    // Initialize Web Speech API
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-IN"; // Set to Indian English for better recognition

      recognitionRef.current.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        currentTranscriptRef.current = text;
        setTranscript(text);
      };

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (currentTranscriptRef.current.trim()) {
          handleAasthaResponse(currentTranscriptRef.current);
        }
      };
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      synthRef.current.cancel(); // Stop AI if it was talking
      currentTranscriptRef.current = "";
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleAasthaResponse = async (userText) => {
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setIsProcessing(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // Using the latest recommended model for voice
        systemInstruction: AASTHA_SYSTEM_PROMPT 
      });

      const result = await model.generateContent(userText);
      const aiReply = result.response.text();

      setMessages(prev => [...prev, { role: "assistant", content: aiReply }]);
      speak(aiReply);
    } catch (error) {
      const fallback = "I'm listening, Didi/Bhaiya. Take a deep breath. Tell me more.";
      setMessages(prev => [...prev, { role: "assistant", content: fallback }]);
      speak(fallback);
    } finally {
      setIsProcessing(false);
      setTranscript("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f6", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: "800px", margin: "20px auto", width: "100%", padding: "20px" }}>
        
        {/* Aastha Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#0d9488", fontSize: "2.5rem", fontFamily: "Lora, serif" }}>Aastha</h1>
          <p style={{ color: "#0f766e", fontWeight: "500", letterSpacing: "1px" }}>YOUR RECOVERY COMPANION</p>
        </div>

        {/* Avatar View */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div style={{ position: "relative" }}>
            {/* Animated Glow when speaking */}
            {isSpeaking && <div className="speaking-glow"></div>}
            <img
              src={avatarImage}
              alt="Aastha"
              style={{
                width: "200px", height: "200px", borderRadius: "50%",
                border: "4px solid white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                zIndex: 2, position: "relative"
              }}
            />
          </div>
          <p style={{ fontStyle: "italic", color: "#666" }}>
            {isListening ? "Listening to you..." : isSpeaking ? "Aastha is speaking..." : "Ready to listen"}
          </p>
        </div>

        {/* Chat Bubbles */}
        <div style={{ height: "300px", overflowY: "auto", margin: "30px 0", padding: "10px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "15px 0" }}>
              <div style={{
                display: "inline-block", padding: "12px 20px", borderRadius: "18px",
                maxWidth: "80%", background: m.role === "user" ? "#0d9488" : "white",
                color: m.role === "user" ? "white" : "#333",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {isProcessing && <p style={{ color: "#999", fontSize: "0.9rem" }}>Aastha is thinking...</p>}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={toggleMic}
            disabled={isProcessing || isSpeaking}
            style={{
              width: "80px", height: "80px", borderRadius: "50%", border: "none",
              backgroundColor: isListening ? "#ef4444" : "#0d9488",
              color: "white", fontSize: "30px", cursor: "pointer",
              boxShadow: "0 8px 20px rgba(13, 148, 136, 0.3)",
              transition: "transform 0.2s"
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {isListening ? "⏹" : "🎤"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link to="/chatbot" style={{ color: "#0d9488", textDecoration: "none", fontWeight: "bold" }}>
            ← Switch to Text Chat
          </Link>
        </div>
      </div>

      <style>{`
        .speaking-glow {
          position: absolute;
          top: -10px; left: -10px; right: -10px; bottom: -10px;
          background: #2dd4bf;
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0.4;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default VoiceChat;