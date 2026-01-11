
// src/pages/Music.jsx
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Navbar from "../componet/navbar";
import { useNavigate } from "react-router-dom";

const Music = () => {
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
      return;
    }

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
      setLoading(false);
    };

    fetchTodayMood();
  }, [navigate]);

  const playlists = {
    Happy: {
      title: "Uplifting & Joyful Vibes",
      songs: [
        { title: "Happy - Pharrell Williams", url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs" },
        { title: "Good Vibes - Rexx Life Raj", url: "https://www.youtube.com/watch?v=somehappy" },
        { title: "Walking on Sunshine", url: "https://www.youtube.com/watch?v=iPUmE-tne5U" },
      ],
      color: "#fff59d",
    },
    Calm: {
      title: "Peaceful & Soothing Sounds",
      songs: [
        { title: "Weightless - Marconi Union", url: "https://www.youtube.com/watch?v=UfcAVejsQdh" },
        { title: "River Flows in You - Yiruma", url: "https://www.youtube.com/watch?v=7maJOI3QMu0" },
        { title: "Clair de Lune - Debussy", url: "https://www.youtube.com/watch?v=4fvo_iOuClg" },
      ],
      color: "#a7ffeb",
    },
    Okay: {
      title: "Gentle & Balanced Tunes",
      songs: [
        { title: "Here Comes the Sun - The Beatles", url: "https://www.youtube.com/watch?v=KQetemT1sWc" },
        { title: "Acoustic Chill Playlist", url: "https://www.youtube.com/watch?v=someokay" },
      ],
      color: "#c8e6c9",
    },
    Sad: {
      title: "Comforting & Healing Songs",
      songs: [
        { title: "Someone You Loved - Lewis Capaldi", url: "https://www.youtube.com/watch?v=zABLecsR5UE" },
        { title: "Fix You - Coldplay", url: "https://www.youtube.com/watch?v=k4V3Mo61fJM" },
        { title: "Hurt - Johnny Cash", url: "https://www.youtube.com/watch?v=vt1Pwfnh5pc" },
        { title: "Let It Be - The Beatles", url: "https://www.youtube.com/watch?v=QDYfEBY9NM4" },
      ],
      color: "#bbdefb",
    },
    Anxious: {
      title: "Calming & Anxiety Relief",
      songs: [
        { title: "Weightless (8 Hour Version)", url: "https://www.youtube.com/watch?v=qYnA9wWFHLI" },
        { title: "Breathing Exercises Music", url: "https://www.youtube.com/watch?v=someanxious" },
        { title: "Ocean Waves for Deep Relaxation", url: "https://www.youtube.com/watch?v=somewaves" },
      ],
      color: "#ffccbc",
    },
    Angry: {
      title: "Release & Let Go",
      songs: [
        { title: "Numb - Linkin Park", url: "https://www.youtube.com/watch?v=kXYiU_JCYtU" },
        { title: "Heavy Metal Detox Playlist", url: "https://www.youtube.com/watch?v=someheavy" },
        { title: "In the End - Linkin Park", url: "https://www.youtube.com/watch?v=eVTXPUF4Oz4" },
      ],
      color: "#ffab91",
    },
  };

  const currentPlaylist = todayMood ? playlists[todayMood] || playlists.Okay : null;

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: "900px", margin: "40px auto", width: "100%", padding: "0 20px" }}>
        <div style={{
          background: "white",
          borderRadius: "30px",
          padding: "50px 40px",
          boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "34px", fontWeight: "bold", color: "#2e7d32", margin: "0 0 20px 0" }}>
            🎵 Music for Your Mood
          </h2>

          {loading && <p style={{ fontSize: "18px", color: "#4caf50" }}>Finding the right music for you...</p>}

          {!loading && !todayMood && (
            <div style={{ padding: "40px", color: "#666" }}>
              <p style={{ fontSize: "18px" }}>No mood logged today yet.</p>
              <button
                onClick={() => navigate("/mood")}
                style={{
                  marginTop: "20px",
                  padding: "14px 32px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "17px",
                  cursor: "pointer",
                }}
              >
                Log Your Mood First
              </button>
            </div>
          )}

          {!loading && currentPlaylist && (
            <div>
              <p style={{ fontSize: "20px", color: "#4caf50", marginBottom: "30px" }}>
                We picked these songs to support your <strong>{todayMood}</strong> mood today 🌿
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "30px" }}>
                {currentPlaylist.songs.map((song, i) => (
                  <a
                    key={i}
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      padding: "20px",
                      background: currentPlaylist.color,
                      borderRadius: "20px",
                      textDecoration: "none",
                      color: "#2e7d32",
                      fontSize: "18px",
                      fontWeight: "500",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-4px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    🎧 {song.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Music;