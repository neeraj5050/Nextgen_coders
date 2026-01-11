// // src/pages/Chatbot.jsx
// import { useState, useEffect, useRef } from "react";
// import Navbar from "../componet/navbar";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content: "Hello! I'm your MindCare assistant. How are you feeling today? I'm here to listen and help. 🌿",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   // Missing API key warning
//   if (!GEMINI_API_KEY) {
//     return (
//       <div style={{ minHeight: "100vh", background: "#f0f7ea", display: "flex", flexDirection: "column" }}>
//         <Navbar />
//         <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
//           <div style={{ textAlign: "center", background: "white", padding: "40px", borderRadius: "30px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
//             <h2 style={{ color: "#d32f2f" }}>⚠️ Gemini API Key Missing</h2>
//             <p>Please add your key to <code>.env</code> file and restart:</p>
//             <pre style={{ background: "#eee", padding: "16px", borderRadius: "8px", margin: "20px 0" }}>
//               REACT_APP_GEMINI_API_KEY=your_real_key_here
//             </pre>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Latest fast model

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage = { role: "user", content: input.trim() };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const result = await model.generateContent(input);
//       const aiReply = result.response.text();

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: aiReply },
//       ]);
//     } catch (error) {
//       console.error("Gemini Error:", error);
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment. 🌱" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // NEW: Start a completely fresh conversation
//   const startNewChat = () => {
//     setMessages([
//       {
//         role: "assistant",
//         content: "Hello again! Ready for a fresh start? How are you feeling now? I'm here whenever you need me. 🌿",
//       },
//     ]);
//     setInput("");
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#f0f7ea", display: "flex", flexDirection: "column" }}>
//       <Navbar />

//       <div style={{ flex: 1, maxWidth: "900px", margin: "20px auto", width: "100%", padding: "0 20px" }}>
//         <div style={{
//           background: "white",
//           borderRadius: "30px",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
//           height: "75vh",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}>
//           {/* Header with New Chat Button */}
//           <div style={{
//             background: "#d0e8d0",
//             padding: "24px 30px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderRadius: "30px 30px 0 0",
//           }}>
//             <div>
//               <h2 style={{ fontSize: "28px", color: "#2e7d32", margin: 0 }}>
//                 MindCare Assistant 🌿
//               </h2>
//               <p style={{ fontSize: "16px", color: "#4caf50", margin: "10px 0 0 0" }}>
//                 Your safe space to talk, reflect, and grow
//               </p>
//             </div>

//             {/* New Chat Button */}
//             <button
//               onClick={startNewChat}
//               style={{
//                 padding: "14px 28px",
//                 background: "#81c784",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "30px",
//                 fontSize: "16px",
//                 fontWeight: "600",
//                 cursor: "pointer",
//                 boxShadow: "0 6px 18px rgba(129,199,132,0.3)",
//                 transition: "all 0.3s ease",
//               }}
//               onMouseEnter={(e) => (e.target.style.background = "#66bb6a")}
//               onMouseLeave={(e) => (e.target.style.background = "#81c784")}
//             >
//               ✨ New Chat
//             </button>
//           </div>

