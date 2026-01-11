// src/pages/Chatbot.jsx
import { useState, useEffect, useRef } from "react";
import Navbar from "../componet/navbar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSubscription } from "../hooks/useSubscription";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const { isPro, subscription } = useSubscription();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your MindCare assistant. How are you feeling today? I'm here to listen and help. 🌿",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [dailyLimit] = useState(10);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!isPro()) {
      fetchMessageCount();
    }
  }, [isPro]);

  const fetchMessageCount = async () => {
    try {
      const today = new Date().toDateString();
      const userDoc = await getDoc(doc(db, "chatUsage", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.date === today) {
          setMessageCount(data.count || 0);
        } else {
          setMessageCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching message count:", error);
    }
  };

  const updateMessageCount = async () => {
    try {
      const today = new Date().toDateString();
      await setDoc(doc(db, "chatUsage", auth.currentUser.uid), {
        count: messageCount + 1,
        date: today,
        timestamp: serverTimestamp(),
      });
      setMessageCount(messageCount + 1);
    } catch (error) {
      console.error("Error updating message count:", error);
    }
  };

  // Missing API key warning
  if (!GEMINI_API_KEY) {
    return (
      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ textAlign: "center", background: "white", padding: "40px", borderRadius: "30px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
            <h2 style={{ color: "#d32f2f" }}>⚠️ Gemini API Key Missing</h2>
            <p>Please add your key to <code>.env</code> file and restart:</p>
            <pre style={{ background: "#eee", padding: "16px", borderRadius: "8px", margin: "20px 0" }}>
              REACT_APP_GEMINI_API_KEY=your_real_key_here
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Check message limit for free users
    if (!isPro() && messageCount >= dailyLimit) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "You've reached your daily limit of 10 messages. Upgrade to Pro for unlimited conversations! 🌟" },
      ]);
      return;
    }

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Enhanced prompt for Pro users
      const prompt = isPro()
        ? `You are a compassionate mental health assistant. Provide empathetic, detailed, and professional support. User says: ${input}`
        : input;

      const result = await model.generateContent(prompt);
      const aiReply = result.response.text();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiReply },
      ]);

      // Update message count for free users
      if (!isPro()) {
        await updateMessageCount();
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment. 🌱" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // NEW: Start a completely fresh conversation
  const startNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello again! Ready for a fresh start? How are you feeling now? I'm here whenever you need me. 🌿",
      },
    ]);
    setInput("");
  };

  const remainingMessages = dailyLimit - messageCount;

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column" , justifyContent:"center" , alignItems:"center"}}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: "900px", margin: "20px auto", width: "100%", padding: "0 20px" }}>
        <div style={{
          background: "white",
          borderRadius: "30px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          height: "75vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Header with New Chat Button */}
          <div style={{
            background: isPro() ? "linear-gradient(135deg, #d0e8d0, #e8f5e9)" : "#d0e8d0",
            padding: "24px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "30px 30px 0 0",
          }}>
            <div>
              <h2 style={{ fontSize: "28px", color: "#2e7d32", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                MindCare Assistant 🌿
                {isPro() && <span style={{ fontSize: "18px", background: "linear-gradient(135deg, #ffd700, #ffed4e)", color: "#000", padding: "4px 12px", borderRadius: "12px", fontWeight: "bold" }}>👑 PRO</span>}
              </h2>
              <p style={{ fontSize: "16px", color: "#4caf50", margin: "10px 0 0 0" }}>
                {isPro() ? "Unlimited conversations with enhanced support" : `${remainingMessages} messages remaining today`}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {!isPro() && (
                <button
                  onClick={() => navigate("/subscription")}
                  style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
                    color: "white",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(156,39,176,0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  ⬆️ Upgrade
                </button>
              )}

              {/* New Chat Button */}
              <button
                onClick={startNewChat}
                style={{
                  padding: "14px 28px",
                  background: "#81c784",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(129,199,132,0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#66bb6a")}
                onMouseLeave={(e) => (e.target.style.background = "#81c784")}
              >
                ✨ New Chat
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                <div style={{
                  background: msg.role === "user" ? "#81c784" : "#e8f5e8",
                  color: msg.role === "user" ? "white" : "#2e7d32",
                  padding: "16px 20px",
                  borderRadius: "20px",
                  borderTopLeftRadius: msg.role === "assistant" ? "4px" : "20px",
                  borderTopRightRadius: msg.role === "user" ? "4px" : "20px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                  fontSize: "16.5px",
                  lineHeight: "1.6",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: "flex-start" }}>
                <div style={{
                  background: "#e8f5e8",
                  color: "#4caf50",
                  padding: "16px 20px",
                  borderRadius: "20px",
                  borderTopLeftRadius: "4px",
                  fontStyle: "italic",
                }}>
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: "20px", background: "#f8fcf8", borderTop: "1px solid #d0e8d0" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share how you're feeling..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  fontSize: "16px",
                  borderRadius: "30px",
                  border: "2px solid #a5d6a7",
                  outline: "none",
                  background: "white",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  padding: "16px 28px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  opacity: loading || !input.trim() ? 0.7 : 1,
                  boxShadow: "0 6px 18px rgba(76,175,80,0.3)",
                  transition: "all 0.3s",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

