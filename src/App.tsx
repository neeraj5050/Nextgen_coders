// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CrisisOverlay } from './componet/CrisisOverlay';
import { BreathingExercise } from './componet/BreathingExercise';
import { LiveVoiceView } from './componet/LiveVoiceView';

const App = () => {
  const [mode, setMode] = useState('CHAT'); // CHAT, VOICE, BREATHING
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isCrisis, setIsCrisis] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const aiReply = result.response.text();

      const assistantMsg = { role: "assistant", content: aiReply, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);

      // Crisis detection (simple keyword check)
      if (aiReply.toLowerCase().includes("crisis") || aiReply.toLowerCase().includes("suicide")) {
        setIsCrisis(true);
      }
    } catch (error) {
      console.error("Gemini error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble responding. Please try again. 🌱" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ea", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: "900px", margin: "40px auto", width: "100%", padding: "0 20px" }}>
        {mode === 'CHAT' && (
          <div style={{ background: "white", borderRadius: "30px", padding: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "32px", color: "#2e7d32" }}>MindCare Chat</h2>
            <div style={{ height: "400px", overflowY: "auto", marginBottom: "20px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
                  <div style={{
                    background: msg.role === "user" ? "#81c784" : "#e8f5e8",
                    color: msg.role === "user" ? "white" : "#2e7d32",
                    padding: "16px 20px",
                    borderRadius: "20px",
                    marginBottom: "10px",
                    maxWidth: "80%",
                    display: "inline-block",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts..."
              style={{ width: "100%", padding: "16px", borderRadius: "30px", border: "2px solid #a5d6a7" }}
            />
            <button onClick={sendMessage} style={{ padding: "16px 32px", background: "#4caf50", color: "white", borderRadius: "30px", marginTop: "10px" }}>
              Send
            </button>
          </div>
        )}

        {mode === 'VOICE' && <LiveVoiceView />}

        {mode === 'BREATHING' && <BreathingExercise />}

        {isCrisis && <CrisisOverlay onClose={() => setIsCrisis(false)} />}
      </div>
    </div>
  );
};

export default App;