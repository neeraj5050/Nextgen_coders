import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MINDCARE_SYSTEM_PROMPT, HELP_LINES } from '../constants';
import { encode, decode, decodeAudioData } from '../utils/audio';
import CrisisOverlay from './CrisisOverlay';
import BreathingExercise from './BreathingExercise';

const LiveVoiceView = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [status, setStatus] = useState("Ready to talk");
  const [isCrisis, setIsCrisis] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);

  const sessionRef = useRef(null);
  const audioContextRef = useRef(null);
  const outputAudioContextRef = useRef(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set());

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GENAI_API_KEY);

  const startSession = async () => {
    setIsConnecting(true);
    setStatus("Connecting...");

    try {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const session = await genAI.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setStatus("Listening...");

            const source = audioContextRef.current.createMediaStreamSource(stream);
            const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              session.sendRealtimeInput({ media: pcmBlob });
            };

            source.connect(processor);
            processor.connect(audioContextRef.current.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant') {
                  return [...prev.slice(0, -1), { role: 'assistant', text: last.text + message.serverContent.outputTranscription.text }];
                }
                return [...prev, { role: 'assistant', text: message.serverContent.outputTranscription.text }];
              });

              // Check for crisis keywords in AI response
              const lower = message.serverContent.outputTranscription.text.toLowerCase();
              if (lower.includes('kiran') || lower.includes('helpline') || lower.includes('suicide') || lower.includes('harm')) {
                setIsCrisis(true);
              }
              
              // Check for breathing suggestion
              if (lower.includes('breath') || lower.includes('breathe') || lower.includes('grounding')) {
                setShowBreathing(true);
              }
            }

            if (message.serverContent?.inputTranscription) {
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'user') {
                  return [...prev.slice(0, -1), { role: 'user', text: last.text + message.serverContent.inputTranscription.text }];
                }
                return [...prev, { role: 'user', text: message.serverContent.inputTranscription.text }];
              });
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Error:", e);
            setStatus("Connection error. Try again?");
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        },
        config: {
          responseModalities: ["AUDIO"],
          systemInstruction: MINDCARE_SYSTEM_PROMPT,
          speechConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' } // Calm voice
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });

      sessionRef.current = session;

    } catch (error) {
      console.error("Session start error:", error);
      setStatus("Couldn't start voice chat. Check microphone permission.");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
    setStatus("Ready to talk");
  };

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column", 
      height: "100%", 
      background: "#f0f7ea", 
      color: "#2e7d32",
      padding: "24px",
      position: "relative", 
      overflow: "hidden" 
    }}>
      {/* Animated Background */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        overflow: "hidden", 
        opacity: 0.2, 
        pointerEvents: "none" 
      }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "#81c784",
          borderRadius: "50%",
          filter: "blur(120px)",
          transition: "all 1s ease",
          scale: isActive ? 1.25 : 0.5,
        }}></div>
      </div>

      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "48px" }}>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "28px", fontFamily: "serif", marginBottom: "8px" }}>Speak with MindCare</h3>
          <p style={{ fontSize: "18px", color: isActive ? "#4caf50" : "#666", transition: "color 0.3s" }}>
            {status}
          </p>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Visualizer Circle */}
          <div style={{
            width: "192px",
            height: "192px",
            borderRadius: "50%",
            border: "4px solid",
            borderColor: isActive ? "#4caf50" : "#a5d6a7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.5s ease",
            scale: isActive ? 1.1 : 1,
            boxShadow: "0 0 50px rgba(76,175,80,0.3)",
          }}>
            {isActive ? (
              <div style={{ display: "flex", gap: "4px", alignItems: "end", height: "64px" }}>
                {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                  <div 
                    key={i}
                    style={{
                      width: "6px",
                      height: `${h * 15}%`,
                      background: "#4caf50",
                      borderRadius: "999px",
                      animation: isActive ? `wave 1s ease-in-out infinite ${i * 0.1}s` : "none"
                    }}
                  />
                ))}
              </div>
            ) : (
              <svg style={{ height: "80px", width: "80px", color: "#a5d6a7" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </div>
        </div>

        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          style={{
            padding: "16px 48px",
            borderRadius: "999px",
            fontSize: "20px",
            fontWeight: "bold",
            transition: "all 0.3s",
            transform: "active:scale(95%)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: isActive ? "#e57373" : "#4caf50",
            color: "white",
            opacity: isConnecting ? 0.5 : 1,
            cursor: isConnecting ? "not-allowed" : "pointer",
          }}
        >
          {isConnecting ? (
            <>
              <div style={{ width: "20px", height: "20px", border: "2px solid white", borderTop: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
              Connecting...
            </>
          ) : isActive ? (
            "Stop Conversation"
          ) : (
            "Start Talking"
          )}
        </button>
      </div>

      {/* Real-time Transcripts */}
      <div style={{ position: "relative", zIndex: 10, maxHeight: "192px", overflowY: "auto", width: "100%", maxWidth: "800px", margin: "0 auto", marginTop: "24px", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
        {transcript.length === 0 ? (
          <p style={{ textAlign: "center", fontStyle: "italic", fontSize: "14px", color: "#a5d6a7" }}>Transcription will appear here...</p>
        ) : (
          <div style={{ spaceY: "12px" }}>
            {transcript.slice(-4).map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", color: t.role === 'user' ? "#81c784" : "white" }}>
                <span style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "10px", marginTop: "4px", opacity: 0.5 }}>{t.role}:</span>
                <p style={{ fontSize: "14px", lineHeight: "1.5" }}>{t.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isCrisis && <CrisisOverlay onClose={() => setIsCrisis(false)} />}
      {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LiveVoiceView;