//           {/* Messages Area */}
//           <div style={{
//             flex: 1,
//             padding: "20px",
//             overflowY: "auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: "16px",
//           }}>
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 style={{
//                   alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
//                   maxWidth: "80%",
//                 }}
//               >
//                 <div style={{
//                   background: msg.role === "user" ? "#81c784" : "#e8f5e8",
//                   color: msg.role === "user" ? "white" : "#2e7d32",
//                   padding: "16px 20px",
//                   borderRadius: "20px",
//                   borderTopLeftRadius: msg.role === "assistant" ? "4px" : "20px",
//                   borderTopRightRadius: msg.role === "user" ? "4px" : "20px",
//                   boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
//                   fontSize: "16.5px",
//                   lineHeight: "1.6",
//                 }}>
//                   {msg.content}
//                 </div>
//               </div>
//             ))}

//             {loading && (
//               <div style={{ alignSelf: "flex-start" }}>
//                 <div style={{
//                   background: "#e8f5e8",
//                   color: "#4caf50",
//                   padding: "16px 20px",
//                   borderRadius: "20px",
//                   borderTopLeftRadius: "4px",
//                   fontStyle: "italic",
//                 }}>
//                   Thinking...
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div style={{ padding: "20px", background: "#f8fcf8", borderTop: "1px solid #d0e8d0" }}>
//             <div style={{ display: "flex", gap: "12px" }}>
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Share how you're feeling..."
//                 disabled={loading}
//                 style={{
//                   flex: 1,
//                   padding: "16px 24px",
//                   fontSize: "16px",
//                   borderRadius: "30px",
//                   border: "2px solid #a5d6a7",
//                   outline: "none",
//                   background: "white",
//                   boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)",
//                 }}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={loading || !input.trim()}
//                 style={{
//                   padding: "16px 28px",
//                   background: "#4caf50",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "30px",
//                   fontSize: "16px",
//                   fontWeight: "600",
//                   cursor: loading || !input.trim() ? "not-allowed" : "pointer",
//                   opacity: loading || !input.trim() ? 0.7 : 1,
//                   boxShadow: "0 6px 18px rgba(76,175,80,0.3)",
//                   transition: "all 0.3s",
//                 }}
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../componet/navbar";
import { auth } from "../firebaseConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import avatarImage from "../assets/mindcare-avatar.png";

/* ================= AASTHA SYSTEM PROMPT ================= */

const AASTHA_SYSTEM_PROMPT = `
You are Aastha, a warm Indian mental health recovery companion.

PERSONALITY:
- Speak like a caring elder sister (Didi energy).
- Calm, slow, reassuring.
- Emotionally present and gentle.
- Use simple English with light Hinglish when natural.

SPEAKING STYLE:
- 2–4 short sentences only.
- Use emotional pauses with "..."
- Avoid clinical or technical words.
- Ask only ONE gentle question.

EXAMPLES:
❌ "You should regulate your emotions."
✅ "I hear you... that sounds heavy. I'm here with you."

CRISIS HANDLING:
If self-harm or suicide is mentioned:
- Respond with empathy.
- Encourage reaching out.
- Share Indian helplines:
  KIRAN: 1800-599-0019
  Tele-MANAS: 14416

RULES:
- Never diagnose.
- Never give medical advice.
- Keep replies under 50 words.
`;

/* ======================================================= */

const VoiceChat = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste... I am Aastha. I'm here with you. How are you feeling right now? 🌿",
    },
  ]);

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voice, setVoice] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const currentTranscriptRef = useRef("");
  const messagesEndRef = useRef(null);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  /* ================= LOAD VOICES ================= */

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      const preferred =
        voices.find(
          (v) =>
            v.lang === "en-IN" &&
            v.name.toLowerCase().includes("female")
        ) ||
        voices.find((v) => v.lang === "en-IN") ||
        voices[0];

      setVoice(preferred);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* ================= SPEECH RECOGNITION ================= */

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.lang = "en-IN";
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = false;

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
  }, []);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  /* ================= MIC TOGGLE ================= */

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      synthRef.current.cancel();
      currentTranscriptRef.current = "";
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  /* ================= SPEAK FUNCTION ================= */

  const speak = (text) => {
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";

      if (voice) utterance.voice = voice;

      utterance.rate = 0.9;   // calm speed
      utterance.pitch = 1.1;  // warm tone
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }, 400); // emotional pause
  };

  /* ================= AI RESPONSE ================= */

  const handleAasthaResponse = async (userText) => {
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsProcessing(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: AASTHA_SYSTEM_PROMPT,
      });

      const result = await model.generateContent(userText);
      const reply = result.response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (e) {
      const fallback =
        "I'm here with you... take a slow breath. You can tell me more.";
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
      speak(fallback);
    } finally {
      setIsProcessing(false);
      setTranscript("");
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f6" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#0d9488" }}>Aastha</h1>
          <p>Your Recovery Companion</p>
        </div>

        <div style={{ textAlign: "center" }}>
          {isSpeaking && <div className="speaking-glow" />}
          <img
            src={avatarImage}
            alt="Aastha"
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          />
          <p style={{ marginTop: 10 }}>
            {isListening
              ? "Listening to you..."
              : isSpeaking
              ? "Aastha is speaking..."
              : "Ready to listen"}
          </p>
        </div>

        <div style={{ height: 300, overflowY: "auto", margin: "30px 0" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "12px 20px",
                  borderRadius: 18,
                  background: m.role === "user" ? "#0d9488" : "white",
                  color: m.role === "user" ? "white" : "#333",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isProcessing && <p>Aastha is thinking...</p>}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={toggleMic}
            disabled={isProcessing || isSpeaking}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: isListening ? "#ef4444" : "#0d9488",
              color: "white",
              fontSize: 30,
              border: "none",
            }}
          >
            {isListening ? "⏹" : "🎤"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link to="/chatbot">← Switch to Text Chat</Link>
        </div>
      </div>

      <style>{`
        .speaking-glow {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: #2dd4bf;
          filter: blur(30px);
          opacity: 0.4;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default VoiceChat;
